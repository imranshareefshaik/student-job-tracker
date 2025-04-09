export interface Job {
  _id: string
  company: string
  role: string
  status: "Applied" | "Interview" | "Offer" | "Rejected"
  dateApplied: string
  link: string
}
