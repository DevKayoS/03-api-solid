import { makeGetMetricsUseCase } from '@/use-cases/factories/make-get-metrics-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getMetricsUseCase = makeGetMetricsUseCase()

  const {checkInsCount} = await getMetricsUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    checkInsCount
  })
}
