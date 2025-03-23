"use client"

import { useTasks } from "@/contexts/task-context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import { CheckCircle2, Circle } from "lucide-react"

interface TaskListProps {
  status: "open" | "completed"
}

export default function TaskList({ status }: TaskListProps) {
  const { openTasks, completedTasks, isLoading, toggleTaskStatus } = useTasks()
  
  // Choose which tasks to display based on status
  const tasks = status === "open" ? openTasks : completedTasks

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-md p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No {status} tasks found</p>
      </div>
    )
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {tasks.map((task) => (
        <AccordionItem key={task.id} value={task.id}>
          <AccordionTrigger className="flex gap-2">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                toggleTaskStatus(task.id, task.completed)
              }}
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <span>{task.title}</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pl-7">
              <p>
                <span className="font-medium">Description:</span> {task.description}
              </p>
              <p>
                <span className="font-medium">Date Created:</span> {formatDate(task.createdAt)}
              </p>
              {task.completed && task.completedAt && (
                <p>
                  <span className="font-medium">Date Completed:</span> {formatDate(task.completedAt)}
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

