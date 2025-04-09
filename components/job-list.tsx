"use client"

import { useState } from "react"
import { Edit, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Job } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface JobListProps {
  jobs: Job[]
  isLoading: boolean
  onEdit: (job: Job) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Job["status"]) => void
}

export default function JobList({ jobs, isLoading, onEdit, onDelete, onStatusChange }: JobListProps) {
  const [expandedJob, setExpandedJob] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800"
      case "Interview":
        return "bg-yellow-100 text-yellow-800"
      case "Offer":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <Card className="text-center p-8">
        <p className="text-muted-foreground">No job applications found. Add your first job application!</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <Card key={job._id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-bold truncate" title={job.company}>
                {job.company}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(job)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onDelete(job._id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground truncate" title={job.role}>
              {job.role}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className={getStatusColor(job.status)}>
                  {job.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{new Date(job.dateApplied).toLocaleDateString()}</span>
              </div>

              {expandedJob === job._id && (
                <div className="mt-2 text-sm">
                  {job.link && (
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      View Job Posting <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button variant="ghost" size="sm" onClick={() => setExpandedJob(expandedJob === job._id ? null : job._id)}>
              {expandedJob === job._id ? "Less" : "More"}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Update Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onStatusChange(job._id, "Applied")}>Applied</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(job._id, "Interview")}>Interview</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(job._id, "Offer")}>Offer</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(job._id, "Rejected")}>Rejected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
