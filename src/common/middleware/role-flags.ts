import { Request } from 'express';

/**
 * A role whose holders need downstream services to relax some validation, and
 * the query parameters that tell those services so.
 *
 * More than one parameter per role is allowed, for where services settled on
 * different spellings — each is appended, so a service is satisfied without
 * another pass through this middleware.
 */
export interface RoleFlag {
  /** Role code as it appears in the `Roles` table, matched case-insensitively. */
  role: string;
  /** Query parameters asserted for a caller holding that role. */
  params: readonly string[];
}

/**
 * The table this whole module is driven by. To flag a new role downstream, add a
 * row — nothing else in this service needs to change: every name listed here is
 * both asserted on the way out and reserved (stripped) on the way in.
 *
 * `observer` is a read-only role held by users who view programmes they take no
 * part in — reviewers, auditors, guests. Services skip the membership/ownership
 * validations that would otherwise reject such a caller.
 */
export const ROLE_FLAGS: readonly RoleFlag[] = [
  { role: 'observer', params: ['isObserver'] },
];

/** The only value a flag is ever sent with; anything else means "not set". */
export const ROLE_FLAG_VALUE = 'true';

/** Every parameter name this middleware reserves, across all roles. */
export const RESERVED_FLAG_PARAMS: readonly string[] = Array.from(
  new Set(ROLE_FLAGS.flatMap((flag) => flag.params)),
);

const RESERVED_KEYS = new Set(
  RESERVED_FLAG_PARAMS.map((param) => param.toLowerCase()),
);

/**
 * Whether a query or body key is one this middleware reserves.
 *
 * Matched case-insensitively on purpose: these names are reserved in this
 * contract, and a service that reads one through a case-folding layer must not
 * become reachable by sending `ISOBSERVER=true`.
 */
export function isReservedFlagKey(key: string): boolean {
  return typeof key === 'string' && RESERVED_KEYS.has(key.toLowerCase());
}

function decodeQueryKey(rawKey: string): string {
  try {
    return decodeURIComponent(rawKey.replace(/\+/g, ' '));
  } catch {
    // Malformed percent-encoding: compare the raw key rather than throw on a
    // request we are only trying to sanitize.
    return rawKey;
  }
}

function splitAtFirstQuestionMark(url: string): [string, string] {
  const index = url.indexOf('?');
  return index === -1 ? [url, ''] : [url.slice(0, index), url.slice(index + 1)];
}

/**
 * Drop every copy of every reserved flag from a raw query string, leaving the
 * rest byte-for-byte intact. Round-tripping through `URLSearchParams` would
 * re-encode unrelated parameters and change what downstream services receive.
 */
export function stripReservedFlagsFromQueryString(queryString: string): string {
  if (!queryString) {
    return queryString;
  }
  const pairs = queryString.split('&');
  const kept = pairs.filter(
    (pair) => !isReservedFlagKey(decodeQueryKey(pair.split('=')[0])),
  );
  return kept.length === pairs.length ? queryString : kept.join('&');
}

/** Delete the reserved keys from a parsed query/body object, in place. */
export function stripReservedFlagsFromObject(value: unknown): void {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    Buffer.isBuffer(value)
  ) {
    return;
  }
  for (const key of Object.keys(value)) {
    if (isReservedFlagKey(key)) {
      delete (value as Record<string, unknown>)[key];
    }
  }
}

/**
 * Remove anything the client sent under a reserved name, so the only copies that
 * can reach a service are the ones this middleware adds itself.
 *
 * These parameters are assertions made by this middleware, never client input.
 * This runs before any routing or authorization decision, so a flag's presence
 * downstream can only mean the middleware added it after verifying the JWT and
 * reading the caller's roles from the database.
 *
 * Downstream services MUST read flags from the query string only. Body fields of
 * the same names are stripped on every path this service parses, but
 * `/assessment/v1/file/upload` is piped through as raw bytes and cannot be
 * scrubbed — a body field there stays attacker-controlled.
 */
export function stripClientRoleFlags(req: Request): void {
  // Express populates `req.query` once, in its own middleware, before this one
  // runs — rewriting the URL alone would leave that parsed copy in place.
  stripReservedFlagsFromObject(req.query);
  stripReservedFlagsFromObject(req.body);

  const [originalPath, originalQuery] = splitAtFirstQuestionMark(
    req.originalUrl ?? '',
  );
  const sanitized = stripReservedFlagsFromQueryString(originalQuery);
  if (sanitized === originalQuery) {
    return;
  }

  const suffix = sanitized ? `?${sanitized}` : '';
  req.originalUrl = originalPath + suffix;
  req.url = splitAtFirstQuestionMark(req.url ?? '')[0] + suffix;
}

/**
 * The flag parameters that apply to a caller holding `roles`, deduplicated in
 * table order so two roles sharing a parameter assert it once.
 */
export function flagParamsForRoles(roles: unknown): string[] {
  if (!Array.isArray(roles)) {
    return [];
  }
  const held = new Set(
    roles
      .filter((role): role is string => typeof role === 'string')
      .map((role) => role.toLowerCase()),
  );
  const params: string[] = [];
  for (const flag of ROLE_FLAGS) {
    if (!held.has(flag.role.toLowerCase())) {
      continue;
    }
    for (const param of flag.params) {
      if (!params.includes(param)) {
        params.push(param);
      }
    }
  }
  return params;
}

/**
 * Append the flags earned by `roles` to an outgoing URL. Returns the URL
 * unchanged when the caller holds no flagged role — including when the guard
 * never ran, as on a public route, where `roles` is undefined.
 */
export function appendRoleFlags(url: string, roles: unknown): string {
  return flagParamsForRoles(roles).reduce((target, param) => {
    const separator = target.includes('?') ? '&' : '?';
    return `${target}${separator}${param}=${ROLE_FLAG_VALUE}`;
  }, url);
}
