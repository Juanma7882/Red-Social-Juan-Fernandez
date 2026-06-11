import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryPostDto {
  @IsOptional()
  @IsIn(['fecha', 'likes', 'guardados', 'compartidos'])
  orderBy?: string = 'fecha';

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string = '10';

  @IsOptional()
  @IsNumberString()
  offset?: string = '0';
}
