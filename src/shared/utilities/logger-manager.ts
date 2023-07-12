import { Logger } from '@nestjs/common';
import * as util from 'util';
import { getEnv } from '@shared/configuration/constants';
import moment from 'moment';

const { api } = getEnv();

const logReplacer = (data: string): string => {
  if (!data) return '';

  if (typeof data === 'string' && data.length > 3000) {
    data = data.slice(0, 3000);
  }

  return data;
};

const LoggerManager = {
  log: (action: string, data: unknown): void => {
    try {
      LoggerManager.logDebug(action, LoggerManager.format(data));
    } catch (err) {
      LoggerManager.logDebug('logger-manager', LoggerManager.format(err));
    }
  },

  logDebug: (action: string, data: string): void => {
    Logger.log(data, `${action}-${api.env}`);
  },

  format: (data: unknown): string => {
    return logReplacer(util.inspect(data, false, null));
  },

  databaseLogger: {
    logMigration: (o: unknown): void => {
      if (api.debug) {
        LoggerManager.log('application-log', {
          type: 'database',
          action: 'migration',
          data: o,
        });
      }
    },

    logQuery: (o: unknown): void => {
      if (api.debug) {
        LoggerManager.log('application-log', {
          type: 'database',
          action: 'query',
          data: o,
        });
      }
    },

    logQueryError: (o: unknown): void => {
      if (api.debug) {
        LoggerManager.log('application-log', {
          type: 'database',
          action: 'queryError',
          data: o,
        });
      }
    },

    logQuerySlow: (o: unknown): void => {
      if (api.debug) {
        LoggerManager.log('application-log', {
          type: 'database',
          action: 'querySlow',
          data: o,
        });
      }
    },

    logSchemaBuild: (o: unknown): void => {
      if (api.debug) {
        LoggerManager.log('application-log', {
          type: 'database',
          action: 'schemaBuild',
          data: o,
        });
      }
    },

    log: (o: unknown): void => {
      if (api.debug) {
        LoggerManager.log('application-log', {
          type: 'database',
          action: 'log',
          data: o,
        });
      }
    },
  },

  mailLogger: {
    level: (o: unknown): void => {
      if (api.debug) {
        LoggerManager.log('application-log', {
          type: 'mail',
          action: 'level',
          data: o,
        });
      }
    },

    trace: (o: unknown): void => {
      if (api.debug) {
        LoggerManager.log('application-log', {
          type: 'mail',
          action: 'trace',
          data: o,
        });
      }
    },

    debug: (o: unknown): void => {
      if (api.debug) {
        LoggerManager.log('application-log', {
          type: 'mail',
          action: 'debug',
          data: o,
        });
      }
    },

    info: (o: unknown): void => {
      if (api.debug) {
        LoggerManager.log('application-log', {
          type: 'mail',
          action: 'info',
          data: o,
        });
      }
    },

    warn: (o: unknown): void => {
      if (api.debug) {
        LoggerManager.log('application-log', {
          type: 'mail',
          action: 'warn',
          data: o,
        });
      }
    },

    error: (o: unknown): void => {
      if (api.debug) {
        LoggerManager.log('application-log', {
          type: 'mail',
          action: 'error',
          data: o,
        });
      }
    },

    fatal: (o: unknown): void => {
      if (api.debug) {
        LoggerManager.log('application-log', {
          type: 'mail',
          action: 'fatal',
          data: o,
        });
      }
    },
  },
};

export function parseTraceLogs(origin: string, operation: unknown): void {
  try {
    LoggerManager.log('application', {
      origin,
      operation: {
        ...(operation as Record<string, unknown>),
        createdAt: moment().toDate(),
      },
    });
  } catch (err) {
    // nothing
  }
}

export default LoggerManager;
