import { HttpException, HttpStatus } from '@nestjs/common';
import LoggerManager from '@shared/utilities/logger-manager';

export class MailError extends HttpException {
  constructor(err: unknown) {
    super('mail-error', HttpStatus.INTERNAL_SERVER_ERROR);

    LoggerManager.log('application', {
      origin: 'mail',
      type: 'error',
      err,
    });
  }
}
