import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  findById(checkInId: string): Promise<CheckIn | null>
  findUserByIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  countByUserId(userId: string): Promise<number>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  save(checkIn: CheckIn): Promise<CheckIn>
}
