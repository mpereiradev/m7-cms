import { Inject, Injectable, ConflictException } from '@nestjs/common';
import type { TenantUserEntity } from '../../domain/entities/tenant-user.entity.js';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../ports/i-user-repository.port.js';

export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE');

export interface IEmailService {
  sendInvitation(email: string, tenantName: string): Promise<void>;
}

export interface InviteUserInput {
  tenantId: string;
  email: string;
  name: string;
}

@Injectable()
export class InviteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async execute(input: InviteUserInput): Promise<TenantUserEntity> {
    // Create user record and tenant_users association with default 'viewer' role
    const tenantUser = await this.userRepository.createUserAndAssociate({
      tenantId: input.tenantId,
      email: input.email,
      name: input.name,
      role: 'viewer',
    });

    // Send invitation email (best-effort, don't fail the invitation)
    try {
      await this.emailService.sendInvitation(input.email, input.tenantId);
    } catch {
      // Log error but don't fail the invitation
      console.error(`Failed to send invitation email to ${input.email}`);
    }

    return tenantUser;
  }
}
