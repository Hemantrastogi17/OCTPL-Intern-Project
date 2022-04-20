const connectToMongo = require('./db')
const express = require('express')
const app = express()
const port = 5000
// var app = express()

// app.use(cors())

app.use(express.json())

app.use('/api/auth',require('./routes/auth'))
app.use('/api/projects', require('./routes/projects'))

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`)
})
connectToMongo()