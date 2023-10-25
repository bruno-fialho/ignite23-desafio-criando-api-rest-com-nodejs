// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      email: string
      password: string
      created_at: string
    }
    meals: {
      id: string
      session_id: string
      name: string
      description: string
      is_diet: boolean
      timestamp: string
      created_at: string
    }
  }
}
