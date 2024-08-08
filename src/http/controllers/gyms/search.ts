import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1)
  })

  const { query, page } = searchGymsQuerySchema.parse(request.body)

  const serarchGymsUseCase = makeSearchGymsUseCase()

  const {gyms} = await serarchGymsUseCase.execute({
    query,
    page
  })

  return reply.status(200).send({
    gyms
  })
}
