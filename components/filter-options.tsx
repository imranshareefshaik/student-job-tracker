"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface FilterOptionsProps {
  onFilterChange: (status: string | null, date: string | null) => void
  currentStatus: string | null
  currentDate: string | null
}

export default function FilterOptions({ onFilterChange, currentStatus, currentDate }: FilterOptionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Filter Applications</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select value={currentStatus || ""} onValueChange={(value) => onFilterChange(value || null, currentDate)}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-filter">Date Applied</Label>
          <div className="flex gap-2">
            <Input
              id="date-filter"
              type="date"
              value={currentDate || ""}
              onChange={(e) => onFilterChange(currentStatus, e.target.value || null)}
              className="flex-1"
            />
            {currentDate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFilterChange(currentStatus, null)}
                className="shrink-0"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => onFilterChange(null, null)}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
