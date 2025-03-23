import { NextResponse } from "next/server"
import type { Task } from "@/lib/types"

// Reference to the in-memory tasks array (would be a database in production)
// This is just for the example - in a real app, you'd use a database
declare global {
  var tasks: Task[]
}

// If tasks is not defined in the global scope, it will be defined in the tasks/route.ts file
if (!global.tasks) {
  global.tasks = []
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params from the context object
  const { id } = await context.params
  const task = global.tasks.find((t) => t.id === id)

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  return NextResponse.json(task)
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get the body first to ensure we have an async operation before accessing params
    const body = await request.json()
    
    // Await the params to access id property
    const { id: taskId } = await context.params
    
    console.log("PATCH request for ID:", taskId)
    console.log("Available tasks:", global.tasks.map(t => t.id))
    
    const taskIndex = global.tasks.findIndex((t) => t.id === taskId)

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const updatedTask = {
      ...global.tasks[taskIndex],
      ...body,
    }

    // If task is being marked as completed, add completedAt timestamp
    if (body.completed === true && !global.tasks[taskIndex].completed) {
      updatedTask.completedAt = new Date().toISOString()
    }

    // If task is being marked as not completed, remove completedAt
    if (body.completed === false && global.tasks[taskIndex].completed) {
      delete updatedTask.completedAt
    }

    global.tasks[taskIndex] = updatedTask

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params to access id property
  const { id: taskId } = await context.params
  
  const taskIndex = global.tasks.findIndex((t) => t.id === taskId)
  
  if (taskIndex === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }
  
  const deletedTask = global.tasks[taskIndex]
  global.tasks.splice(taskIndex, 1)
  
  return NextResponse.json(deletedTask)
}