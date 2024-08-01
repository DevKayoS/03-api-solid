import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'
import { Decimal } from '@prisma/client/runtime/library'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })
  it('should be able to create gym ', async () => {
    const { gym } = await sut.execute({
      title: 'Typescript gym',
      description: null,
      phone: null,
      latitude: -23.6525394,
      longitude: -46.5369877,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
