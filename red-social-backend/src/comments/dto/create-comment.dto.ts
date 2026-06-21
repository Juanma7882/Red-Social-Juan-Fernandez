import { IsMongoId, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsMongoId()
  postId!: string;

  @IsString()
  @MinLength(1)
  mensaje!: string;
}
