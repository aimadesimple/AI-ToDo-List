# AI Task Management Assistant

An intelligent task management application that combines the power of AI with a user-friendly interface to help users organize, track, and complete their tasks efficiently.

<p align="center">
  <img width="1509" alt="image" src="https://github.com/user-attachments/assets/26ce7597-2f0d-4cd1-86ca-b0c7dbe39d32" />
</p>

## ✨ Features

- 🤖 AI-powered task management assistant
- ✅ Create, update, complete, and delete tasks
- 🔍 Smart task organization and prioritization
- 🌐 Web search integration for task-related information
- 📋 Task breakdown for complex projects
- 💬 Natural language interaction with conversational UI
- 🎯 Guided onboarding process
- 🔄 Real-time task updates and notifications

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) 15.1.0
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [LangChain](https://js.langchain.com/docs/) for AI orchestration
- [OpenAI GPT-4o](https://openai.com/index/gpt-4o-system-card/) as the AI model
- [Tavily](https://tavily.com/) for web search capabilities
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn UI](https://ui.shadcn.com/) Components (based on Radix UI)
- [Zod](https://zod.dev/) for schema validation

## 📋 Prerequisites

Before you begin, ensure you have:

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (Node Package Manager)
- [OpenAI API key](https://platform.openai.com/)
- [Tavily API key](https://tavily.com/) (for web search functionality)

## 🚀 Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/aimadesimple/AI-ToDo-List.git
cd AI-ToDo-List
```

2. **Install dependencies:**

```bash
npm install --legacy-peer-deps
```

3. **Create a `.env.local` file in the root directory:**

```env
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

4. **Start the development server:**

```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## 📁 Project Structure

```
/
├── app/                           # Next.js application routes and API endpoints
│   ├── api/                       # API endpoints
│   │   ├── chat/                  # AI chat endpoint
│   │   │   └── route.ts           # AI assistant API logic
│   │   ├── tasks/                 # Tasks API endpoints
│   │   │   ├── [id]/              # Task-specific operations
│   │   │   │   └── route.ts       # PATCH, DELETE operations for specific tasks
│   │   │   └── route.ts           # GET, POST operations for tasks
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout component
│   └── page.tsx                   # Home page component
│
├── components/                    # React components
│   ├── ui/                        # UI components (shadcn/ui)
│   │   ├── accordion.tsx          # Accordion component
│   │   ├── breadcrumb.tsx         # Breadcrumb component
│   │   ├── button.tsx             # Button component
│   │   ├── command.tsx            # Command component
│   │   ├── context-menu.tsx       # Context menu component
│   │   ├── dialog.tsx             # Dialog component
│   │   ├── dropdown-menu.tsx      # Dropdown menu component
│   │   ├── input-otp.tsx          # OTP input component
│   │   ├── input.tsx              # Input component
│   │   ├── menubar.tsx            # Menubar component
│   │   ├── navigation-menu.tsx    # Navigation menu component
│   │   ├── resizable.tsx          # Resizable component
│   │   ├── sheet.tsx              # Sheet component
│   │   ├── sidebar.tsx            # Sidebar component
│   │   ├── skeleton.tsx           # Skeleton component
│   │   ├── tabs.tsx               # Tabs component
│   │   └── ... other UI components
│   ├── chat-interface.tsx         # Chat interface component
│   ├── task-list.tsx              # Task list component
│   └── theme-provider.tsx         # Theme provider component
│
├── contexts/                      # React context providers
│   ├── task-context.tsx           # Task management context
│   └── task-refresh.ts            # Task refresh events
│
├── hooks/                         # Custom React hooks
│   └── use-mobile.ts              # Hook for detecting mobile devices
│
├── lib/                           # Utility functions and type definitions
│   ├── types.ts                   # TypeScript type definitions
│   └── utils.ts                   # Utility functions
│
├── public/                        # Static assets
│   └── ... (images, favicons, etc.)
│
├── styles/                        # Additional styles
│   └── globals.css                # Global styles
│
├── .env.local                     # Environment variables (not in repo)
├── .gitignore                     # Git ignore file
├── components.json                # Shadcn UI configuration
├── next.config.mjs                # Next.js configuration
├── package.json                   # NPM package configuration
├── postcss.config.mjs             # PostCSS configuration
├── README.md                      # Project documentation
├── tailwind.config.ts             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
```

This structure follows modern Next.js application architecture with the App Router pattern, separating concerns between API endpoints, UI components, business logic, and configuration.

## 🧩 Key Components

### AI Assistant

The AI assistant is powered by LangChain and GPT-4o, providing natural language interaction for task management. It can:

- Understand complex task requirements
- Break down large tasks into manageable subtasks
- Provide suggestions for task organization
- Help prioritize work items based on deadlines and importance

### Task Management

The application provides a complete task management system with:

- Task creation and editing with rich text support
- Status tracking and progress monitoring
- Task completion with visual feedback
- Task deletion and archiving
- Task filtering and sorting (by status, priority, due date)

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | AI assistant interaction |
| `/api/tasks` | GET | Retrieve tasks |
| `/api/tasks` | POST | Create new task |
| `/api/tasks/:id` | PATCH | Update task |
| `/api/tasks/:id` | DELETE | Delete task |

## 💻 Development

The project uses several development tools and practices:

- TypeScript for type safety and improved developer experience
- ESLint for code linting and maintaining code quality
- Tailwind CSS for responsive and utility-first styling
- Shadcn UI components for consistent design language
- Next.js App Router for efficient routing and server components

## 🤝 Contributing

We welcome contributions to improve the AI Task Management Assistant!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [OpenAI](https://openai.com/) for GPT-4 API
- [LangChain](https://js.langchain.com/docs/) for AI orchestration
- [Tavily](https://tavily.com/) for web search capabilities
- [Shadcn UI](https://ui.shadcn.com/) for component library
- [Vercel](https://vercel.com/) for hosting and deployment platform

## 🆘 Support

For support, please [open an issue](https://github.com/aimadesimple/AI-ToDo-List/issues) in the GitHub repository or contact the maintainers at contact@aimadesimple.info.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/aimadesimple">AIMadeSimple</a>
</p>
