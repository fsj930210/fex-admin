import { Controller, Get, Param, Query } from '@nestjs/common'
import { GetI18nBundlesDto } from './dto/get-i18n-bundles.dto.js'
import { I18nService } from './i18n.service.js'

@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Get('bundles/:locale')
  getBundles(@Param('locale') locale: string, @Query() query: GetI18nBundlesDto) {
    const namespaces = query.namespaces
      .split(',')
      .map((namespace) => namespace.trim())
      .filter(Boolean)
    return this.i18nService.getBundles(locale, namespaces, query.delay, query.fail)
  }
}
