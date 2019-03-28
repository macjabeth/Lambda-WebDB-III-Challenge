
exports.up = function(knex, Promise) {
  return knex.schema.createTable('students', (tbl) => {
    tbl.increments();
    tbl.string('name').notNullable();
    tbl.integer('cohort_id').unsigned().references('cohorts.id')
      .onDelete('CASCADE').onUpdate('CASCADE');
    tbl.timestamp('createdAt').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('students');
};
