import { FastifyInstance } from 'fastify'
import { register } from './controllets/register'
import { authenticate } from './controllets/authenticate'
import { profile } from './controllets/profile'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // authenticated
  app.get('/me', {onRequest: [verifyJWT]} ,profile)
}
