"use client"

import { useState, useEffect } from "react"
import { Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import JobForm from "@/components/job-form"
import JobList from "@/components/job-list"
import FilterOptions from "@/components/filter-options"
import type { Job } from "@/lib/types"

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterDate, setFilterDate] = useState<string | null>(null)

  // Fetch jobs from API
  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`)
      if (!response.ok) throw new Error("Failed to fetch jobs")
      const data = await response.json()
      setJobs(data)
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  // Add new job
  const handleAddJob = async (job: Omit<Job, "_id">) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      })

      if (!response.ok) throw new Error("Failed to add job")

      await fetchJobs()
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error adding job:", error)
    }
  }

  // Update job
  const handleUpdateJob = async (job: Job) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${job._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      })

      if (!response.ok) throw new Error("Failed to update job")

      await fetchJobs()
      setEditingJob(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error updating job:", error)
    }
  }

  // Delete job
  const handleDeleteJob = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete job")

      await fetchJobs()
    } catch (error) {
      console.error("Error deleting job:", error)
    }
  }

  // Edit job (open form with job data)
  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setIsFormOpen(true)
  }

  // Filter jobs based on status and date
  const filteredJobs = jobs.filter((job) => {
    let statusMatch = true
    let dateMatch = true

    if (filterStatus) {
      statusMatch = job.status === filterStatus
    }

    if (filterDate) {
      const jobDate = new Date(job.dateApplied).toISOString().split("T")[0]
      dateMatch = jobDate === filterDate
    }

    return statusMatch && dateMatch
  })

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Student Job Tracker</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              onClick={() => {
                setEditingJob(null)
                setIsFormOpen(!isFormOpen)
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Job
            </Button>
          </div>
        </div>

        {isFilterOpen && (
          <Card>
            <CardContent className="pt-6">
              <FilterOptions
                onFilterChange={(status, date) => {
                  setFilterStatus(status)
                  setFilterDate(date)
                }}
                currentStatus={filterStatus}
                currentDate={filterDate}
              />
            </CardContent>
          </Card>
        )}

        {isFormOpen && (
          <Card>
            <CardContent className="pt-6">
              <JobForm
                onSubmit={editingJob ? handleUpdateJob : handleAddJob}
                onCancel={() => {
                  setIsFormOpen(false)
                  setEditingJob(null)
                }}
                initialData={editingJob}
              />
            </CardContent>
          </Card>
        )}

        <JobList
          jobs={filteredJobs}
          isLoading={isLoading}
          onEdit={handleEditJob}
          onDelete={handleDeleteJob}
          onStatusChange={async (id, newStatus) => {
            const job = jobs.find((j) => j._id === id)
            if (job) {
              await handleUpdateJob({ ...job, status: newStatus })
            }
          }}
        />
      </div>
    </main>
  )
}
