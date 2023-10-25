import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies

    const meals = await knex('meals').where('session_id', sessionId).select()

    return {
      meals,
    }
  })

  app.get(
    '/metrics',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies

      const meals = await knex('meals')
        .where('session_id', sessionId)
        .orderBy('timestamp', 'asc')
        .select()

      const countMeals = meals.length
      const countMealsIsDiet = meals.filter((meal) => meal.is_diet).length
      const countMealsIsNotDiet = countMeals - countMealsIsDiet

      let bestStreak = 0
      let streak = 0

      for (let i = 0; i < meals.length; i++) {
        if (meals[i].is_diet) {
          streak++
        } else {
          streak = 0
        }

        if (streak > bestStreak) {
          bestStreak = streak
        }
      }

      return {
        countMeals,
        countMealsIsDiet,
        countMealsIsNotDiet,
        bestStreak,
      }
    },
  )

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(request.params)

    const { sessionId } = request.cookies

    const meal = await knex('meals')
      .where({
        session_id: sessionId,
        id,
      })
      .first()

    return {
      meal,
    }
  })

  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        is_diet: z.boolean(),
        timestamp: z.string(),
      })

      const { name, description, is_diet, timestamp } =
        createMealBodySchema.parse(request.body)

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        is_diet,
        timestamp,
        session_id: sessionId,
      })

      reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const editMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        is_diet: z.boolean(),
        timestamp: z.string(),
      })

      const { name, description, is_diet, timestamp } =
        editMealBodySchema.parse(request.body)

      await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .first()
        .update({
          name,
          description,
          is_diet,
          timestamp,
        })

      reply.status(202).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .first()
        .delete()

      reply.status(202).send()
    },
  )
}
