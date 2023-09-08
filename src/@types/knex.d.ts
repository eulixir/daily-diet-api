// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
    }
    diets: {
      id: string
      name: string
      description: string
      is_diet: number
      user_id: string
      created_at: Date
    }
  }
}
