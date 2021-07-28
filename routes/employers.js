const express = require('express')
const router = express.Router();
const Employer = require('../models/employer')

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
    res.redirect(`employers`)
    // res.redirect(`employers/${newEmployer.id}`)
  } catch {
    res.render('employers/new', {
      employer: employer,
      errorMessage: 'Error creating Employer'
    })
  }
})




module.exports = router