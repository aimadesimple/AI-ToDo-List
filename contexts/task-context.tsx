"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Task } from "@/lib/types"
import { TaskEvents } from "@/contexts/task-refresh"

type TaskContextType = {
  tasks: Task[]
  openTasks: Task[]
  completedTasks: Task[]
  isLoading: boolean
  refreshTasks: () => Promise<void>
  toggleTaskStatus: (id: string, completed: boolean) => Promise<void>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter tasks by status
  const openTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  // Function to fetch all tasks
  const refreshTasks = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Toggle task status
  const toggleTaskStatus = useCallback(async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      })

      if (!response.ok) throw new Error("Failed to update task")
      
      // Refresh tasks after toggling
      await refreshTasks()
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }, [refreshTasks])

  // Load tasks initially
  useEffect(() => {
    refreshTasks()
  }, [refreshTasks])

  useEffect(() => {
    // Listen for task update events from the API
    const handleTaskUpdated = () => refreshTasks()
    window.addEventListener(TaskEvents.TASK_UPDATED, handleTaskUpdated)
    
    return () => {
      window.removeEventListener(TaskEvents.TASK_UPDATED, handleTaskUpdated)
    }
  }, [refreshTasks])

  return (
    <TaskContext.Provider 
      value={{ 
        tasks, 
        openTasks, 
        completedTasks, 
        isLoading, 
        refreshTasks, 
        toggleTaskStatus 
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
} 