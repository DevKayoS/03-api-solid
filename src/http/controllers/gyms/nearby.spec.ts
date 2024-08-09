import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript gym',
        description: 'some description',
        phone: '11999999',
        latitude: -23.6525394,
        longitude: -46.5369877,
      })
    await request(app.server)
      .post('/gyms/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript gym',
        description: 'some description',
        phone: '11999999',
        latitude: -23.4162273,
        longitude: -46.3469233,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -23.6525394,
        longitude: -46.5369877,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual(
      expect.objectContaining([{ title: 'Javascript gym' }]),
    )
  })
})
