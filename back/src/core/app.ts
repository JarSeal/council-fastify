import path from 'path';
import fs from 'fs';
import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import cookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import {
  ENVIRONMENT,
  CLIENT_HOST_NAMES,
  IS_PRODUCTION,
  SESSION_SECRET,
  SESSION_COOKIE_NAME,
  getConfig,
  getSysSetting,
} from './config';
import type { Environment } from './config';
import apis from './apis';
import { initDB } from './db';
import { sessionStore } from './sessionStore';
import { errors } from './errors';

export const apiRoot = '/api';

const initApp = async (): Promise<FastifyInstance> => {
  const envToLogger = {
    development: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    production: true,
    test: false,
  };

  // Fastify
  const app = fastify({
    logger: envToLogger[ENVIRONMENT as Environment],
  }).withTypeProvider<TypeBoxTypeProvider>();

  // CORS
  await app.register(fastifyCors, {
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);
      } else {
        const hostNameFromRequest = new URL(origin).hostname;
        const hostNameArrayFromEnv = CLIENT_HOST_NAMES.split(',').map((h) => h.trim());
        getSysSetting('allowedHostNames')
          .then((value) => {
            const sysValues = (value as string).split(',').map((h) => h.trim());
            const hostNames = [...hostNameArrayFromEnv, ...sysValues];
            if (hostNames.includes(hostNameFromRequest)) {
              cb(null, true);
            } else {
              cb(new errors.UNAUTHORIZED(`Origin not allowed: ${origin}`), false);
            }
          })
          .catch(() => cb(new Error('CORS checker failed'), false));
      }
    },
  });

  // Database
  await initDB(app);

  // Cookies and session
  const cookieSharedConfig = {
    httpOnly: IS_PRODUCTION,
    secure: IS_PRODUCTION,
    path: '/',
    maxAge: getConfig<number>('security.sessionMaxAge', 3600) * 1000,
  };
  await app.register(cookie);
  await app.register(fastifySession, {
    secret: SESSION_SECRET,
    cookieName: SESSION_COOKIE_NAME,
    cookie: cookieSharedConfig,
    rolling: true,
    store: sessionStore,
  });

  // API routes
  await app.register(apis, { prefix: apiRoot });

  // Static files
  let publicPath = path.join(__dirname, '../public');
  if (!fs.existsSync(publicPath)) {
    // For development
    publicPath = path.join(__dirname, '../../../shared/public');
  }
  await app.register(fastifyStatic, {
    root: publicPath,
    prefix: '/public/',
  });

  // Client routes (all GET routes, except the GET API routes)
  app.get('*', (_, res) => res.sendFile('index.html'));

  return app;
};

export default initApp;
