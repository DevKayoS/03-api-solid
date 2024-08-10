import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({ email, password })

    // jamais colocar info sensiveis
    const token = await reply.jwtSign(
      {
        role: user.role
      },
      {
        sign: {
          sub: user.id,
        },
      },   
    )
    const refreshToken = await reply.jwtSign(
      {
        role: user.role
      },
      { 
        sign: {
          sub: user.id,
          expiresIn: '7d' // o usuarios so vai perder o login se ele passar 7 dias sem logar na maquina
        },
      },   
    )
    
    return reply
    .setCookie('refreshToken', refreshToken,{
      path: '/', // todo nosso backend pode ler esse cookie
      secure: true, // encripitando o refrehToken para HTTPS
      sameSite: true,  
      httpOnly: true,
    })
    .status(200).send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
