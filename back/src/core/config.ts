import { config } from 'dotenv';
import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

import * as CONFIG from '../../../CONFIG.json';

config();

export type Environment = 'development' | 'production' | 'test';
export const ENVIRONMENT =
  ['development', 'production', 'test'].find((env) => env === process.env.NODE_ENV) || 'production';
export const IS_PRODUCTION = ENVIRONMENT === 'production';

export const HOST = process.env.HOST || '127.0.0.1';
export const PORT = parseInt(process.env.PORT || '4000');

// comma separated host names
export const CLIENT_HOST_NAMES = process.env.CLIENT_HOST_NAMES || '';

export const MONGODB_URI = process.env.MONGODB_URI || '';
export const MONGODB_URI_TEST = process.env.MONGODB_URI_TEST || '';

// @TODO: move these constants to the shared package when it is implemented
export const CSRF_HEADER_NAME = 'x-council-csrf';
export const CSRF_HEADER_VALUE = '1';

export const HASH_SALT_ROUNDS = process.env.HASH_SALT_ROUNDS || 10;
export const URL_TOKEN_SECRET =
  ENVIRONMENT === 'test' ? 'testsecret' : process.env.URL_TOKEN_SECRET || '123';
export const SESSION_SECRET =
  process.env.SESSION_SECRET || 'a secret with minimum length of 32 characters';
export const SESSION_COOKIE_NAME = IS_PRODUCTION ? `__Host-${'counclSess'}` : 'counclSess';

const configFileSchema = Type.Object({
  user: Type.Object({
    minUsernameLength: Type.Number(),
    maxUsernameLength: Type.Number(),
    minPassLength: Type.Number(),
    maxPassLength: Type.Number(),
    maxEmails: Type.Number(),
  }),
});
export type ConfigFile = Static<typeof configFileSchema>;

export const getConfig = <T>(path?: string, defaultValue?: unknown): T => {
  const conf = CONFIG ? (CONFIG as ConfigFile) : {};
  const returnWrapper = (returnConf: unknown) => {
    if (returnConf === undefined && defaultValue === undefined) {
      // eslint-disable-next-line no-console
      console.warn(
        `Could not find getConfig path and defaultValue was undefined: ${
          path ? `'${path}'` : 'undefined'
        }`
      );
    } else if (returnConf === undefined) {
      return defaultValue as T;
    }
    return returnConf as T;
  };

  if (path) {
    const splitPath = path.split('.');
    if (splitPath.length === 1) {
      return returnWrapper(conf[path as keyof typeof conf]);
    }
    let returnConf = conf[splitPath[0] as keyof typeof conf];
    if (returnConf === undefined) {
      return returnWrapper(returnConf);
    }
    for (let i = 1; i < splitPath.length; i++) {
      const nextNode = splitPath[i] as keyof typeof returnConf;
      returnConf = returnConf[nextNode];
      if (returnConf === undefined) {
        return returnWrapper(returnConf);
      }
    }
    return returnWrapper(returnConf);
  }
  return conf as T;
};
