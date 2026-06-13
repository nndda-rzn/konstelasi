import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (!supabaseJwtSecret) {
      throw new Error(
        'SUPABASE_JWT_SECRET env variable is required. ' +
          'Get it from Supabase Dashboard > Settings > API > JWT Settings > JWT Secret.',
      );
    }

    console.log('[JwtStrategy] secret length:', supabaseJwtSecret.length);
    console.log('[JwtStrategy] secret prefix:', supabaseJwtSecret.slice(0, 12));

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: supabaseJwtSecret,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: any) {
    console.log('[JwtStrategy] payload:', {
      sub: payload?.sub,
      aud: payload?.aud,
      role: payload?.role,
      iss: payload?.iss,
      exp: payload?.exp,
    });
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid JWT Payload: missing subject (sub)');
    }
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
