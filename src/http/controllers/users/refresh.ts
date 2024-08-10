import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  await request.jwtVerify({ onlyCookie: true })


    // jamais colocar info sensiveis
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: request.user.sub,
        },
      },   
    )
    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: request.user.sub,
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
}
