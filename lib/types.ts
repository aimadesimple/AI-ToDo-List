export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
  completedAt?: string
}

export interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: string
}

