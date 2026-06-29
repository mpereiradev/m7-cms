import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  Role,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { ListTenantUsersUseCase } from '../../application/use-cases/list-tenant-users.use-case.js';
import { ListAllUsersUseCase } from '../../application/use-cases/list-all-users.use-case.js';
import { InviteUserUseCase } from '../../application/use-cases/invite-user.use-case.js';
import { UpdateUserRoleUseCase } from '../../application/use-cases/update-user-role.use-case.js';
import { RemoveUserUseCase } from '../../application/use-cases/remove-user.use-case.js';
import { CreateUserDirectUseCase } from '../../application/use-cases/create-user-direct.use-case.js';
import { InviteUserDto } from '../../application/dtos/invite-user.dto.js';
import { UpdateRoleDto } from '../../application/dtos/update-role.dto.js';
import { CreateUserDirectDto } from '../../application/dtos/create-user-direct.dto.js';
import { UserResponseDto } from '../../application/dtos/user-response.dto.js';
import { UserGlobalResponseDto } from '../../application/dtos/user-global-response.dto.js';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly listTenantUsersUseCase: ListTenantUsersUseCase,
    private readonly listAllUsersUseCase: ListAllUsersUseCase,
    private readonly inviteUserUseCase: InviteUserUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
    private readonly removeUserUseCase: RemoveUserUseCase,
    private readonly createUserDirectUseCase: CreateUserDirectUseCase,
  ) {}

  @Get()
  async list(
    @CurrentUser() user: UserContext,
  ): Promise<{ data: UserResponseDto[] | UserGlobalResponseDto[] }> {
    if (user.role === Role.SUPER_ADMIN) {
      const allUsers = await this.listAllUsersUseCase.execute();
      return { data: allUsers.map(UserGlobalResponseDto.fromEntity) };
    }
    const tenantUsers = await this.listTenantUsersUseCase.execute(
      user.tenantId,
    );
    return { data: tenantUsers.map(UserResponseDto.fromEntity) };
  }

  @Post('invite')
  @Roles(Role.ADMIN)
  async invite(
    @CurrentUser() user: UserContext,
    @Body() dto: InviteUserDto,
  ): Promise<{ data: UserResponseDto }> {
    const tenantUser = await this.inviteUserUseCase.execute({
      tenantId: user.tenantId,
      email: dto.email,
      name: dto.name,
    });
    return { data: UserResponseDto.fromEntity(tenantUser) };
  }

  @Put(':userId/role')
  @Roles(Role.ADMIN)
  async updateRole(
    @CurrentUser() user: UserContext,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateRoleDto,
  ): Promise<{ data: UserResponseDto }> {
    const tenantUser = await this.updateUserRoleUseCase.execute(
      user.tenantId,
      userId,
      dto.role,
    );
    return { data: UserResponseDto.fromEntity(tenantUser) };
  }

  @Post('direct')
  @Roles(Role.SUPER_ADMIN)
  async createDirect(
    @Body() dto: CreateUserDirectDto,
  ): Promise<{ data: UserResponseDto }> {
    const tenantUser = await this.createUserDirectUseCase.execute({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      tenantId: dto.tenantId,
      role: dto.role,
    });
    return { data: UserResponseDto.fromEntity(tenantUser) };
  }

  @Delete(':userId')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: UserContext,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.removeUserUseCase.execute(user.tenantId, userId);
  }
}
