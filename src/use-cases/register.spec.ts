import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-existis'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  // deveria ser possivel registrar novo usuario
  it('should be able to register ', async () => {
    // in memory test databae pattern

    const { user } = await sut.execute({
      name: 'john doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  // testando se a senha esta sendo salva como hash no banco de dados
  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'john doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })
  // nao deve ser possivel cadastrar um novo usuario com um email ja existente
  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'john doe',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'john doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
