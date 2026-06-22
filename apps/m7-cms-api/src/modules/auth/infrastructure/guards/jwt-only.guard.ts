import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOnlyGuard extends AuthGuard('supabase-jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const passportResult = await super.canActivate(context);
    if (!passportResult) {
      throw new UnauthorizedException('Invalid JWT token.');
    }
    return true;
  }

  handleRequest<T>(err: Error | null, user: T): T {
    if (err) {
      throw new UnauthorizedException(err.message);
    }
    if (!user) {
      throw new UnauthorizedException('Authentication required.');
    }
    return user;
  }
}
