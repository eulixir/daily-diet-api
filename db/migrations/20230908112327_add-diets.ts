import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('diets', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('description')
    table.dateTime('created_at').notNullable()
    table.boolean('is_diet').notNullable().defaultTo(true)
    table.uuid('user_id').notNullable().references('users.id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('diets')
}
