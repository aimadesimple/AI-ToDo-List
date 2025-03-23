// Global event system for task updates
export const TaskEvents = {
  // Create a custom event that components can listen for
  TASK_UPDATED: 'taskUpdated',
  
  // Dispatch the event when a task is created, updated or deleted
  emitTaskUpdated: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(TaskEvents.TASK_UPDATED))
    }
  }
} 