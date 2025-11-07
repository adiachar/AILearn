import express from 'express'
import { generateVideo } from '../control/ai_video_generation.js'

const router = express.Router()

router.post('/generate-video', async (req, res) => generateVideo(req, res))

export default router