
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        { name: 'Adam McKenney', cohort_id: 1 },
        { name: 'Ryan Boris', cohort_id: 1 },
        { name: 'Jonathan Picazo', cohort_id: 2 },
        { name: 'Omar Salah', cohort_id: 2 },
        { name: 'Christopher Foster', cohort_id: 2 },
        { name: 'Ian Belknap', cohort_id: 2 }
      ]);
    });
};
