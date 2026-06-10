import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import JwtPayload from './interfaces/jwt-payload.auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerAuthDto: RegisterAuthDto) {
    const userExists = await this.usersService.findByEmailOrUsername(
      registerAuthDto.email,
    );

    if (userExists) {
      throw new Error('Usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(registerAuthDto.password, 10);

    const user = await this.usersService.create({
      ...registerAuthDto,
      password: hashedPassword,
    });

    const payload = {
      sub: user._id,
      email: user.email,
      username: user.username,
      perfil: user.perfil,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user,
    };
  }

  async login(loginDto: LoginAuthDto) {
    const user = await this.usersService.findByEmailOrUsername(
      loginDto.identifier,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.habilitado) {
      throw new UnauthorizedException('Usuario deshabilitado');
    }

    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
      perfil: user.perfil,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user,
    };
  }

  async authorize(user: JwtPayload) {
    const dbUser = await this.usersService.findOne(user.sub);

    if (!dbUser) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return dbUser;
  }

  async refresh(user: JwtPayload) {
    const payload: JwtPayload = {
      sub: user.sub,
      email: user.email,
      username: user.username,
      perfil: user.perfil,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }
}
