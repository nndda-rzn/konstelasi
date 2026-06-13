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

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: supabaseJwtSecret,
    });
  }

  async validate(payload: any) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid JWT Payload: missing subject (sub)');
    }
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
