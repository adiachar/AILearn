import express from 'express'
import axios from 'axios'

export const generateVideo = async (req, res) => {
    try {
        const {content} = req.body
        const response = await axios.post(process.env.AI_MICROSERVICE_API, {content})

        if(response.status = 200) {
            return res.status(200).json({videoUrl: response.data.videoUrl, description: response.data.description})
        }

        return res.status(500).json({message: "Video generation failed"})

    }
    catch(err) {
        console.error("Error generating video", err)
        return res.status(500).json({message: "Internal server error"})
    }
} 