const mongoose = require('mongoose')

const employerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Employer', employerSchema)