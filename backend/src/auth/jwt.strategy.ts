import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

// Support both ES256 (new Supabase) and HS256 (legacy)
const SUPPORTED_ALGORITHMS = ['ES256', 'HS256'] as const;

// Helper: try to parse JWK from env (JSON string)
function getJwk(): Record<string, any> | null {
  const jwkStr = process.env.SUPABASE_JWK;
  if (!jwkStr) return null;
  try {
    return JSON.parse(jwkStr);
  } catch {
    return null;
  }
}

function getLegacySecret(): string | null {
  return process.env.SUPABASE_JWT_SECRET || null;
}

/**
 * JwtStrategy - Verifies Supabase access tokens using either:
 *   1. ES256 via `jose` library (new Supabase JWT Signing Keys)
 *   2. HS256 via legacy SUPABASE_JWT_SECRET (fallback)
 *
 * Token algorithm is auto-detected from the JWT header.
 *
 * To get the JWK:
 *   1. Go to Supabase Dashboard → Settings → JWT Keys → JWT Signing Keys
 *   2. Copy the public key (JSON format)
 *   3. Set it as SUPABASE_JWK env variable
 */
@Injectable()
export class JwtStrategy {
  private jwk: Record<string, any> | null;
  private legacySecret: string | null;

  constructor() {
    this.jwk = getJwk();
    this.legacySecret = getLegacySecret();

    console.log('[JwtStrategy] initialized:');
    console.log('  JWK loaded:', this.jwk ? `yes (kid: ${this.jwk.kid})` : 'no');
    console.log('  Legacy secret loaded:', this.legacySecret ? `yes (length: ${this.legacySecret.length})` : 'no');

    if (!this.jwk && !this.legacySecret) {
      throw new Error(
        'Neither SUPABASE_JWK nor SUPABASE_JWT_SECRET is configured.\n' +
          'For ES256: set SUPABASE_JWK from Dashboard → JWT Keys → JWT Signing Keys → copy JWK.\n' +
          'For HS256: set SUPABASE_JWT_SECRET from Dashboard → JWT Keys → Legacy JWT Secret.',
      );
    }
  }

  /**
   * Verify a Bearer token. Returns the decoded payload on success.
   * Called by GqlAuthGuard.
   */
  async verifyToken(token: string): Promise<Record<string, any>> {
    const { decodeProtectedHeader } = await import('jose');

    // Decode header to detect algorithm
    const header = decodeProtectedHeader(token);
    const alg = header.alg;
    console.log('[JwtStrategy] token algorithm:', alg, '| kid:', header.kid);

    if (alg === 'ES256' && this.jwk) {
      // ES256 verification with JWK
      const { jwtVerify } = await import('jose');
      const key = await import('jose').then((j) =>
        j.importJWK(this.jwk!, 'ES256'),
      );
      const { payload } = await jwtVerify(token, key, {
        algorithms: ['ES256'],
      });
      console.log('[JwtStrategy] ES256 verified, payload:', {
        sub: payload.sub,
        aud: payload.aud,
        role: payload.role,
      });
      return payload as Record<string, any>;
    }

    if (alg === 'HS256' && this.legacySecret) {
      // HS256 verification with legacy secret
      const { jwtVerify } = await import('jose');
      const key = new TextEncoder().encode(this.legacySecret);
      const { payload } = await jwtVerify(token, key, {
        algorithms: ['HS256'],
      });
      console.log('[JwtStrategy] HS256 verified, payload:', {
        sub: payload.sub,
        aud: payload.aud,
        role: payload.role,
      });
      return payload as Record<string, any>;
    }

    // Algorithm mismatch or missing config
    throw new UnauthorizedException(
      `Token algorithm "${alg}" not supported. ` +
        (alg === 'ES256' && !this.jwk
          ? 'Configure SUPABASE_JWK env for ES256 verification.'
          : alg === 'HS256' && !this.legacySecret
            ? 'Configure SUPABASE_JWT_SECRET env for HS256 verification.'
            : 'Check Supabase JWT configuration.'),
    );
  }
}
