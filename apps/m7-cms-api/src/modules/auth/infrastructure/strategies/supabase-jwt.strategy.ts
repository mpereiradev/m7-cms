import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwksRsa from 'jwks-rsa';
import type { JwtPayload } from '../../application/use-cases/validate-jwt.use-case.js';

@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(
  Strategy,
  'supabase-jwt',
) {
  private static readonly logger = new Logger(SupabaseJwtStrategy.name);

  constructor() {
    const jwksUrl = process.env.SUPABASE_JWKS_URL?.trim();
    if (!jwksUrl) {
      throw new Error('SUPABASE_JWKS_URL environment variable is required.');
    }

    SupabaseJwtStrategy.logger.log(`JWKS URI: ${jwksUrl}`);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: jwksUrl,
        handleSigningKeyError: (err, cb) => {
          SupabaseJwtStrategy.logger.error(
            `JWKS signing key error: ${err?.message ?? String(err)}`,
          );
          cb(err);
        },
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
