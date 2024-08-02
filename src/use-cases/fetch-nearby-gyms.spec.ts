import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FeatchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FeatchNearbyGymsUseCase

describe('Featch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FeatchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to featch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'near gym',
      description: null,
      phone: null,
      latitude: -23.6525394,
      longitude: -46.5369877,
    })
    // -23.4162273,-46.3469233
    await gymsRepository.create({
      title: 'far gym',
      description: null,
      phone: null,
      latitude: -23.4162273,
      longitude: -46.3469233,
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.6525394,
      userLongitude: -46.5369877,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'near gym' })])
  })
  it.skip('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Typescript gym ${i}`,
        description: null,
        phone: null,
        latitude: -23.6525394,
        longitude: -46.5369877,
      })
    }
    const { gyms } = await sut.execute({
      query: 'Typescript',
      page: 2,
    })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Typescript gym 21' }),
      expect.objectContaining({ title: 'Typescript gym 22' }),
    ])
  })
})
