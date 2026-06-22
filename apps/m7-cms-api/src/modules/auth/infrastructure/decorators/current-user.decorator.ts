import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserContext } from '../../domain/entities/user-context.entity.js';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserContext;
  },
);
