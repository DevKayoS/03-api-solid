import { usersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-existis'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: usersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    // validando se ja existe o usuário
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    // criando hash da senha
    const password_hash = await hash(password, 6)
    // usando um repository pattern
    await this.usersRepository.create({ name, email, password_hash })
  }
}
