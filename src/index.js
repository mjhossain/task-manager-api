const express = require('express')
const cors = require('cors')

// Connecting to MongoDB
require('./db/mongoose')

// Importing Routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const testRouter = require('./routers/test')
const { urlencoded } = require('express')

// Creating Express Server
const app = express()

// Declaring Port
const port = process.env.PORT


// React setup
// app.use(cors({
//     origin: 'http://localhost:3000'
// }))

// Using express parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// Middlewares
// app.use((req, res, next) => {
//     res.status(503).send('Maintainance Mode ON!')
// })






// Setting up Routers
app.use(userRouter)
app.use(taskRouter)
app.use(testRouter)


// Running App
app.listen(port, () => {
    console.log('Server running!')
})


// Test Scripts

// const User = require('./models/user')
// const Task = require('./models/task')

// const main = async() => {
//     const user = await User.findById("5ef2cf6e086d5d19d53c54a0")
//     await user.populate("tasks").execPopulate()
//     console.log(user.tasks)
// }

// main()