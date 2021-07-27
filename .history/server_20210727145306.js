const express = require('express')
const app = express() 
const expressLayouts = require('express-ejs-layouts')
const {MongoClient} = require('mongodb')
async function listDatabases() {
  databasesList - await client.db().admin().listDatabases()
  console.log('Databases:')
  databasesList.databases.forEach(db => console.logg( ` - ${db.name}`))
}
async function main(){
  const uri = 'mongodb+srv://Syball:Meriphet149@freecluster.ckugq.mongodb.net/MyFirstDatabase'
  const client = new MongoClient(uri)
  try {
  await client.connect()
  await listDatabases(client)
  } catch (err) {
    console.error(err)
  }
  finally {
    await client.close()
  }
}
main().catch(console.error)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))


const indexRouter = require('./routes/index')
app.use('/', indexRouter)
app.listen(process.env.PORT || 3000, () => console.log('server started'))
