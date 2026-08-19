import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class GetI18nBundlesDto {
  @IsString()
  namespaces = 'common'

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5000)
  delay?: number

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  fail?: boolean
}
