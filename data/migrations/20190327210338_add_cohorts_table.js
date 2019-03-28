
exports.up = function(knex, Promise) {
  return knex.schema.createTable('cohorts', (tbl) => {
    tbl.increments();
    tbl.string('name').notNullable().unique();
    tbl.timestamp('createdAt').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('cohorts');
};
