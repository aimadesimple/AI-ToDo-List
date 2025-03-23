import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { Task } from "@/lib/types"

// Use global storage for tasks
declare global {
  var tasks: Task[]
}

// Initialize with example tasks if empty
if (!global.tasks) {
  global.tasks = [
    {
      id: "1",
      title: "Welcome to Your AI Task Manager! 👋 (Click here to learn more)",
      description: "I'm your AI assistant, ready to help you manage tasks efficiently. I can help you create, update, complete, and delete tasks. Try starting a conversation by saying 'Hello' or asking 'What can you do?'",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Create your first task",
      description: "Try creating a new task by chatting with me. Just say something like 'Create a task to try out the AI Task Manager' or 'Add a new task for testing the app'",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Mark a task as complete",
      description: "Practice completing tasks by marking this one as done. You can either click the circle icon to the left of the task, or tell me 'Mark the task about completing tasks as done'",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Update a task",
      description: "Try editing a task by asking me to 'Update the task about updating' or 'Change the description of task 4'. You can also try updating the title!",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      title: "Delete a task",
      description: "Learn how to remove tasks by deleting this one. Just ask me to 'Delete the task about deletion' or 'Remove task 5'. Don't worry, you can always create new tasks!",
      completed: false,
      createdAt: new Date().toISOString(),
    }
  ]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  let filteredTasks = [...global.tasks]

  if (status === "open") {
    filteredTasks = filteredTasks.filter((task) => !task.completed)
  } else if (status === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed)
  }

  return NextResponse.json(filteredTasks)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const newTask: Task = {
      id: uuidv4(),
      title: body.title,
      description: body.description || "",
      completed: false,
      createdAt: new Date().toISOString(),
    }

    global.tasks.push(newTask)

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

