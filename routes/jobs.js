const express = require('express')
const router = express.Router();
const Job = require('../models/job')

//All jobs
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.title != null && req.query.title !== '') {
    searchOptions.title = new RegExp(req.query.title, 'i')
  }
  try {
    const jobs = await Job.find(searchOptions)
    res.render('jobs/index', {jobs: jobs, searchOptions: req.query})
  } catch {
    res.send('unable to load page')

  }
})

//New Job
router.get('/new', (req, res) => {
  res.render('jobs/new', {job: new Job()})
})

//create new job 
router.post('/', async (req, res) => {
  const job = new Job({
    title: req.body.title
  })
  try {
    const newJob = await job.save()
    res.redirect(`jobs`)
    // res.redirect(`jobs/${newJob.id}`)
  } catch {
    res.render('jobs/new', {
      job: job,
      errorMessage: 'Error creating Job'
    })
  }
})




module.exports = router