import { HttpException, HttpStatus } from '@nestjs/common';
import LoggerManager from '@shared/utilities/logger-manager';

export class PersistenceError extends HttpException {
  constructor(code: string, err: unknown) {
    super(code, HttpStatus.INTERNAL_SERVER_ERROR);

    LoggerManager.log('application', {
      origin: 'persistence',
      type: 'error',
      code,
      err,
    });
  }
}

export const PersistenceErrorCodes = {
  PAGINATION_ENTITY: 'pagination_entity',
  CREATE_ENTITY: 'create_entity',
  UPDATE_ENTITY: 'update_entity',
  GET_ENTITY: 'get_entity',
  DELETE_ENTITY: 'delete_entity',
  COUNT_ENTITY: 'count_entity',
};
