import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users')

    return {
      users,
    }
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = createUserBodySchema.parse(request.body)

    const id = randomUUID()

    await knex('users').insert({
      id,
      email,
      password,
    })

    reply.cookie('sessionId', id, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    reply.status(201).send()
  })
}
