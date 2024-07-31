import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)

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
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in twice in the same day ', async () => {
    vi.setSystemTime(new Date(2023, 1, 24, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 1, 24, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    vi.setSystemTime(new Date(2023, 1, 25, 8, 0, 0))
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
