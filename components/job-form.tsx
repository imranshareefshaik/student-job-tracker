"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Job } from "@/lib/types"

interface JobFormProps {
  onSubmit: (job: any) => void
  onCancel: () => void
  initialData?: Job | null
}

export default function JobForm({ onSubmit, onCancel, initialData }: JobFormProps) {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    dateApplied: new Date().toISOString().split("T")[0],
    link: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company,
        role: initialData.role,
        status: initialData.status,
        dateApplied: new Date(initialData.dateApplied).toISOString().split("T")[0],
        link: initialData.link,
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(initialData ? { ...formData, _id: initialData._id } : formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">{initialData ? "Edit Job Application" : "Add New Job Application"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" name="role" value={formData.role} onChange={handleChange} placeholder="Job title" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateApplied">Date Applied</Label>
          <Input
            id="dateApplied"
            name="dateApplied"
            type="date"
            value={formData.dateApplied}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="link">Job Link</Label>
          <Input
            id="link"
            name="link"
            type="url"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com/job-posting"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update" : "Add"} Job</Button>
      </div>
    </form>
  )
}
