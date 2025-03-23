import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaskList from "@/components/task-list"
import ChatInterface from "@/components/chat-interface"

export default function Home() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Your AI Task Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <div className="border rounded-lg p-4 h-[600px] flex flex-col">
          <ChatInterface />
        </div>

        {/* Task List */}
        <div className="border rounded-lg p-4 h-[600px] flex flex-col">
          <Tabs defaultValue="open" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="open" className="flex-1">
                Open
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">
                Completed
              </TabsTrigger>
            </TabsList>
            <TabsContent value="open" className="h-full">
              <TaskList status="open" />
            </TabsContent>
            <TabsContent value="completed" className="h-full">
              <TaskList status="completed" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

