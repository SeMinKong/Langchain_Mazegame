# Maze Pro Technical & AI Integration Details

## 1. AI API Endpoints
**Initialization API (`/api/v1/maze/init`)**
- **Function**: Feeds the complete 2D maze structure into the LLM's system message memory.
- **Format**: Takes `{"map": [["#", " ", "C"], ...]}` and maps it to a string for the LangChain memory state. This acts as the LLM's "vision."

**Command Execution API (`/api/v1/maze`)**
- **Function**: Processes the player's natural language alongside the current coordinates.
- **Response**: Requires strict JSON parsing: `{"thought": "...", "moves": [{"direction": "right", "steps": 1}]}`.

## 2. LangChain Model Configurations (`index.mjs`)
- **Model**: `llama3.2:3b` (Running locally via Ollama)
- **Parameters**:
  - `temperature: 0`: Forces deterministic logic. Creativity is disabled to prevent the AI from "hallucinating" walls or suggesting illegal moves.
  - `maxTokens: 200`: Keeps responses fast and precise, critical for an interactive game.
  - `top_k: 1`: Greedily selects the highest probability tokens to ensure JSON format integrity.

## 3. Maze Generation Algorithm (Iterative DFS)
- **Mechanism**: A recursive backtracking algorithm that carves paths by leaping 2 cells at a time in randomized directions.
- **Properties**: Generates a "Perfect Maze" which guarantees a viable solution path from any point to any other point, containing no isolated sections or closed loops.

## 4. Difficulty Configuration
| Level | Grid Size | Crystals | Total Tiles | Complexity |
|-------|-----------|----------|-------------|------------|
| Easy | 11 x 11 | 3 | 121 | Low |
| Medium | 17 x 17 | 5 | 289 | Medium |
| Hard | 25 x 25 | 10 | 625 | High |
