import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UploadModule } from './upload/upload.module'
import { TreeModule } from './tree/tree.module'

@Module({
  imports: [TreeModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
