import { IsString, MaxLength, MinLength } from 'class-validator'

export class SearchTreeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  keyword!: string
}
