import { FastifyInstance } from 'fastify'
import { register } from './controllets/register-controller'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
}
