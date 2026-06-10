import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterAuthDto {
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

  @IsDateString()
  fechaNacimiento!: string;

  @IsOptional()
  descripcion?: string;
}
