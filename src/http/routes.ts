import { FastifyInstance } from 'fastify'
import { register } from './controllets/register'
import { authenticate } from './controllets/authenticate'
import { profile } from './controllets/profile'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // authenticated
  app.get('/me', profile)
}
