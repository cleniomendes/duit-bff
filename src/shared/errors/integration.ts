import { HttpException, HttpStatus } from '@nestjs/common';
import LoggerManager from '@shared/utilities/logger-manager';
import { IRequestError } from '@shared/interfaces';

export class IntegrationError extends HttpException {
  private options: IRequestError;

  constructor(service: string, err: IRequestError) {
    super(service, HttpStatus.INTERNAL_SERVER_ERROR);
    this.options = err;

    LoggerManager.log('application', {
      origin: 'integration',
      type: 'error',
      service,
      err,
    });
  }

  getOptions(): IRequestError {
    return this.options;
  }
}
