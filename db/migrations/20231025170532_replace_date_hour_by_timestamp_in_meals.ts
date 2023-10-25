import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('date')
    table.dropColumn('hour')
    table.string('timestamp').after('is_diet').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('timestamp')
    table.string('date').after('is_diet').index()
    table.string('hour').after('date').index()
  })
}
