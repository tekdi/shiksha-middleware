import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MemoryStore } from 'cache-manager-memory-store';
import { redisStore } from 'cache-manager-redis-yet';

/**
 * Cache backing store.
 *
 * The middleware caches a user's effective privileges and roles. With the previous
 * in-process MemoryStore that cache was per-pod, so a permission change took effect
 * on some replicas and not others — and cache invalidation was impossible to
 * implement meaningfully. Redis makes the cache shared, which is what the RBAC plan
 * (§18) needs before invalidation can work.
 *
 * Redis is used when `REDIS_HOST` is set. If it is unset, or the connection cannot
 * be established at startup, this falls back to the in-process MemoryStore and logs
 * loudly. Falling back keeps the service bootable without Redis (local dev, and any
 * environment where the vars have not been rolled out yet) at the cost of losing
 * cross-pod consistency — never at the cost of authorization correctness, since a
 * cache miss always re-queries the database.
 */
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST');
        const ttl = Number(configService.get('TTL')) || undefined;

        if (!host?.trim()) {
          console.warn(
            '[cache] REDIS_HOST not set — using in-process memory store. ' +
              'Privilege cache will not be shared across replicas.',
          );
          return { store: MemoryStore, ttl };
        }

        const port = Number(configService.get('REDIS_PORT')) || 6379;
        const password = configService.get<string>('REDIS_PASSWORD') || undefined;
        const database = Number(configService.get('REDIS_DB')) || 0;

        try {
          const store = await redisStore({
            socket: { host, port },
            password: password?.trim() ? password : undefined,
            database,
            ttl,
          });

          // node-redis emits 'error' on every connection drop and reconnect
          // attempt. An unhandled 'error' on an EventEmitter takes the process
          // down, so this listener is required, not optional: a Redis blip must
          // degrade the cache, never kill the middleware. Reads and writes are
          // individually guarded in PermissionsService, which falls back to the
          // database on failure.
          const client: any = (store as any).client;
          client?.on?.('error', (err: Error) => {
            console.error(`[cache] Redis client error: ${err?.message}`);
          });

          console.log(`[cache] using Redis at ${host}:${port} db=${database}`);
          return { store, ttl };
        } catch (error) {
          console.error(
            `[cache] Redis at ${host}:${port} unavailable (${error?.message}) — ` +
              'falling back to in-process memory store. Privilege cache will not ' +
              'be shared across replicas.',
          );
          return { store: MemoryStore, ttl };
        }
      },
    }),
  ],
})
export class AppCacheModule {}
