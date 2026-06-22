import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

// Domain
import { Role } from '../domain/entities/user-context.entity.js';

// Application — use-cases
import { ValidateJwtUseCase } from '../application/use-cases/validate-jwt.use-case.js';
import { GeneratePreviewTokenUseCase } from '../application/use-cases/generate-preview-token.use-case.js';
import { ValidatePreviewTokenUseCase } from '../application/use-cases/validate-preview-token.use-case.js';

// Application — ports
import { AUTH_PORT } from '../application/ports/i-auth.port.js';
import { PREVIEW_TOKEN_SERVICE } from '../application/use-cases/generate-preview-token.use-case.js';

// Infrastructure
import { SupabaseJwtStrategy } from './strategies/supabase-jwt.strategy.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { PreviewTokenGuard } from './guards/preview-token.guard.js';
import { JwtOnlyGuard } from './guards/jwt-only.guard.js';
import { PreviewTokenService } from './services/preview-token.service.js';
import { AuthDrizzleRepository } from './services/auth-drizzle.repository.js';
import { AuthController } from './controllers/auth.controller.js';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'supabase-jwt' })],
  controllers: [AuthController],
  providers: [
    // Strategy
    SupabaseJwtStrategy,

    // Port implementations
    {
      provide: AUTH_PORT,
      useClass: AuthDrizzleRepository,
    },
    {
      provide: PREVIEW_TOKEN_SERVICE,
      useClass: PreviewTokenService,
    },

    // Use-cases
    ValidateJwtUseCase,
    GeneratePreviewTokenUseCase,
    ValidatePreviewTokenUseCase,

    // Guards (provided so they can be injected)
    JwtAuthGuard,
    JwtOnlyGuard,
    RolesGuard,
    PreviewTokenGuard,
  ],
  exports: [
    // Guards
    JwtAuthGuard,
    JwtOnlyGuard,
    RolesGuard,
    PreviewTokenGuard,

    // Use-cases (for other modules to validate tokens)
    ValidateJwtUseCase,
    ValidatePreviewTokenUseCase,

    // Passport module (so other modules can use @UseGuards)
    PassportModule,
  ],
})
export class AuthModule {}

// Re-export for convenience
export { Role } from '../domain/entities/user-context.entity.js';
export { UserContext } from '../domain/entities/user-context.entity.js';
export { JwtAuthGuard } from './guards/jwt-auth.guard.js';
export { RolesGuard } from './guards/roles.guard.js';
export { PreviewTokenGuard } from './guards/preview-token.guard.js';
export { Roles, ROLES_KEY } from './decorators/roles.decorator.js';
export { CurrentUser } from './decorators/current-user.decorator.js';
export { JwtOnlyGuard } from './guards/jwt-only.guard.js';
