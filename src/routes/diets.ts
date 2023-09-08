import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function dietsRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const createDietBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      userId: z.string(),
      isDiet: z.boolean(),
    })

    const { name, description, userId, isDiet } = createDietBodySchema.parse(
      request.body,
    )

    const user = await hasUser(userId)

    if (!user) {
      return response.status(404).send('User not found')
    }

    await knex('diets').insert({
      id: randomUUID(),
      description,
      name,
      is_diet: isDiet ? 1 : 0,
      user_id: userId,
      created_at: new Date(),
    })

    return response.status(201).send()
  })

  app.get('/:userId', async (request, response) => {
    const getDietSchema = z.object({
      userId: z.string(),
    })

    const { userId } = getDietSchema.parse(request.params)

    const user = await hasUser(userId)

    if (!user) {
      return response.status(404).send('User not found')
    }

    const diets = await knex('diets').select().where({
      user_id: userId,
    })

    return { diets }
  })

  app.get('/:id/:userId', async (request, response) => {
    const getDietSchema = z.object({
      id: z.string(),
      userId: z.string(),
    })

    const { id, userId } = getDietSchema.parse(request.params)

    const user = await hasUser(userId)

    if (!user) {
      return response.status(404).send('User not found')
    }

    const diet = await knex('diets')
      .select()
      .where({
        id,
        user_id: userId,
      })
      .first()

    return { diet }
  })

  app.put('/:id/:userId', async (request, response) => {
    const dietSchema = z.object({
      id: z.string(),
      userId: z.string(),
    })

    const updateDietSchema = z.object({
      name: z.string().nullable(),
      description: z.string().nullable(),
      isDiet: z.boolean().nullable(),
    })

    const { id, userId } = dietSchema.parse(request.params)

    const { description, isDiet, name } = updateDietSchema.parse(request.body)

    const user = await hasUser(userId)

    if (!user) {
      return response.status(404).send('User not found')
    }

    const diet = await knex('diets')
      .select()
      .where({ id, user_id: userId })
      .first()

    if (!diet) {
      return response.status(404).send('Diet not found')
    }

    await knex('diets')
      .update({
        description: description ?? diet.description,
        is_diet: isDiet ?? diet.is_diet ? 1 : 0,
        name: name ?? diet.name,
      })
      .where({ id, user_id: userId })
  })

  app.delete('/:id/:userId', async (request, response) => {
    const getDietSchema = z.object({
      id: z.string(),
      userId: z.string(),
    })

    const { id, userId } = getDietSchema.parse(request.params)

    const user = await hasUser(userId)

    if (!user) {
      return response.status(404).send('User not found')
    }

    const diet = await knex('diets')
      .select()
      .where({ id, user_id: userId })
      .first()

    if (!diet) {
      return response.status(404).send('Diet not found')
    }

    await knex('diets').delete().where({
      id,
    })
  })

  async function hasUser(userId: string) {
    const user = await knex('users')
      .select()
      .where({
        id: userId,
      })
      .first()

    return user
  }
}
