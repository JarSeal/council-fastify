// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fastify from 'fastify';

declare module 'fastify' {
  export interface FastifyRequest {
    session: {
      sessionId: string;
      username: string;
      expires: Date;
    } | null;
  }
}
