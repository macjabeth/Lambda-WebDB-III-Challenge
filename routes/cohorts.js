const Joi = require('joi');
const debug = require('debug')('server:db');
const config = require('config').get('knex');
const router = require('express').Router();
const db = require('knex')(config);

// Validation
const schema = Joi.object().keys({
  name: Joi.string().required()
});

// C - POST
router.post('/', async ({ body: newCohort }, res) => {
  const result = Joi.validate(newCohort, schema);
  if (result.error) {
    const messages = result.error.details.map(err => err.message);
    return res.status(400).json({ error: messages });
  }

  try {
    const [id] = await db('cohorts').insert(newCohort);
    const [cohort] = await db('cohorts').where({ id });
    res.status(201).json(cohort);
  } catch (error) {
    debug(error); res.status(500).json({
      error: 'There was an error while saving the cohort to the database.'
    });
  }
});

// R - GET
router.get('/', async (req, res) => {
  try {
    const cohorts = await db('cohorts');
    res.status(200).json(cohorts);
  } catch (error) {
    debug(error); res.status(500).json({
      error: 'The cohorts information could not be retrieved.'
    });
  }
});

router.get('/:id', async ({ params: { id } }, res) => {
  try {
    const [cohort] = await db('cohorts').where({ id });
    Boolean(cohort)
      ? res.status(200).json(cohort)
      : res.status(404).json({ error: 'The cohort could not be retrieved.' });
  } catch (error) {
    debug(error); res.status(500).json({
      error: 'The cohort information could not be retrieved.'
    });
  }
});

router.get('/:id/students', async ({ params: { id } }, res) => {
  try {
    const students = await db('students').where({ cohort_id: id });
    Boolean(students.length)
      ? res.status(200).json(students)
      : res.status(404).json({ error: 'The cohort students could not be retrieved.' });
  } catch (error) {
    debug(error); res.status(500).json({
      error: 'The cohort students could not be retrieved.'
    });
  }
});

// U - PUT
router.put('/:id', async ({ params: { id }, body: changes }, res) => {
  const result = Joi.validate(changes, schema);
  if (result.error) {
    const messages = result.error.details.map(err => err.message);
    return res.status(400).json({ error: messages });
  }

  try {
    const count = await db('cohorts').where({ id }).update(changes);
    Boolean(count)
      ? res.status(200).json({ count })
      : res.status(404).json({ error: 'The cohort information could not be modified.' })
  } catch (error) {
    debug(error); res.status(304).json({
      error: 'The cohort information could not be modified.'
    });
  }
});

// D - DELETE
router.delete('/:id', async ({ params: { id } }, res) => {
  try {
    const count = await db('cohorts').where({ id }).del();
    Boolean(count)
      ? res.status(204).end()
      : res.status(404).json({ error: 'The cohort could not be removed.' })
  } catch (error) {
    debug(error); res.status(500).json({
      error: 'The cohort could not be removed.'
    });
  }
});

module.exports = router;
