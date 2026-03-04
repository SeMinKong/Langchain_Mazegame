# Maze Combat Protocol & LangChain Server

This project consists of an Express server powered by LangChain (using Ollama) and a visual Maze game. It includes both a vanilla JS implementation and a React/Vite implementation.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended for ESM/Top-level await)
- **Ollama**: Ensure Ollama is installed and running on your local machine.
- **Llama 3.2:3b**: Pull the model using Ollama:
  ```bash
  ollama pull llama3.2:3b
  ```

---

## 🛠️ Components

### 1. Root Server (Express + LangChain)
The root server handles AI logic for the game using LangChain and Ollama. It also serves the vanilla JS version of the game.

**Installation:**
```bash
npm install
```

**Running the Server:**
```bash
node index.mjs
```
The server will start on [http://localhost:8000](http://localhost:8000).

---

### 2. Maze Pro (Vanilla JS Client)
The core game implementation is located in the `/public` directory.
- **Access:** Visit [http://localhost:8000](http://localhost:8000) once the server is running.
- **Features:** AI-assisted pathfinding and tactical protocol input.

---

### 3. React Maze Game (Vite + React)
A React-based version of the maze game is located in the `/maze-game` directory. (Currently a scaffold).

**Installation:**
```bash
cd maze-game
npm install
```

**Running the Dev Server:**
```bash
npm run dev
```
The Vite dev server will typically start on [http://localhost:5173](http://localhost:5173).

---

## 📁 Project Structure

- `index.mjs`: Main Express server with LangChain logic.
- `public/`: Assets and code for the vanilla JS game.
- `maze-game/`: React version of the game (Vite/TypeScript).
- `package.json`: Root server dependencies.
- `.gitignore`: Git exclusion patterns.

## 📝 License
ISC
