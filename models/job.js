const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  wage: {
    type: Number,
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Employer'
  },
  description: {
    type: String,
    required: true
  },
  datePosted: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Job', jobSchema)