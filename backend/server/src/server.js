import express from "express"
import cors from "cors"
import aiVideoGenerationRouter from './router/ai_video_generation.js'
import authenticationRouter from './router/authentication.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/ai/', aiVideoGenerationRouter)
app.use('/api/auth', authenticationRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})