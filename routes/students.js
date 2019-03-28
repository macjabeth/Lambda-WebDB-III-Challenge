const Joi = require('joi');
const debug = require('debug')('server:db');
const config = require('config').get('knex');
const router = require('express').Router();
const db = require('knex')(config);

// Validation
const schema = Joi.object().keys({
  name: Joi.string().required(),
  cohort_id: Joi.number().integer()
});

// C - POST
router.post('/', async ({ body: newStudent }, res) => {
  const result = Joi.validate(newStudent, schema);
  if (result.error) {
    const messages = result.error.details.map(err => err.message);
    return res.status(400).json({ error: messages });
  }

  try {
    const [id] = await db('students').insert(newStudent);
    const [student] = await db('students').where({ id });
    res.status(201).json(student);
  } catch (error) {
    debug(error); res.status(500).json({
      error: 'There was an error while saving the student to the database.'
    });
  }
});

// R - GET
router.get('/', async (req, res) => {
  try {
    const students = await db('students');
    res.status(200).json(students);
  } catch (error) {
    debug(error); res.status(500).json({
      error: 'The students information could not be retrieved.'
    });
  }
});

router.get('/:id', async ({ params: { id } }, res) => {
  try {
    const [student] = await db('students').where({ id });
    if (!student) return res.status(404).json({ error: 'The student could not be retrieved.' });
    const { name, cohort_id } = student, [{ name: cohort }] = await db('cohorts').where({ id: cohort_id });
    res.status(200).json({ id, name, cohort });
  } catch (error) {
    debug(error); res.status(500).json({
      error: 'The student information could not be retrieved.'
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
    const count = await db('students').where({ id }).update(changes);
    Boolean(count)
      ? res.status(200).json({ count })
      : res.status(404).json({ error: 'The student information could not be modified.' })
  } catch (error) {
    debug(error); res.status(304).json({
      error: 'The student information could not be modified.'
    });
  }
});

// D - DELETE
router.delete('/:id', async ({ params: { id } }, res) => {
  try {
    const count = await db('students').where({ id }).del();
    Boolean(count)
      ? res.status(204).end()
      : res.status(404).json({ error: 'The student could not be removed.' })
  } catch (error) {
    debug(error); res.status(500).json({
      error: 'The student could not be removed.'
    });
  }
});

module.exports = router;
