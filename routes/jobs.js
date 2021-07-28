const express = require('express')
const router = express.Router();
const Job = require('../models/job')
const Employer = require('../models/employer');
const employer = require('../models/employer');

//Display all jobs
router.get('/', async (req, res) => {
  let searchOptions = {}
  let array1 = []
    try{
    employers = await Employer.find()
    let jobs = await Job.find()
    let jobsList = []
    let searchTitle = req.query.title.toLowerCase()
    let employerID = req.query.employer
    let jobsToPrint = function () {
      for (i = 0; i< jobs.length; i++) {
        if (jobs[i].employer.toString() == employerID) {
        jobsList.push(jobs[i])
        }
      }
    }
    jobsToPrint()
    jobsList.forEach(job => {
    let jobInner = job.title.toLowerCase()
    if (jobInner.includes(searchTitle) || searchTitle == null || ''){
      array1.push(job)
    }
    })
      res.render('jobs/index', { searchOptions: searchOptions, jobs: array1 })
  } catch {
    res.send('unable to load page')
  }
  
})

//New Job Page
router.get('/new', async (req,res) => {
  renderNewPage(res, new Job())
})
//Create new Job action
router.post('/', async (req,res) => {
  const job = new Job({
    title: req.body.title,
    wage: req.body.wage,
    description: req.body.description,
    employer: req.body.employer
  })
  try{
    const newJob = await job.save()
    res.redirect('jobs')
  }
  catch {
    renderNewPage(res, job, true)
}
})

async function renderNewPage(res, job, hasError) {
  try{
    const employers = await Employer.find({})
    const job = new Job()
    const params = {
      employers: employers,
      job: job
    }
    if (hasError) params.errorMessage = 'Error posting job'
    res.render('jobs/new', params)
    } catch {
    res.redirect('/jobs')
  }
}


module.exports = router