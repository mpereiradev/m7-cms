import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { ValidateJwtUseCase } from '../../application/use-cases/validate-jwt.use-case.js';
import type { UserContext } from '../../domain/entities/user-context.entity.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('supabase-jwt') {
  constructor(private readonly validateJwtUseCase: ValidateJwtUseCase) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Let passport validate the JWT signature first
    const passportResult = await super.canActivate(context);
    if (!passportResult) {
      throw new UnauthorizedException('Invalid JWT token.');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const jwtPayload = (request as any).user;

    // Extract X-Tenant-ID header
    const tenantId = request.headers['x-tenant-id'] as string | undefined;
    if (!tenantId) {
      throw new ForbiddenException('X-Tenant-ID header is required.');
    }

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(tenantId)) {
      throw new ForbiddenException('X-Tenant-ID must be a valid UUID.');
    }

    // Validate user-tenant association and build UserContext
    const userContext: UserContext = await this.validateJwtUseCase.execute(
      jwtPayload,
      tenantId,
    );

    // Replace req.user with full UserContext
    (request as any).user = userContext;

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
