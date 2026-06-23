import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  nombre!: string;

  @IsString()
  apellido!: string;

  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).*$/, {
    message: 'La contraseña debe tener una mayúscula y un número',
  })
  password!: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  imagenPerfil?: string;

  @IsOptional()
  @IsEnum(['usuario', 'administrador'])
  perfil?: string;
}
