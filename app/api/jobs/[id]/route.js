// This would be in your backend repository

import { MongoClient, ObjectId } from "mongodb"
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

// GET a specific job
export async function GET(request, { params }) {
  try {
    const id = params.id
    const collection = await connectToDatabase()

    const job = await collection.findOne({ _id: new ObjectId(id) })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT (update) a job
export async function PUT(request, { params }) {
  try {
    const id = params.id
    const job = await request.json()
    const collection = await connectToDatabase()

    // Remove _id from the update if it exists
    const { _id, ...updateData } = job

    // Format date if it exists
    if (updateData.dateApplied) {
      updateData.dateApplied = new Date(updateData.dateApplied)
    }

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ _id: id, ...job })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE a job
export async function DELETE(request, { params }) {
  try {
    const id = params.id
    const collection = await connectToDatabase()

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
