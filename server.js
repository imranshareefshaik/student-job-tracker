// This would be in your backend repository

import express from "express"
import { MongoClient, ObjectId } from "mongodb"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
const client = new MongoClient(MONGODB_URI)
const dbName = "job-tracker"
const collectionName = "jobs"

async function connectToMongoDB() {
  try {
    await client.connect()
    console.log("Connected to MongoDB")
    return client.db(dbName).collection(collectionName)
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

// Routes
app.get("/api/jobs", async (req, res) => {
  try {
    const collection = await connectToMongoDB()
    const jobs = await collection.find({}).toArray()
    res.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    res.status(500).json({ error: "Failed to fetch jobs" })
  }
})

app.post("/api/jobs", async (req, res) => {
  try {
    const job = req.body

    // Validate required fields
    if (!job.company || !job.role || !job.status || !job.dateApplied) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const collection = await connectToMongoDB()
    const result = await collection.insertOne({
      ...job,
      dateApplied: new Date(job.dateApplied),
    })

    res.status(201).json({
      _id: result.insertedId,
      ...job,
    })
  } catch (error) {
    console.error("Error adding job:", error)
    res.status(500).json({ error: "Failed to add job" })
  }
})

app.get("/api/jobs/:id", async (req, res) => {
  try {
    const id = req.params.id
    const collection = await connectToMongoDB()

    const job = await collection.findOne({ _id: new ObjectId(id) })

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    res.json(job)
  } catch (error) {
    console.error("Error fetching job:", error)
    res.status(500).json({ error: "Failed to fetch job" })
  }
})

app.put("/api/jobs/:id", async (req, res) => {
  try {
    const id = req.params.id
    const job = req.body
    const collection = await connectToMongoDB()

    // Remove _id from the update if it exists
    const { _id, ...updateData } = job

    // Format date if it exists
    if (updateData.dateApplied) {
      updateData.dateApplied = new Date(updateData.dateApplied)
    }

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Job not found" })
    }

    res.json({ _id: id, ...job })
  } catch (error) {
    console.error("Error updating job:", error)
    res.status(500).json({ error: "Failed to update job" })
  }
})

app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const id = req.params.id
    const collection = await connectToMongoDB()

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Job not found" })
    }

    res.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Error deleting job:", error)
    res.status(500).json({ error: "Failed to delete job" })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
