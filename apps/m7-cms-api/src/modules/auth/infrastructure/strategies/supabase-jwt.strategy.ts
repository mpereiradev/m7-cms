import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwksRsa from 'jwks-rsa';
import type { JwtPayload } from '../../application/use-cases/validate-jwt.use-case.js';

@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(
  Strategy,
  'supabase-jwt',
) {
  constructor() {
    const jwksUrl = process.env.SUPABASE_JWKS_URL;
    if (!jwksUrl) {
      throw new Error('SUPABASE_JWKS_URL environment variable is required.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: jwksUrl,
      }),
      algorithms: ['ES256', 'RS256'],
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid JWT: missing sub claim.');
    }
    return payload;
  }
}
