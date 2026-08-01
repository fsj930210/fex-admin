import { IsHash } from 'class-validator'

export class CheckUploadDto {
  @IsHash('md5')
  declare md5: string
}
