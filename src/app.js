const express = require ('express')
const reporterRouter = require('./router/reporter')
const reportRouter = require ('./router/report')
const app = express()
const port = process.env.PORT ||3000
require('./db/mongoose')
app.use(express.json())
app.use(reporterRouter)
app.use(reportRouter)

app.listen(port , ()=>{console.log(`server is running on port ${port}`)})