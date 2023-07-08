import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenError extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
