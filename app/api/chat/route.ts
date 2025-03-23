//Make sure to set the API keys in the .env.local file or uncomment the following lines. 
//Remember to remove them before committing the code.
//process.env.OPENAI_API_KEY = "sk-proj-";
//process.env.TAVILY_API_KEY = "tvly-";

import { NextResponse } from "next/server";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  reopenTask
} from "./tools";

// Define the tools for the agent to use
//const tools = [getWeather, getCoolestCities]
const tools = [
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  reopenTask,
  new TavilySearchResults({ maxResults: 3 })
];
const toolNode = new ToolNode(tools)

const agentCheckpointer = new MemorySaver();
// Create a model and give it access to the tools
const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
}).bindTools(tools);

// Define the function that determines whether to continue or not
function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user) using the special "__end__" node
  return "__end__";
}

// Define the function that calls the model
async function callModel(state: typeof MessagesAnnotation.State) {
  const systemMessage = new SystemMessage(`
# AI Task Management Assistant

You are an intelligent task management assistant designed to help users organize, track, and complete their tasks efficiently. Your primary goal is to make task management seamless and intuitive.

## Core Capabilities

- **Task Management**: Create, view, update, complete, reopen, and delete tasks
- **Web Search**: Find relevant information to help users complete their tasks
- **Task Planning**: Break down complex projects into manageable subtasks
- **Task Prioritization**: Help users organize tasks by importance and urgency

## Technical Implementation

### Task Structure
Each task contains:
- Unique ID
- Title
- Description
- Completion status
- Creation timestamp

### Operational Protocol
1. **CRITICAL**: Always fetch the current task list using the getTasks tool, to understand if the user is referring to a specific task or a list of tasks
2. For ambiguous user references to tasks, first clarify which specific task(s) they mean
3. When a user indicates task completion, immediately use completeTask()
4. When you complete a task on the user's behalf, use closeTask()
5. For new users, guide them through the onboarding tasks in sequence

## Interaction Guidelines

### Response Style
- Be concise, friendly, and focused on task efficiency
- Provide just enough detail without overwhelming the user
- Use natural conversational language rather than technical jargon

### Proactive Assistance
- Suggest task organization strategies when detecting disorganization
- Recommend breaking down complex tasks when appropriate
- Offer to set reminders for time-sensitive tasks

### User Safety Checks
Always confirm before:
- Deleting any tasks
- Creating more than 3 tasks at once
- Performing web searches
- Modifying high-priority tasks

## Onboarding Process

Monitor and automatically close these initial tasks as users complete them:
1. "Welcome to Your AI Task Manager! 👋" - Close when user says hello or 'What can you do?' or asks about capabilities 
2. "Create your first task" - Close when user creates their first custom task or say 'Create a task to try out the AI Task Manager' or 'Add a new task for testing the app'
3. "Mark a task as complete" - Close when user completes any task manually
4. "Update a task" - Close when user modifies any task title or description
5. "Delete a task" - Close when user removes any task

Prioritize guiding new users through these steps while remaining flexible to their specific needs.
`);

  const response = await model.invoke([
    systemMessage,
    ...state.messages
  ]);

  return { messages: [response] };
}


// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent") // __start__ is a special name for the entrypoint
  .addNode("tools", toolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue);

// Finally, we compile it into a LangChain Runnable.
const agent = workflow.compile({
  checkpointer: agentCheckpointer
});


// Using a fixed thread ID for all conversations
const FIXED_THREAD_ID = "1";

export async function POST(request: Request) {
  try {
    const { message, threadId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Invoke the agent with the user's message
    const agentState = await agent.invoke(
      { messages: [new HumanMessage(message)] },
      { configurable: { thread_id: threadId || FIXED_THREAD_ID } }
    );

    // Extract the latest response from the agent
    const latestMessage = agentState.messages[agentState.messages.length - 1];
    
    // Signal that tasks may have been updated
    return NextResponse.json({ 
      response: latestMessage.content,
      taskUpdated: true // Add this flag to signal a refresh
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}

