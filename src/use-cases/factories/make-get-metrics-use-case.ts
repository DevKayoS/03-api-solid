import { GetUserMetricsUseCase } from '../get-user-metrics'
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository'

export function makeGetMetricsUseCase() {
  const checkInRepository = new PrismaCheckInRepository()
  const getMetricsUseCase = new GetUserMetricsUseCase(checkInRepository)

  return getMetricsUseCase
}
