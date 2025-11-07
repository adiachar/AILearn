import express from 'express'
import jwt from 'jsonwebtoken'
import { loginUser, registerUser, verifyToken } from '../control/authentication.js'

const router = express.Router()

router.post('/login', async (req, res) => loginUser(req, res))
router.post('/register', async (req, res) => registerUser(req, res))
router.post('/verify-token', async (req, res) => verifyToken(req, res))

export default router