import type { FastifyError, FastifyReply } from 'fastify';

import type { ErrorCodes } from './errors';

const isProd = process.env.ENVIRONMENT === 'prod';

export const cookieName = (name: string) => (isProd ? `__Host-${name}` : name);

export const SESSION_COOKIE_OPTIONS = {
  path: '/',
  httpOnly: isProd,
  secure: isProd,
  signed: true,
  maxAge: 3600, // 1 hour, @TODO: change this to be an admnin setting value
};
export const SESSION_COOKIE_NAME = cookieName('counclSess');

export const sendWithSessionCookie = (
  res: FastifyReply,
  payload:
    | (FastifyError & {
        code: ErrorCodes;
      })
    | ({ [k: string]: unknown } & { statusCode?: number }),
  status?: number
) =>
  res
    .status(status ? status : payload.statusCode || 200)
    .setCookie(SESSION_COOKIE_NAME, 'fooValue', SESSION_COOKIE_OPTIONS)
    .send(payload);

export const isUserSignedIn = (sessionId: string | null) => Boolean(sessionId);
