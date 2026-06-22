import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/infrastructure/auth.module.js';
import { TenantsModule } from './modules/tenants/infrastructure/tenants.module.js';
import { UsersModule } from './modules/users/infrastructure/users.module.js';
import { PagesModule } from './modules/pages/infrastructure/pages.module.js';
import { PostsModule } from './modules/posts/infrastructure/posts.module.js';
import { MediaModule } from './modules/media/infrastructure/media.module.js';
import { GalleryModule } from './modules/gallery/infrastructure/gallery.module.js';
import { SocialModule } from './modules/social/infrastructure/social.module.js';
import { BannersModule } from './modules/banners/infrastructure/banners.module.js';
import { StoresModule } from './modules/stores/infrastructure/stores.module.js';
import { ContactFormModule } from './modules/contact-form/infrastructure/contact-form.module.js';
import { SettingsModule } from './modules/settings/infrastructure/settings.module.js';

@Module({
  imports: [
    AuthModule,
    TenantsModule,
    UsersModule,
    PagesModule,
    PostsModule,
    MediaModule,
    GalleryModule,
    SocialModule,
    BannersModule,
    StoresModule,
    ContactFormModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
