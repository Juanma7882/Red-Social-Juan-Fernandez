import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.registerUser(registerAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('navbar')
  @UseGuards(JwtGuard)
  getNavbarUser(@Req() req) {
    return this.authService.getNavbarUser(req.user);
  }

  @Post('refresh')
  refresh(@Body() user: any) {
    return this.authService.refresh(user);
  }

  @UseGuards(JwtGuard)
  @Post('authorize')
  authorize(@Req() req) {
    return this.authService.authorize(req.user);
  }
}
