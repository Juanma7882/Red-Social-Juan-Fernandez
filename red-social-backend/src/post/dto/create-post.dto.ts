// create-post.dto.ts
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreatePostDto {
  @IsNotEmpty({ message: 'El título es requerido' })
  @IsString({ message: 'El título debe ser un texto' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El título no puede exceder los 200 caracteres' })
  titulo!: string;

  @IsNotEmpty({ message: 'El mensaje es requerido' })
  @IsString({ message: 'El mensaje debe ser un texto' })
  @MinLength(1, { message: 'El mensaje no puede estar vacío' })
  @MaxLength(5000, {
    message: 'El mensaje no puede exceder los 5000 caracteres',
  })
  mensaje!: string;

  @IsOptional()
  @IsString({ message: 'La imagen debe ser una URL o ruta válida' })
  imagen?: string;
}
