import type { FastifyReply, FastifyRequest } from 'fastify';

import { SESSION_COOKIE_NAME } from '../core/session';

export const notSignedInHook = (req: FastifyRequest, _res: FastifyReply) => {
  // if (isUserSignedIn(req.session)) {

  // }
  const result = req.unsignCookie(req.cookies[SESSION_COOKIE_NAME] || '');
  console.log('HERE2', result, req.cookies[SESSION_COOKIE_NAME], req.session);

  return Promise.resolve();
};
