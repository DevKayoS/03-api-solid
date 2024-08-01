import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Typescript Gym',
      description: '',
      phone: '',
      latitude: -23.6525394,
      longitude: -46.5369877,
    })

    // using fake timer
    vi.useFakeTimers()
  })
  afterEach(() => {
    // ajusting for using real timer
    vi.useRealTimers()
  })
  it('should be able to check in ', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.6525394,
      userLongitude: -46.5369877,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in twice in the same day ', async () => {
    vi.setSystemTime(new Date(2023, 1, 24, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.6525394,
      userLongitude: -46.5369877,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -23.6525394,
        userLongitude: -46.5369877,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 1, 24, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.6525394,
      userLongitude: -46.5369877,
    })

    vi.setSystemTime(new Date(2023, 1, 25, 8, 0, 0))
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.6525394,
      userLongitude: -46.5369877,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Typescript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.4318888),
      longitude: new Decimal(-46.3407531),
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -23.6525394,
        userLongitude: -46.5369877,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
