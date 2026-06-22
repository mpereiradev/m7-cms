import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  RolesGuard,
  PreviewTokenGuard,
  Roles,
  CurrentUser,
  Role,
  UserContext,
} from '../../../auth/infrastructure/auth.module.js';
import { CreatePageUseCase } from '../../application/use-cases/create-page.use-case.js';
import { UpdatePageUseCase } from '../../application/use-cases/update-page.use-case.js';
import { PublishPageUseCase } from '../../application/use-cases/publish-page.use-case.js';
import { DeletePageUseCase } from '../../application/use-cases/delete-page.use-case.js';
import { GetPageUseCase } from '../../application/use-cases/get-page.use-case.js';
import { ListPagesUseCase } from '../../application/use-cases/list-pages.use-case.js';
import { AddSectionUseCase } from '../../application/use-cases/add-section.use-case.js';
import { ReorderSectionsUseCase } from '../../application/use-cases/reorder-sections.use-case.js';
import {
  CreatePageDto,
  UpdatePageDto,
} from '../../application/dtos/create-page.dto.js';
import {
  CreateSectionDto,
  ReorderSectionsDto,
} from '../../application/dtos/create-section.dto.js';
import {
  PageResponseDto,
  SectionResponseDto,
} from '../../application/dtos/page-response.dto.js';

// ── Admin routes ───────────────────────────────────────────────────────

@Controller('api/v1/pages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PagesController {
  constructor(
    private readonly createPageUseCase: CreatePageUseCase,
    private readonly updatePageUseCase: UpdatePageUseCase,
    private readonly publishPageUseCase: PublishPageUseCase,
    private readonly deletePageUseCase: DeletePageUseCase,
    private readonly getPageUseCase: GetPageUseCase,
    private readonly listPagesUseCase: ListPagesUseCase,
    private readonly addSectionUseCase: AddSectionUseCase,
    private readonly reorderSectionsUseCase: ReorderSectionsUseCase,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.EDITOR)
  async list(
    @CurrentUser() user: UserContext,
    @Query('status') status?: string,
  ): Promise<{ data: PageResponseDto[] }> {
    const pages = await this.listPagesUseCase.execute(user.tenantId, {
      status,
    });
    return { data: pages.map(PageResponseDto.fromEntity) };
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserContext,
  ): Promise<{ data: PageResponseDto }> {
    const page = await this.getPageUseCase.execute(user.tenantId, id);
    return { data: PageResponseDto.fromEntity(page) };
  }

  @Post()
  @Roles(Role.ADMIN, Role.EDITOR)
  async create(
    @Body() dto: CreatePageDto,
    @CurrentUser() user: UserContext,
  ): Promise<{ data: PageResponseDto }> {
    const page = await this.createPageUseCase.execute({
      tenantId: user.tenantId,
      slug: dto.slug,
      translations: dto.translations,
    });
    return { data: PageResponseDto.fromEntity(page) };
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePageDto,
    @CurrentUser() user: UserContext,
  ): Promise<{ data: PageResponseDto }> {
    const page = await this.updatePageUseCase.execute(user.tenantId, id, dto);
    return { data: PageResponseDto.fromEntity(page) };
  }

  @Put(':id/publish')
  @Roles(Role.ADMIN)
  async publish(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserContext,
  ): Promise<{ data: PageResponseDto }> {
    const page = await this.publishPageUseCase.execute(user.tenantId, id);
    return { data: PageResponseDto.fromEntity(page) };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserContext,
  ): Promise<void> {
    await this.deletePageUseCase.execute(user.tenantId, id);
  }

  // ── Sections ───────────────────────────────────────────────────────

  @Post(':id/sections')
  @Roles(Role.ADMIN, Role.EDITOR)
  async addSection(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateSectionDto,
    @CurrentUser() user: UserContext,
  ): Promise<{ data: SectionResponseDto }> {
    const section = await this.addSectionUseCase.execute(user.tenantId, {
      pageId: id,
      type: dto.type,
      order: dto.order,
      content: dto.content,
    });
    return { data: SectionResponseDto.fromEntity(section) };
  }

  @Put(':id/sections/reorder')
  @Roles(Role.ADMIN, Role.EDITOR)
  async reorderSections(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReorderSectionsDto,
    @CurrentUser() user: UserContext,
  ): Promise<{ message: string }> {
    await this.reorderSectionsUseCase.execute(user.tenantId, {
      pageId: id,
      sectionOrders: dto.sections,
    });
    return { message: 'Sections reordered successfully.' };
  }
}

// ── Preview route ──────────────────────────────────────────────────────

@Controller('api/v1/pages')
export class PagesPreviewController {
  constructor(private readonly getPageUseCase: GetPageUseCase) {}

  @Get(':id/preview')
  @UseGuards(PreviewTokenGuard)
  async preview(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('preview_token') _token: string,
  ): Promise<{ data: PageResponseDto }> {
    // PreviewTokenGuard validates the token and attaches previewData to request
    // For preview, we fetch without tenant filter since the token authorizes access
    const page = await this.getPageUseCase.execute(
      undefined as any, // tenant extracted from preview data
      id,
    );
    return { data: PageResponseDto.fromEntity(page) };
  }
}

// ── Public routes ──────────────────────────────────────────────────────

@Controller('api/v1/public/pages')
export class PagesPublicController {
  constructor(private readonly getPageUseCase: GetPageUseCase) {}

  @Get(':slug')
  async getBySlug(
    @Param('slug') slug: string,
    @Query('tenant_id') tenantId: string,
    @Query('lang') _lang?: string,
  ): Promise<{ data: PageResponseDto }> {
    const page = await this.getPageUseCase.executeBySlug(tenantId, slug);
    return { data: PageResponseDto.fromEntity(page) };
  }
}
