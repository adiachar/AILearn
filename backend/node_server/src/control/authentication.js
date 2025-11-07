import User from '../model/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({email})

        if(!user) {
            return res.status(400).json({message: "Invalid credentials"})
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '48h'})
        return res.status(200).json({token, user: {id: user._id, name: user.name, email: user.email}})  
    }
    catch(err) {
        console.error("Error logging in user:", err)
        return res.status(500).json({message: "Internal server error"})
    }
}

export const registerUser = async (req, res) => {
    const {name, email, password} = req.body

    try {
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({name, email, password: hashedPassword})
        await newUser.save()

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '48h'})
        return res.status(201).json({token, user: {id: newUser._id, name: newUser.name, email: newUser.email}})
    }
   catch(err) {
        console.error("Error registering user:", err)
        return res.status(500).json({message: "Internal server error"})
    }
}

export const verifyToken = async (req, res) => {
    const {token} = req.body

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')

        if(!user) {
            return res.status(400).json({message: "Invalid token"})
        }

        return res.status(200).json({user: {id: user._id, name: user.name, email: user.email}}) 
    }
    catch(err) {
        console.error("Error verifying token:", err)
        return res.status(500).json({message: "Internal server error"})
    }
}