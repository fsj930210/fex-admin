import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UploadModule } from './upload/upload.module'
import { TreeModule } from './tree/tree.module'
import { I18nModule } from './i18n/i18n.module'

@Module({
  imports: [I18nModule, TreeModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
