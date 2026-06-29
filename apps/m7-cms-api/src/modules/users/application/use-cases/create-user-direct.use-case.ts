import {
  Inject,
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { TenantUserEntity } from '../../domain/entities/tenant-user.entity.js';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../ports/i-user-repository.port.js';

export interface CreateUserDirectInput {
  email: string;
  name: string;
  password: string;
  tenantId: string;
  role: string;
}

@Injectable()
export class CreateUserDirectUseCase {
  private _supabase: SupabaseClient | null = null;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  private get supabase(): SupabaseClient {
    if (!this._supabase) {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SECRET_KEY;
      if (!url || !key || key.startsWith('placeholder')) {
        throw new InternalServerErrorException(
          'Supabase admin credentials not configured.',
        );
      }
      this._supabase = createClient(url, key);
    }
    return this._supabase;
  }

  async execute(input: CreateUserDirectInput): Promise<TenantUserEntity> {
    // 1. Create Supabase Auth user with confirmed email + password
    const { data: authData, error: authError } =
      await this.supabase.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
        user_metadata: { full_name: input.name },
      });

    if (authError) {
      if (authError.message.toLowerCase().includes('already registered')) {
        throw new ConflictException(
          `Usuario com email "${input.email}" ja existe.`,
        );
      }
      throw new InternalServerErrorException(
        `Erro ao criar usuario: ${authError.message}`,
      );
    }

    const supabaseUserId = authData.user.id;

    // 2. Upsert local DB record using the Supabase Auth UUID as the primary key
    const tenantUser = await this.userRepository.createUserWithId({
      id: supabaseUserId,
      email: input.email,
      name: input.name,
      tenantId: input.tenantId,
      role: input.role,
    });

    return tenantUser;
  }
}
