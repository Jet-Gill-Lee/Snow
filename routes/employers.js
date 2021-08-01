const express = require('express')
const router = express.Router();
const Employer = require('../models/employer');
const Job = require('../models/job');

//All employers
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const employers = await Employer.find(searchOptions)
    res.render('employers/index', {employers: employers, searchOptions: req.query})
  } catch {
    res.send('unable to load page')

  }
})
//New employer
router.get('/new', (req, res) => {
  res.render('employers/new', {employer: new Employer()})
})

//create new employer 
router.post('/', async (req, res) => {
  const employer= new Employer({
    name: req.body.name
  })
  try {
    const newEmployer = await employer.save()
  
    res.redirect(`employers/${newEmployer.id}`)
  } catch {
    res.render('employers/new', {
      employer: employer,
      errorMessage: 'Error creating Employer'
    })
  }
})
///show employer
router.get('/:id', async (req, res) => {
  try {
  let employer = await Employer.findById(req.params.id)
  let jobs = await Job.find({ employer: employer.id }).limit(6).exec()
  res.render('employers/view', {employer: employer, jobs: jobs})

  } catch {
  res.redirect('/')
  }
})
//edit employer
router.get('/:id/edit', async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id)
    res.render('employers/edit', { employer: employer }) 
  } catch {
    res.send('fuck up')
  }
})
  
//update employer
router.put('/:id', async (req, res) => {
  let employer
  try {
    employer = await Employer.findById(req.params.id)
    employer.name = req.body.name
    await employer.save()
    res.redirect(`/employers/${employer.id}`)
  } catch {
    if (employer == null) {
      res.redirect('/')
    } else {
      res.render('employers/edit', {
        employer: employer,
        errorMessage: 'Error updating Employer'
      })
    }
  }
})

//delete employer
router.delete('/:id', async (req,res) => {
  let employer
  try {
    employer = await Employer.findById(req.params.id)
    await employer.remove()
    res.redirect(`/employers`)
  } catch {
    if (employer == null) {
      res.redirect('/')
    } else {
      res.redirect(`/employers/${employer.id}`)
    } 
  }
})


module.exports = router