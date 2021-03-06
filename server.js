if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express() 
const methodOverride = require('method-override')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
const bodyParser = require('body-parser')
db.on('error', error => console.error(error))
db.once('open', () => {console.log('connected to database')})

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))


const indexRouter = require('./routes/index')
const employersRouter = require('./routes/employers')
const jobsRouter = require('./routes/jobs')
app.use('/', indexRouter)
app.use('/employers', employersRouter)
app.use('/jobs', jobsRouter)
app.listen(process.env.PORT || 3000, () => console.log('server started'))

