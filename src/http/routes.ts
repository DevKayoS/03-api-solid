import { FastifyInstance } from 'fastify'
import { register } from './controllets/register-controller'
import { authenticate } from './controllets/authenticate-controller'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
}
