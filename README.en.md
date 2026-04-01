# Maze Pro: AI-Powered Combat Protocol 🕹️

**[한국어 버전](./README.md)**

An interactive maze exploration game powered by **LangChain** and **Ollama**. Unlike traditional maze games, players navigate through natural language commands interpreted by a local LLM, creating a unique synergy between classic gameplay and modern AI.

## 🚀 Key Features

- **AI-Driven Navigation**: Uses **LangChain** to parse natural language commands and translate them into executable movement logic.
- **Local LLM Integration**: Runs **llama3.2:3b** via **Ollama** for private, offline, and low-latency AI responses.
- **Dynamic Maze Generation**: Every game features a unique layout generated using the Recursive Backtracking algorithm.
- **Real-time AI Reasoning**: Displays the "Neural Logic" (AI's thought process) as it calculates the best path to crystals and the exit.
- **Responsive Web UI**: A sleek, dark-themed interface built with Vanilla JS and CSS3.

## 🛠 Tech Stack

- **AI Engine**: LangChain, Ollama (llama3.2:3b)
- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, CSS3
- **Future Plan**: Migration to React 19 & TypeScript

## 🏗 Project Structure

```text
├── index.mjs        # Backend server with LangChain integration
├── public/          # Frontend assets
│   ├── game.js      # Core game logic & AI communication
│   ├── style.css    # Cyberpunk-themed UI
│   └── index.html   # Game container
└── maze-game/       # (Work-in-progress) React migration project
```

## 🧠 Technical Highlights

### 1. Intelligent Command Interpretation
I implemented a robust prompt engineering strategy that feeds the entire maze structure into the LLM's system message. This allows the AI to act as a "tactical guide" that understands spatial constraints and provides valid JSON movement paths.

### 2. Recursive Backtracking Maze Generation
To ensure every maze is solvable and "perfect" (no loops, all areas reachable), I implemented a DFS-based generation algorithm that creates a different challenge for every session.

## 🏁 Quick Start

### Prerequisites
- Node.js (v18+)
- [Ollama](https://ollama.ai/) installed and running (`ollama pull llama3.2:3b`)

### Installation & Run
```bash
git clone <repository-url>
cd Langchain_Mazegame
npm install
npm start
```
Access the game at `http://localhost:8000`.

## 🎮 How to Play
- **Select Difficulty**: Choose from Easy, Medium, or Hard.
- **Enter Commands**: Type things like "move right 3 steps" or "find the nearest crystal".
- **Goal**: Collect all crystals (💎) and reach the exit (🏁).

---
Built with LangChain & Local AI.
