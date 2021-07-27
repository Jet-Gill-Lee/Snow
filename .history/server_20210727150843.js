const express = require('express')
const app = express() 
const expressLayouts = require('express-ejs-layouts')
// const {MongoClient} = require('mongodb')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Syball:Meriphet149@freecluster.ckugq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewURLParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => {console.log('conencted to database')})
// async function main(){
//   const uri = 'mongodb+srv://Syball:Meriphet149@freecluster.ckugq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//   const client = new MongoClient(uri)
//   try {
//   await client.connect()
//   await listDatabases(client)
//   } catch (err) {
//     console.error(NPMerr)
//   }
//   finally {
//     await client.close()
//   }
//   async function listDatabases() {
//     databasesList = await client.db().admin().listDatabases()
//     console.log('Databases:')
//     databasesList.databases.forEach(db => console.log( ` - ${db.name}`))
//   }
// }

// main().catch(console.error)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))


const indexRouter = require('./routes/index')
app.use('/', indexRouter)
app.listen(process.env.PORT || 3000, () => console.log('server started'))
