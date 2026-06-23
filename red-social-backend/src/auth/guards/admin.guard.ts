import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';

@Injectable()
export class AdminGuard extends JwtGuard {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const validUser = super.handleRequest(err, user, info, context);
    if (validUser?.perfil !== 'administrador') {
      throw new ForbiddenException('Solo administradores');
    }
    return validUser;
  }
}
