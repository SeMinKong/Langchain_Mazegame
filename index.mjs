import express from "express";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import { initChatModel } from "langchain";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));

let llm = null;
let isLlmReady = false;

// Async initialization
const initLLM = async () => {
  try {
    llm = await initChatModel("llama3.2:3b", {
      modelProvider: "ollama",
      baseUrl: "http://localhost:11434",
      temperature: 0,
      maxTokens: 200,
      modelOptions: { 
        top_k: 1
      }
    });
    console.log("Ollama 모델 로딩 시작 (GPU 로드 중)...");
    await llm.invoke("Hello, model warmup protocol initiated.");
    isLlmReady = true;
    console.log("Ollama 모델 로딩 완료.");
  } catch (error) {
    console.error("LLM 초기화 에러:", error);
  }
};

initLLM();

let mapMemory = [];

const parseAIResponse = (text) => {
  let thought = "생각을 읽을 수 없습니다.";
  let moves = [];

  console.log("AI 원본 텍스트:", text);

  try {
    const cleanText = text.replace(/json/g, "").replace(/ /g, "").trim();
    const jsonMatch = cleanText.match(/{[\s\S]*}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      thought = parsed.thought || thought;
      moves = parsed.moves || [];
    }
  } catch (e) {
    console.error("제이슨 파싱 에러:", e.message);
  }
  return { thought, moves };
};

app.get("/api/v1/status", (req, res) => {
  res.json({ ready: isLlmReady });
});

app.post("/api/v1/maze/init", async (req, res) => {
  if (!isLlmReady) {
    return res.status(503).json({ error: "AI 모델이 아직 준비되지 않았습니다. 잠시만 기다려주세요." });
  }
  try {
    const { map } = req.body;
    const mapStr = map.map(row => row.join("")).join("\n");
    
    mapMemory = [
      new SystemMessage(`당신은 플레이어의 미로 탐험을 돕는 가이드입니다.
지도는 다음과 같습니다. (#: 벽, 공백: 길, E: 출구, C: 크리스탈)
${mapStr}
이 지도를 완벽하게 기억하고, 플레이어가 크리스탈을 모두 모아 출구로 나갈 수 있는 최단 경로를 안내하세요. 벽을 통과하는 경로를 절대로 생성하지 마세요.`)
    ];

    console.log("지도 초기화 완료");

    return res.status(200).json({ message: "지도 기억 완료" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/v1/maze", async (req, res) => {
  try {
    const { command, state } = req.body;
    
    const prompt = `현재 위치: (${state.player.x}, ${state.player.y})
출구 위치: (${state.size-2}, ${state.size-2})
명령: "${command}"

이 명령을 수행하기 위한 아주 짧고 명확한 생각과 실제 이동할 경로를 오직 JSON 형식으로만 응답하세요.
빠른 응답이 생명입니다.
반드시 이 형식으로 답변하세요 : {"thought": "", "moves": [{"direction": "", "steps": }]}
`;

    const context = [...mapMemory, new HumanMessage(prompt)];
    const response = await llm.invoke(context);
    const result = parseAIResponse(response.content);

    console.log("AI 응답:", result);
    return res.json(result);

  } catch (error) {
    console.error("AI 에러:", error);
    return res.status(200).json({ thought: "통신에 문제가 생겼습니다.", moves: [] });
  }
});

const server = http.createServer(app);
server.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));