import { IsHash, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class InitMultipartDto {
  @IsString()
  declare name: string;

  @IsInt()
  @Min(0)
  declare size: number;

  @IsOptional()
  @IsHash('md5')
  declare md5?: string;
}
