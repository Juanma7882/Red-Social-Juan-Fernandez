import { IsString, MinLength, Matches } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  identifier!: string; // email o username

  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).*$/, {
    message: 'La contraseña debe tener una mayúscula y un número',
  })
  password!: string;
}
