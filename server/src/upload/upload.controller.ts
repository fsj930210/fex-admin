import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { CheckUploadDto } from './dto/check-upload.dto.js';
import { CompleteMultipartDto } from './dto/complete-multipart.dto.js';
import { InitMultipartDto } from './dto/init-multipart.dto.js';
import { UploadService } from './upload.service.js';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('health')
  health() {
    return { ok: true };
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  upload(@Req() request: Request, @Headers('x-file-name') fileName?: string) {
    return this.uploadService.saveUpload(request, fileName);
  }

  @Post('multipart/init')
  @HttpCode(HttpStatus.OK)
  initMultipart(@Body() body: InitMultipartDto) {
    return this.uploadService.initMultipart(body);
  }

  @Get('multipart/check')
  checkUpload(@Query() query: CheckUploadDto) {
    return this.uploadService.checkUpload(query.md5);
  }

  @Put('multipart/:uploadId/parts/:partNumber')
  @HttpCode(HttpStatus.OK)
  uploadPart(
    @Req() request: Request,
    @Param('uploadId') uploadId: string,
    @Param('partNumber', ParseIntPipe) partNumber: number,
  ) {
    return this.uploadService.savePart(request, uploadId, partNumber);
  }

  @Get('multipart/:uploadId/parts')
  getUploadedParts(@Param('uploadId') uploadId: string) {
    return this.uploadService.getUploadedParts(uploadId);
  }

  @Post('multipart/:uploadId/complete')
  @HttpCode(HttpStatus.OK)
  completeMultipart(
    @Param('uploadId') uploadId: string,
    @Body() body: CompleteMultipartDto,
  ) {
    return this.uploadService.completeMultipart(uploadId, body);
  }
}
