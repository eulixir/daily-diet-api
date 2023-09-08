import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
    })

    const { email, name } = createUserBodySchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
    })

    return response.status(201).send()
  })

  app.get('/', async () => {
    const users = await knex('users').select()

    return { users }
  })

  app.get('/summary/:id', async (request) => {
    const userBodySchema = z.object({
      id: z.string(),
    })

    const { id } = userBodySchema.parse(request.params)

    const diets = await knex('diets').select().where({
      user_id: id,
    })

    const length = diets.length
    const totalNonDiets = diets.filter((diet) => diet.is_diet === 0).length
    const totalDiets = diets.filter((diet) => diet.is_diet === 1).length

    function calcSequence() {
      const sequences = []
      let currentSequence = []

      for (const item of diets) {
        if (item.is_diet === 1) {
          currentSequence.push(item.is_diet)
        } else if (currentSequence.length > 0) {
          sequences.push(currentSequence)
          currentSequence = []
        }
      }

      if (currentSequence.length > 0) {
        sequences.push(currentSequence)
      }

      return sequences
    }

    const dietSequences = calcSequence()

    let biggestSequence = []
    for (const sequence of dietSequences) {
      if (sequence.length > biggestSequence.length) {
        biggestSequence = sequence
      }
    }

    const biggestSequenceLength = biggestSequence.length

    return { length, totalNonDiets, totalDiets, biggestSequenceLength }
  })
}
