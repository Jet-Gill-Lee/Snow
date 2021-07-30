const express = require('express')
const router = express.Router();
const Job = require('../models/job')
const Employer = require('../models/employer');
const employer = require('../models/employer');

//Display all jobs
router.get('/', async (req, res) => {
  //NEARLY FIXED AT LEAST - JUST NEED TO CLEAR PARAMETERS ON PAGE RELOAD AND REFACTOR, WHICH I THINK WILL FIX FIRST ISSUE PARAMETERS NOT CLEARING 
  //LEARN MONGOOSE POPULATE TO GRAB EMPLOYER AS AN OBJECT MAYBE
  //PUT FUNCTION TO FILTER IN IF STATEMENTS ABOUT WHETHER PARTICULAR PARAMETER IS EMPTY AND RETURN NULL OTHERWISE? 
  //ISSUE COMING FROM NOT BEING ABLE TO PASS EMPLOYERID VALUE WITHOUT LEAVING VALUE AS "EMPLOYER.ID" I THINK
  //WDS CODE BELOW 
  // let query = Job.find()
  // if (req.query.x != null && req.query.x != '') {
  //   query = "filter"
  // }
  // try {
  //   const jobs = await query.exec()
  //   res.render('jobs/index', {jobs: jobs, searchOptions: req.query})
  // }
  //FROM HERE IS MY SEMI(QUITE) COOKED VERSION
  
  let array1 = []
    try {
    employers = await Employer.find()
    let jobs = await Job.find({})
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
      console.log('here')
      let jobsList= await Job.find() 
      jobsList.forEach(job => {
        let searchTitle = req.query.title.toLowerCase()
        let jobInner = job.title.toLowerCase()
        if (jobInner.includes(searchTitle)){
          array1.push(job)
        }
      }) 
    } else if (req.query.employer) {
      console.log('now here')
      let jobsList = await Job.find() 
      let employerID = req.query.employer
      console.log(array1)
      console.log('employer search ' + employerID)
      jobsList.forEach(job => { 
        console.log('iterate')
        if (job.employer == employerID) {
          array1.push(job)
        }
      })
    } else {
      array1 = await Job.find()
    }
    res.render('jobs/index', { searchOptions: req.query, jobs: array1 })
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