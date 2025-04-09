// This would be in your backend repository

import { MongoClient } from "mongodb"
import { NextResponse } from "next/server"

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)
const dbName = "job-tracker"
const collectionName = "jobs"

// Connect to MongoDB
async function connectToDatabase() {
  await client.connect()
  return client.db(dbName).collection(collectionName)
}

// GET all jobs
export async function GET() {
  try {
    const collection = await connectToDatabase()
    const jobs = await collection.find({}).toArray()

    return NextResponse.json(jobs)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST a new job
export async function POST(request) {
  try {
    const job = await request.json()
    const collection = await connectToDatabase()

    // Validate required fields
    if (!job.company || !job.role || !job.status || !job.dateApplied) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await collection.insertOne({
      ...job,
      dateApplied: new Date(job.dateApplied),
    })

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...job,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
