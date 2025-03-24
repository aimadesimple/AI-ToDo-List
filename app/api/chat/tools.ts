
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import type { Task } from "@/lib/types";
import { TaskEvents } from "@/contexts/task-refresh"

// Base URL for API calls
// const BASE_URL = typeof window !== 'undefined' 
//   ? window.location.origin 
//   : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const BASE_URL =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';


/**
 * Tool to get all tasks with optional filtering by status
 */
const getTasks = tool(async (input) => {
  let url = new URL('/api/tasks', BASE_URL);
  
  // Add status filter if provided
  if (input.status) {
    url.searchParams.append('status', input.status);
  }
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  
  const tasks = await response.json();
  return JSON.stringify(tasks);
}, {
  name: 'get_tasks',
  description: 'Get all tasks with optional filtering by completion status',
  schema: z.object({
    status: z.enum(['open', 'completed']).optional()
      .describe("Optional filter for task status. Use 'open' for incomplete tasks or 'completed' for completed tasks.")
  })
});

/**
 * Tool to get a specific task by ID
 */
const getTask = tool(async (input) => {
  const url = new URL(`/api/tasks/${input.id}`, BASE_URL);
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    if (response.status === 404) {
      return { error: "Task not found" };
    }
    throw new Error(`Failed to fetch task: ${response.statusText}`);
  }
  
  const task = await response.json();
  return JSON.stringify(task);
}, {
  name: 'get_task',
  description: 'Get details of a specific task by ID',
  schema: z.object({
    id: z.string().describe("ID of the task to retrieve")
  })
});

/**
 * Tool to create a new task
 */
const createTask = tool(async (input) => {
  const url = new URL('/api/tasks', BASE_URL);
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: input.title,
      description: input.description || ""
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create task: ${error.error || response.statusText}`);
  }
  
  const newTask = await response.json();
  
  // Emit task updated event if we're in the browser
  if (typeof window !== 'undefined') {
    TaskEvents.emitTaskUpdated();
  }
  
  return newTask;
}, {
  name: 'create_task',
  description: 'Create a new task with a title and optional description',
  schema: z.object({
    title: z.string().describe("Title of the task (required)"),
    description: z.string().optional().describe("Detailed description of the task (optional)")
  })
});

/**
 * Tool to update an existing task
 */
const updateTask = tool(async (input) => {
  const updateData: Partial<Task> = {};
  
  if (input.title !== undefined) {
    updateData.title = input.title;
  }
  
  if (input.description !== undefined) {
    updateData.description = input.description;
  }
  
  if (input.completed !== undefined) {
    updateData.completed = input.completed;
  }
  
  const url = new URL(`/api/tasks/${input.id}`, BASE_URL);
  const response = await fetch(url.toString(), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return { error: "Task not found" };
    }
    const error = await response.json();
    throw new Error(`Failed to update task: ${error.error || response.statusText}`);
  }
  
  const updatedTask = await response.json();
  
  // Emit task updated event if we're in the browser
  if (typeof window !== 'undefined') {
    TaskEvents.emitTaskUpdated();
  }
  
  return updatedTask;
}, {
  name: 'update_task',
  description: 'Update an existing task - change title, description, or completion status',
  schema: z.object({
    id: z.string().describe("ID of the task to update"),
    title: z.string().optional().describe("New title for the task"),
    description: z.string().optional().describe("New description for the task"),
    completed: z.boolean().optional().describe("New completion status for the task")
  })
});

/**
 * Tool to delete a task
 */
const deleteTask = tool(async (input) => {
  const url = new URL(`/api/tasks/${input.id}`, BASE_URL);
  const response = await fetch(url.toString(), {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return { error: "Task not found" };
    }
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }
  
  const deletedTask = await response.json();
  
  // Emit task updated event if we're in the browser
  if (typeof window !== 'undefined') {
    TaskEvents.emitTaskUpdated();
  }
  
  return deletedTask;
}, {
  name: 'delete_task',
  description: 'Delete a task by ID',
  schema: z.object({
    id: z.string().describe("ID of the task to delete")
  })
});

/**
 * Tool to mark a task as completed
 */
const completeTask = tool(async (input) => {
  const url = new URL(`/api/tasks/${input.id}`, BASE_URL);
  const response = await fetch(url.toString(), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      completed: true
    }),
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return { error: "Task not found" };
    }
    const error = await response.json();
    throw new Error(`Failed to complete task: ${error.error || response.statusText}`);
  }
  
  const completedTask = await response.json();
  
  // Emit task updated event if we're in the browser
  if (typeof window !== 'undefined') {
    TaskEvents.emitTaskUpdated();
  }
  
  return completedTask;
}, {
  name: 'complete_task',
  description: 'Mark a task as completed',
  schema: z.object({
    id: z.string().describe("ID of the task to mark as completed")
  })
});

/**
 * Tool to mark a task as not completed (reopen)
 */
const reopenTask = tool(async (input) => {
  const url = new URL(`/api/tasks/${input.id}`, BASE_URL);
  const response = await fetch(url.toString(), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      completed: false
    }),
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return { error: "Task not found" };
    }
    const error = await response.json();
    throw new Error(`Failed to reopen task: ${error.error || response.statusText}`);
  }
  
  const reopenedTask = await response.json();
  
  // Emit task updated event if we're in the browser
  if (typeof window !== 'undefined') {
    TaskEvents.emitTaskUpdated();
  }
  
  return reopenedTask;
}, {
  name: 'reopen_task',
  description: 'Mark a completed task as not completed (reopen it)',
  schema: z.object({
    id: z.string().describe("ID of the completed task to reopen")
  })
});

// Export all the tools for use in langGraph
export {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  reopenTask
};