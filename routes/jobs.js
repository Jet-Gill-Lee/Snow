const express = require('express')
const router = express.Router();
const Job = require('../models/job')
const Employer = require('../models/employer');
const employer = require('../models/employer');
const { response } = require('express');

//Display all jobs
router.get('/', async (req, res) => {
  //NEARLY FIXED AT LEAST - JUST NEED TO CLEAR PARAMETERS ON PAGE RELOAD AND REFACTOR, WHICH I THINK WILL FIX FIRST ISSUE PARAMETERS NOT CLEARING 
  //LEARN MONGOOSE POPULATE TO GRAB EMPLOYER AS AN OBJECT MAYBE
  //PUT FUNCTION TO FILTER IN IF STATEMENTS ABOUT WHETHER PARTICULAR PARAMETER IS EMPTY AND RETURN NULL OTHERWISE? 
  //ISSUE COMING FROM NOT BEING ABLE TO PASS EMPLOYERID VALUE WITHOUT LEAVING VALUE AS "EMPLOYER.ID" I THINK
  //WDS CODE BELOW 
  // let query = Job.find()
  // if (req.query.x != n ull && req.query.x != '') {
  //   query = "filter"
  // }
  // try {
  //   const jobs = await query.exec()
  //   res.render('jobs/index', {jobs: jobs, searchOptions: req.query})
  // }
  //FROM HERE IS MY SEMI(QUITE) COOKED VERSION 
let array1 = []
try {
  let employers = await Employer.find()
  let jobs = await Job.find()
  if (req.query.title && req.query.employer){
  let jobsList = []
  if (req.query.title){
    searchTitle = req.query.title.toLowerCase()
  } else {
    searchTitle = null
  }
  if (req.query.employer) {
    employerID = req.query.employer
  } else {
    employerID = null
  }
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
  } else if (req.query.title) {
    let jobsList= await Job.find() 
    jobsList.forEach(job => {
      let searchTitle = req.query.title.toLowerCase()
      let jobInner = job.title.toLowerCase()
      if (jobInner.includes(searchTitle)){
        array1.push(job)
      }
    }) 
  } else if (req.query.employer) {
    let jobsList = await Job.find() 
    let employerID = req.query.employer
    jobsList.forEach(job => { 
      if (job.employer == employerID) {
        array1.push(job)
      }
    })
  } else {
    array1 = await Job.find()
  }
  res.render('jobs/index', { searchOptions: req.query, jobs: array1, employers: employers, employer:employer})
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
    employer: req.body.employer,
    benefits: req.body.benefits
  })
  try{
    const newJob = await job.save()
    res.redirect('jobs')
  }
  catch {
    renderNewPage(res, job, true)
}
})


//SHOW JOB
router.get('/:id', async (req, res) => {
try{
  const job = await Job.findById(req.params.id)
                        .populate('employer')
                        .exec()
  let employer = await job.employer
  res.render('jobs/view', { job: job, employer: employer })
} catch {
  res.redirect('/')
}
})
// router.get('/:id', async (req, res) => {
//   try {
//   let job = await Job.findById(req.params.id)
//   let employerID = job.employer.toString()
//   let employers = await Employer.find()
//   let jobEmployer = { name: ''}
//   employers.forEach(employer => {
//     if (employer.id === employerID)
//       jobEmployer.name = employer.name
//   })
//   res.render('jobs/view', {employer: jobEmployer, job: job})
//   } catch {
//   res.redirect('/')
//   }
// })

//EDIT JOBS
//maybe work out how to use renderNew/renderEdit at bottom later
router.get('/:id/edit', async (req,res) => {
  let employers = await Employer.find()
  try {
    const job = await Job.findById(req.params.id).populate('employer').exec()
    let employer = job.employer
    res.render('jobs/edit',{ job: job, employers: employers })
  } catch {
    res.send('fuck up')
  }
})

//UPDATE JOBS
router.put('/:id', async (req,res) => {
  let job 
  try {
    job = await Job.findById(req.params.id)
    job.title = req.body.title
    job.wage = req.body.wage
    job.employer = req.body.employer
    job.description = req.body.description
    await job.save() 
    res.redirect(`/jobs/${job.id}`)
  } catch {
    if (job == null) {
      res.redirect('/')
    } else {
      res.render('jobs/edit', {
        job: job,
        errorMessage: 'Error updating job'
      })
    }
  }
})
//DELETE JOB
router.delete('/:id', async (req,res) => {
  let job 
  try {
    job = await Job.findById(req.params.id)
    await job.remove()
    res.redirect(`/jobs`)
  } catch {
    if (job == null) {
      res.redirect('/')
    } else {
      res.redirect(`/jobs/${job.id}`)
    }
  }
})
async function renderNewPage(res, job, hasError) {
  renderFormPage(res, job, 'new', hasError)
}
async function renderEditPage(res, job, hasError) {
  renderFormPage(res, job, 'edit', hasError)
}
async function renderFormPage(res, job, form, hasError) {
  try{
    const employers = await Employer.find({})
    const params = {
      employers: employers,
      job: job
    }
    if (hasError) params.errorMessage = 'Error posting job'
    res.render(`jobs/${form}`, params)
    } catch {
    res.redirect('/jobs')
  }
}


module.exports = router