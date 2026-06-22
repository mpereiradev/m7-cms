import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { UserContext, Role } from '../../domain/entities/user-context.entity.js';
import { AUTH_PORT, type IAuthPort } from '../ports/i-auth.port.js';

export interface JwtPayload {
  sub: string;
  email?: string;
}

@Injectable()
export class ValidateJwtUseCase {
  constructor(
    @Inject(AUTH_PORT)
    private readonly authPort: IAuthPort,
  ) {}

  async execute(payload: JwtPayload, tenantId: string): Promise<UserContext> {
    const record = await this.authPort.findTenantUser(payload.sub, tenantId);

    if (!record) {
      throw new ForbiddenException(
        'User does not have access to this tenant.',
      );
    }

    return new UserContext({
      userId: payload.sub,
      tenantId,
      role: record.role as Role,
      email: payload.email ?? '',
    });
  }
}
