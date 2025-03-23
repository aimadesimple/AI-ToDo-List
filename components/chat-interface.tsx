"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import type { Message } from "@/lib/types"
import { useTasks } from "@/contexts/task-context"
import ReactMarkdown from 'react-markdown'
import { v4 as uuidv4 } from 'uuid'

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { refreshTasks } = useTasks()
  
  // Create a session thread ID when the component mounts
  const [threadId] = useState(() => {
    // Check if we're running in a browser environment
    if (typeof window !== 'undefined') {
      // Try to get from sessionStorage first for persistence during page refreshes
      const savedThreadId = sessionStorage.getItem('chat_thread_id')
      if (savedThreadId) return savedThreadId
      
      // Generate a new UUID if none exists
      const newThreadId = uuidv4()
      sessionStorage.setItem('chat_thread_id', newThreadId)
      return newThreadId
    }
    
    // Default value for server-side rendering
    return uuidv4()
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Send message to API with threadId
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          threadId 
        }),
      })

      if (!response.ok) {
        // Extract the error message from the response
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      const data = await response.json()

      // Check if tasks were updated and trigger a refresh
      if (data.taskUpdated) {
        // Dispatch the task updated event
        window.dispatchEvent(new CustomEvent('taskUpdated'))
      }

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Force refresh the tasks
      refreshTasks()
    } catch (error) {
      console.error("Error sending message:", error)

      // Add error message - use the specific error message if available
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error ? error.message : "Sorry, I couldn't process your message. Please try again.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header without Settings */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Chat with AI Assistant</h2>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Send a message to get started</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{message.sender === "user" ? "U" : "AI"}</AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.sender === "user" ? (
                    message.content
                  ) : (
                    <div className="prose dark:prose-invert prose-sm">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  )
}

