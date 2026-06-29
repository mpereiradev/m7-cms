import { Inject, Injectable } from '@nestjs/common';
import type { UserGlobalEntity } from '../../domain/entities/user-global.entity.js';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../ports/i-user-repository.port.js';

@Injectable()
export class ListAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<UserGlobalEntity[]> {
    return this.userRepository.findAllUsersWithTenants();
  }
}
