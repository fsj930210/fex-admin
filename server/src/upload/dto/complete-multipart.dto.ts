import { IsHash, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class CompleteMultipartDto {
  @IsString()
  declare name: string

  @IsInt()
  @Min(1)
  declare partCount: number

  @IsOptional()
  @IsHash('md5')
  declare md5?: string
}
