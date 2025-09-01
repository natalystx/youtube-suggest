# YT-Suggest: AI-Powered YouTube Video Recommendations

YT-Suggest is an intelligent web application that helps users discover YouTube videos based on their interests. Leveraging AI technology, it analyzes user queries, provides personalized search suggestions, and learns from user preferences over time.

## 🎬 Demo

Here's a sample of YT-Suggest in action:

[![YT-Suggest Demo](https://img.youtube.com/vi/I8SnC90w5zM/0.jpg)](https://www.youtube.com/watch?v=I8SnC90w5zM)

> [Watch the demo video on YouTube](https://www.youtube.com/watch?v=I8SnC90w5zM)

## 🌟 Features

- **AI-Powered Search**: Get intelligent YouTube video recommendations based on your queries
- **Interactive Chat Interface**: Ask naturally for videos you'd like to watch
- **Video Exploration**: Browse video results with detailed information
- **Embedded Video Player**: Watch videos directly within the application
- **Preference Learning**: Like or dislike videos to improve future recommendations
- **Search Regeneration**: Generate alternative search terms with a single click

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- API keys for Google/YouTube, Gemini, and Chroma

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/natalystx/youtube-suggest.git
   cd youtube-suggest
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env.local`
   - Fill in your API keys:

     ```env
     GOOGLE_API_KEY=your_google_api_key
     GEMINI_API_KEY=your_gemini_api_key
     CHROMA_API_KEY=your_chroma_api_key
     CHROMA_TENANT=your_chroma_tenant
     CHROMA_DATABASE=your_chroma_database
     ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Technology Stack

- **Frontend**:

  - Next.js 15
  - React 19
  - Tailwind CSS 4
  - TypeScript

- **AI & Search**:

  - LangChain
  - Google Generative AI (Gemini)
  - ChromaDB (Vector Database)

- **API Integration**:
  - YouTube Data API v3

## 🧠 How It Works

1. **User Query**: Users input what they're interested in watching.
2. **AI Processing**: The application analyzes the query using Gemini AI and generates optimized search terms.
3. **Video Retrieval**: These search terms are used to fetch relevant videos via the YouTube API.
4. **User Interaction**: Users can watch videos, express preferences, and refine their search.
5. **Learning**: The system stores user preferences in a vector database to improve future recommendations.

## 📂 Project Structure

```text
/
├── ai/                  # AI-related functionality
│   └── search/          # Search suggestion implementation
├── app/                 # Next.js app directory
│   ├── api/             # API routes
│   ├── chat/            # Chat page
│   ├── watch/           # Watch page and video player
│   └── page.tsx         # Home page
├── collabs/             # External service integrations
│   ├── chroma.ts        # ChromaDB vector store setup
│   ├── embeddings.ts    # Text embedding configuration
│   ├── llm.ts           # Language model setup
│   └── youtube.ts       # YouTube API client
├── components/          # Reusable React components
│   ├── ChatInput.tsx    # Chat input component
│   ├── VideoCard.tsx    # Video display card
│   └── ...
├── public/              # Static assets
└── ...
```

## 🌐 API Routes

- `/api/chat` - Processes user queries and returns search suggestions
- `/api/regenerate` - Generates alternative search terms
- `/api/video-action` - Records user likes/dislikes for learning

## 🔒 Environment Variables

| Variable          | Description                        |
| ----------------- | ---------------------------------- |
| `GOOGLE_API_KEY`  | API key for YouTube Data API       |
| `GEMINI_API_KEY`  | API key for Google Gemini AI       |
| `CHROMA_API_KEY`  | API key for Chroma vector database |
| `CHROMA_TENANT`   | Tenant ID for Chroma DB            |
| `CHROMA_DATABASE` | Database name for Chroma DB        |

## 📚 Further Development

- Add authentication for personalized recommendations
- Implement video history tracking
- Add more AI-powered features like content summarization
- Create playlists from recommended videos
- Enhance recommendation algorithms with additional metadata

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/yt-suggest/issues).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) for the application framework
- [YouTube Data API](https://developers.google.com/youtube/v3) for video data
- [Google Generative AI](https://ai.google.dev/) for AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [ChromaDB](https://www.trychroma.com/) for vector storage
- [LangChain](https://www.langchain.com/) for AI workflows
