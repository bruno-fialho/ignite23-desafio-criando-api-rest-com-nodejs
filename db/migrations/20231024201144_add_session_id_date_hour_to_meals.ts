import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('isDiet')
    table.uuid('session_id').after('id').index()
    table.boolean('is_diet').after('description').index()
    table.string('date').after('is_diet').index()
    table.string('hour').after('date').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.boolean('isDiet').notNullable()
    table.dropColumn('session_id')
    table.dropColumn('is_diet')
    table.dropColumn('date')
    table.dropColumn('hour')
  })
}
