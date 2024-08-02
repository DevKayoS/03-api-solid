import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymsRequest {
  query: string
  page: number
}

interface SearchGymsesponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page
  }: SearchGymsRequest): Promise<SearchGymsesponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
