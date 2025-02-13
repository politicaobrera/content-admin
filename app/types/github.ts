export type Step = {
  name: string
  status: string
  started_at: string
  completed_at: string
}

export type Job = {
  id: number
  name: string
  steps: Step[]
}

export type GitHubWorkflowJobs = {
  total_count: number
  jobs: Job[]
}

export type Workflow = {
  id: number
  name: string | null
  status: string | null
  conclusion: string | null,
  created_at: string,
  updated_at: string,
  html_url: string
}

export type GitHubWorkflowRuns = {
  total_count: number
  workflow_runs: Workflow[]
}