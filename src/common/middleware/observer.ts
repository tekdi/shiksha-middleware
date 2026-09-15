import { Request } from 'express';

/**
 * Role held by users who view programmes they take no part in — reviewers,
 * auditors, guests. Downstream services relax the membership/ownership
 * validations that would otherwise reject such a caller; `OBSERVER_FLAG_PARAM`
 * is how they are told.
 */
export const OBSERVER_ROLE = 'observer';

/**
 * Query parameter appended to a forwarded request when — and only when — the
 * authenticated caller holds `OBSERVER_ROLE` in the request's tenant.
 *
 * This is an assertion made by this middleware, never client input. Every
 * inbound request is scrubbed of a client-supplied copy by
 * `stripClientObserverFlag`, which runs before any routing or authorization
 * decision, so its presence downstream can only mean the middleware added it
 * after verifying the JWT and reading the user's roles from the database.
 *
 * Downstream services MUST read it from the query string only. A body field of
 * the same name is stripped on every path this service parses, but
 * `/assessment/v1/file/upload` is piped through as raw bytes and cannot be
 * scrubbed — a body field there stays attacker-controlled.
 */
export const OBSERVER_FLAG_PARAM = 'isObserver';

/** The only value the flag is ever sent with; anything else means "not set". */
export const OBSERVER_FLAG_VALUE = 'true';

const RESERVED_KEY = OBSERVER_FLAG_PARAM.toLowerCase();

/**
 * Matched case-insensitively on purpose: the name is reserved in this contract,
 * and a service that reads it through a case-folding layer must not become
 * reachable by sending `ISOBSERVER=true`.
 */
export function isObserverFlagKey(key: string): boolean {
  return typeof key === 'string' && key.toLowerCase() === RESERVED_KEY;
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
  return index === -1
    ? [url, '']
    : [url.slice(0, index), url.slice(index + 1)];
}

/**
 * Drop every copy of the flag from a raw query string, leaving the rest
 * byte-for-byte intact. Round-tripping through `URLSearchParams` would re-encode
 * unrelated parameters and change what downstream services receive.
 */
export function stripObserverFlagFromQueryString(queryString: string): string {
  if (!queryString) {
    return queryString;
  }
  const pairs = queryString.split('&');
  const kept = pairs.filter(
    (pair) => !isObserverFlagKey(decodeQueryKey(pair.split('=')[0])),
  );
  return kept.length === pairs.length ? queryString : kept.join('&');
}

/** Delete the reserved key from a parsed query/body object, in place. */
export function stripObserverFlagFromObject(value: unknown): void {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    Buffer.isBuffer(value)
  ) {
    return;
  }
  for (const key of Object.keys(value)) {
    if (isObserverFlagKey(key)) {
      delete (value as Record<string, unknown>)[key];
    }
  }
}

/**
 * Remove anything the client sent under the reserved name, so the only copy that
 * can reach a service is the one this middleware adds itself.
 */
export function stripClientObserverFlag(req: Request): void {
  // Express populates `req.query` once, in its own middleware, before this one
  // runs — rewriting the URL alone would leave that parsed copy in place.
  stripObserverFlagFromObject(req.query);
  stripObserverFlagFromObject(req.body);

  const [originalPath, originalQuery] = splitAtFirstQuestionMark(
    req.originalUrl ?? '',
  );
  const sanitized = stripObserverFlagFromQueryString(originalQuery);
  if (sanitized === originalQuery) {
    return;
  }

  const suffix = sanitized ? `?${sanitized}` : '';
  req.originalUrl = originalPath + suffix;
  req.url = splitAtFirstQuestionMark(req.url ?? '')[0] + suffix;
}

/** Whether the roles resolved for this user+tenant include the observer role. */
export function hasObserverRole(roles: unknown): boolean {
  return (
    Array.isArray(roles) &&
    roles.some(
      (role) => typeof role === 'string' && role.toLowerCase() === OBSERVER_ROLE,
    )
  );
}

/** Append the middleware-issued flag to an outgoing URL. */
export function appendObserverFlag(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${OBSERVER_FLAG_PARAM}=${OBSERVER_FLAG_VALUE}`;
}
