import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

interface CachedKeys {
  keys: any[];
  fetchedAt: number;
}

/**
 * JwtStrategy - Verifies Supabase access tokens.
 *
 * Auto-fetches ES256 public keys from Supabase JWKS endpoint.
 * Falls back to legacy HS256 if SUPABASE_JWT_SECRET is configured.
 *
 * Env:
 *   SUPABASE_URL              - required (for JWKS endpoint)
 *   SUPABASE_JWT_SECRET       - optional (legacy HS256 fallback)
 */
@Injectable()
export class JwtStrategy {
  private legacySecret: string | null;
  private supabaseUrl: string | null;
  private cachedKeys: CachedKeys | null = null;
  private keyCacheTTL = 60 * 60 * 1000; // 1 hour

  constructor() {
    this.legacySecret = process.env.SUPABASE_JWT_SECRET || null;
    this.supabaseUrl = process.env.SUPABASE_URL || null;

    if (!this.supabaseUrl && !this.legacySecret) {
      throw new Error(
        'Configure SUPABASE_URL (ES256) or SUPABASE_JWT_SECRET (HS256) in backend/.env',
      );
    }
  }

  private async getJwks(): Promise<any[]> {
    if (this.cachedKeys && Date.now() - this.cachedKeys.fetchedAt < this.keyCacheTTL) {
      return this.cachedKeys.keys;
    }

    if (!this.supabaseUrl) throw new Error('SUPABASE_URL not configured');

    const res = await fetch(`${this.supabaseUrl}/auth/v1/.well-known/jwks.json`);
    if (!res.ok) throw new Error(`Failed to fetch JWKS: HTTP ${res.status}`);
    const data = await res.json();
    this.cachedKeys = { keys: data.keys || [], fetchedAt: Date.now() };
    return this.cachedKeys.keys;
  }

  async verifyToken(token: string): Promise<Record<string, any>> {
    const { decodeProtectedHeader } = await import('jose');
    const header = decodeProtectedHeader(token);
    const alg = header.alg;
    const kid = header.kid as string | undefined;

    if (alg === 'ES256') {
      const keys = await this.getJwks();
      const key = keys.find((k: any) => !kid || k.kid === kid);
      if (!key) {
        throw new UnauthorizedException(
          `No matching key for kid "${kid}". Available: ${keys.map((k: any) => k.kid).join(', ')}`,
        );
      }
      const { jwtVerify, importJWK } = await import('jose');
      const cryptoKey = await importJWK(key, 'ES256');
      const { payload } = await jwtVerify(token, cryptoKey, { algorithms: ['ES256'] });
      return payload as Record<string, any>;
    }

    if (alg === 'HS256' && this.legacySecret) {
      const { jwtVerify } = await import('jose');
      const key = new TextEncoder().encode(this.legacySecret);
      const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
      return payload as Record<string, any>;
    }

    throw new UnauthorizedException(`Unsupported algorithm "${alg}"`);
  }
}
