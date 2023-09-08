import fastify from 'fastify'
import { userRoutes } from './routes/user'
import { dietsRoutes } from './routes/diets'

export const app = fastify()

app.register(userRoutes, {
  prefix: 'users',
})

app.register(dietsRoutes, {
  prefix: 'diets',
})
