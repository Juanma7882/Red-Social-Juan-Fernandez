import BaseError from './base.error';

export class UnauthorizedException extends BaseError {
  constructor(message: string = 'No autorizado') {
    super(message);
  }
}
