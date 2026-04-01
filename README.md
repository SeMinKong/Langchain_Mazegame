# Maze Pro: LangChain AI-Powered Maze Game

**한국어 | [English](#english-section)**

---

## 한국어 섹션

### 프로젝트 개요

**Maze Pro: Combat Protocol**은 LangChain과 Ollama를 통한 로컬 AI를 활용하여 플레이어가 미로를 탐험하고 크리스탈을 수집하는 인터랙티브 게임입니다. AI 가이드가 자연어 명령어를 해석하고 최적의 경로를 제안하여 미로를 빠져나가는 것을 돕습니다.

### 기술 스택

| 계층 | 기술 | 설명 |
|------|------|------|
| **AI 엔진** | LangChain 1.2.x | AI 통합 및 메시지 관리 |
| **LLM 공급자** | Ollama (llama3.2:3b) | 로컬 실행형 언어 모델 |
| **백엔드** | Node.js (v18+) + Express.js 5.x | REST API 서버 |
| **프론트엔드** | Vanilla JavaScript | 클라이언트 UI 및 게임 로직 |
| **스타일링** | CSS3 | 레이아웃 및 미세한 애니메이션 |
| **미들웨어** | CORS, Morgan | 크로스 오리진 및 HTTP 로깅 |
| **선택 프론트엔드** | React 19.x, Vite 7.x, TypeScript 5.9.x | 향후 마이그레이션 예정 |

### 주요 특징

- **AI 기반 가이드**: LangChain을 통해 플레이어의 자연어 명령을 AI가 해석하고 실행 가능한 경로로 변환
- **난이도 조절**: 3가지 난이도(Easy, Medium, Hard)로 미로 크기와 크리스탈 개수 조정
- **실시간 미로 생성**: Iterative DFS(재귀적 백트래킹) 알고리즘으로 매번 새로운 미로 생성
- **AI 사고 과정 표시**: AI의 사고 과정을 실시간으로 사용자에게 표시
- **타이머 및 통계**: 플레이 시간 측정 및 크리스탈 수집 현황 표시
- **반응형 UI**: 모던 디자인과 부드러운 애니메이션

---

## 사용자 가이드

### 게임 시작하기

1. 브라우저에서 `http://localhost:8000` 접속
2. 난이도 선택 (좌상단):
   - **Easy**: 11x11 미로, 3개 크리스탈
   - **Medium**: 17x17 미로, 5개 크리스탈
   - **Hard**: 25x25 미로, 10개 크리스탈
3. 시스템이 초기화될 때까지 대기 (로딩 화면 표시)

### 게임 방법

#### 명령 입력 방식

입력창에 자연어 명령을 입력하고 EXECUTE 버튼을 누르거나 Enter 키를 누릅니다.

**명령 예시:**
- `오른쪽으로 3칸 이동`
- `크리스탈 수집`
- `왼쪽 위로 움직여`
- `아래로 내려가`
- `직진`
- `앞으로 이동`
- `왼쪽으로 3칸`
- `미로를 탈출할 최단 경로를 알려줘`
- `가장 가까운 크리스탈로 가자`
- `상하좌우`

AI가 명령을 해석하여 다음 형식의 JSON을 반환합니다:
```json
{
  "thought": "현재 위치에서 오른쪽으로 3칸 이동할 것입니다",
  "moves": [
    { "direction": "right", "steps": 3 }
  ]
}
```

각 명령은 최대 200자 제한이 있습니다.

#### 지원되는 방향

- `up` (위)
- `down` (아래)
- `left` (왼쪽)
- `right` (오른쪽)

### 게임 규칙

| 규칙 | 설명 |
|------|------|
| **시작점** | (1, 1) - 미로 좌상단 |
| **목표** | 모든 크리스탈(💎) 수집 후 출구(🏁)에 도달 |
| **장애물** | 벽(#)은 통과 불가 |
| **크리스탈** | 수집 시 자동으로 사라지고 수집 카운트 증가 |
| **출구** | 모든 크리스탈 미수집 시 잠금(🔒), 수집 후 개방 |
| **위치** | 출구는 미로 우측 하단 (size-2, size-2) |
| **명령 제한** | 최대 200자 |

### 게임 상태 표시

- **💎 수집 현황**: 상단 우측의 "수집한 크리스탈 / 전체 크리스탈"
- **⏱️ 타이머**: 게임 시작 후 경과 시간 (초 단위)
- **상태 메시지** (헤더):
  - `Neural Link Established` (녹색) - AI 준비 완료
  - `AI Offline` (빨강) - AI 통신 오류
  - `MISSION ACCOMPLISHED` (녹색) - 게임 클리어
  - `MISSION FAILED` (빨강) - 게임 오버

### 게임 화면 구성

```
┌─────────────────────────────────────────────────────┬──────────┐
│ Maze Pro EXPLORER      [상태 메시지]  [난이도 버튼] │ 💎 0/5   │
├─────────────────────────────────────────────────────┼──────────┤
│                                                     │ ⏱️ 0s    │
│              게임 보드 (미로)                       │          │
│              # # # # # #                           │ 미션 가이드 │
│              #   P C   #                           │          │
│              # # # # # #                           │ 신경 논리 │
│                                                     │ (AI 사고)  │
│                                                     │          │
│                                                     │ 활동 로그  │
├─────────────────────────────────────────────────────┴──────────┤
│ [입력창: "Enter tactical protocol..."]  [EXECUTE]               │
└──────────────────────────────────────────────────────────────┘
```

**범례:**
- `#` = 벽
- ` ` = 통로
- `P` = 플레이어 (파란 원)
- `💎` = 크리스탈
- `🏁` = 출구 (오픈)
- `🔒` = 출구 (잠금)

### AI 가이드 기능

AI는 다음을 수행합니다:

1. **미로 학습**: 게임 시작 시 전체 미로 구조를 학습
2. **자연어 해석**: 플레이어의 명령을 이해하고 해석
3. **최단 경로 계산**: 벽을 회피한 유효한 이동 경로 제안
4. **사고 과정 공유**: 각 결정에 대한 이유를 실시간으로 표시

### 난이도 레벨

| 난이도 | 미로 크기 | 크리스탈 수 | 칸 수 | 권장 |
|--------|---------|----------|-------|------|
| **Easy** | 11×11 | 3개 | 121칸 | 초보자 |
| **Medium** | 17×17 | 5개 | 289칸 | 권장 (기본) |
| **Hard** | 25×25 | 10개 | 625칸 | 도전자 |

### 승리 조건

1. 모든 크리스탈 수집 (💎 카운트가 최대값과 같음)
2. 출구(🏁)에 도달
3. `MISSION ACCOMPLISHED` 메시지 표시

---

## 개발자 가이드

### 필수 요구사항

#### Node.js 환경
- **Node.js**: v18 이상 (ES Module 및 Top-level await 지원 필수)
- **npm**: v9 이상 또는 **yarn** v1.22 이상

#### AI 인프라
- **Ollama**: 최신 버전 (로컬 설치)
- **llama3.2:3b 모델**: 사전에 Ollama에서 다운로드

Ollama 설치 및 모델 다운로드:
```bash
# 1. Ollama 설치 (https://ollama.ai 방문)

# 2. 모델 다운로드
ollama pull llama3.2:3b

# 3. Ollama 서버 실행
ollama serve
# 기본 포트: http://localhost:11434
```

#### 포트 및 네트워크
- **로컬 포트 8000**: 백엔드 서버용 (변경 가능)
- **로컬 포트 11434**: Ollama 서버용 (기본값)
- **인터넷**: Ollama 모델 초기 다운로드용

### 설치 단계

#### 1단계: 저장소 클론 또는 다운로드
```bash
git clone <repository-url>
cd Langchain_Mazegame
```

#### 2단계: 백엔드 의존성 설치
```bash
npm install
```

설치되는 주요 패키지:
- **LangChain**: `@langchain/core`, `@langchain/ollama`, `langchain`
- **백엔드**: `express`, `cors`, `morgan`

#### 3단계: 환경 설정 (선택사항)

프로젝트 루트에 `.env` 파일을 생성하여 설정을 커스터마이징할 수 있습니다. 현재는 `index.mjs`에 하드코딩되어 있으므로, 다음과 같이 추가하는 것을 권장합니다:

```bash
cat > .env << 'EOF'
# 백엔드 서버 설정
PORT=8000
NODE_ENV=development

# Ollama 설정
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b

# LLM 파라미터
LLM_TEMPERATURE=0
LLM_MAX_TOKENS=200
LLM_TOP_K=1
EOF
```

#### 4단계: Ollama가 실행 중인지 확인

별도의 터미널에서:
```bash
ollama serve
# 또는 Ollama 데스크톱 앱 실행 (Windows/macOS)
```

#### 5단계: 서버 시작
```bash
npm start
# 또는
node index.mjs
```

예상 출력:
```
서버 실행 중: http://localhost:8000
```

#### 6단계: 클라이언트 접속

브라우저에서:
```
http://localhost:8000
```

### 환경 변수 설정

현재 `index.mjs`에 하드코딩된 설정:

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `PORT` | `8000` | 백엔드 서버 포트 |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama 서버 주소 |
| `OLLAMA_MODEL` | `llama3.2:3b` | 사용할 LLM 모델 |
| `LLM_TEMPERATURE` | `0` | AI 응답의 창의성 (0 = 결정적) |
| `LLM_MAX_TOKENS` | `200` | 최대 응답 길이 |
| `LLM_TOP_K` | `1` | 토큰 샘플링 방식 (1 = 최고 확률만) |

`.env` 지원을 추가하려면 `index.mjs` 상단에 다음 추가:
```javascript
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8000;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';
```

### npm 스크립트

**`package.json` (루트):**

현재 설정:
```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

권장 추가:
```json
{
  "scripts": {
    "start": "node index.mjs",
    "dev": "node index.mjs",
    "dev:watch": "nodemon index.mjs"
  }
}
```

설치 후 사용:
```bash
npm start      # 서버 실행
npm run dev    # 개발 모드 실행
npm run dev:watch  # 파일 변경 시 자동 재시작 (nodemon 필요)
```

### 프로젝트 구조

```
Langchain_Mazegame/
├── index.mjs                 # 메인 백엔드 서버 (Express + LangChain)
├── package.json              # 백엔드 의존성 및 스크립트
├── .gitignore                # Git 무시 설정
├── README.md                 # 이 파일
│
├── public/                   # 정적 파일 (프론트엔드)
│   ├── index.html            # 게임 UI (HTML 컨테이너)
│   ├── game.js               # 게임 로직 및 AI 통신 (8KB)
│   └── style.css             # UI 스타일 (5KB)
│
├── maze-game/                # React 프로젝트 (향후 마이그레이션용)
│   ├── package.json
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── eslint.config.js
│   └── src/
│       ├── index.css
│       └── App.css
│
└── .git/                     # Git 저장소
```

**파일 크기 및 역할:**

| 파일 | 크기 | 역할 |
|------|------|------|
| `index.mjs` | 3KB | Express 서버, LangChain 통합, API 엔드포인트 |
| `public/game.js` | 8KB | 게임 코어 로직, 미로 생성, UI 관리 |
| `public/style.css` | 5KB | 반응형 UI, 애니메이션, 테마 |
| `public/index.html` | 2KB | HTML 구조, 렌더링 컨테이너 |

### AI 통합 작동 방식

#### 전체 플로우

```
[게임 시작] 
    ↓
[1. /api/v1/maze/init] ← 미로 맵 전송
    ↓
[mapMemory 초기화] ← System Message에 미로 저장
    ↓
[플레이어 명령 입력]
    ↓
[2. /api/v1/maze] ← 현재 상태 + 명령 전송
    ↓
[LangChain Invoke] ← (System Message + 새 Human Message)
    ↓
[Ollama (llama3.2:3b)] ← AI 모델 응답
    ↓
[AI 응답 (JSON)] ← { "thought": "...", "moves": [...] }
    ↓
[parseAIResponse()] ← JSON 파싱 및 검증
    ↓
[클라이언트 실행] ← processMove() 이동 처리 및 렌더링
```

#### 1. 초기화 API: `/api/v1/maze/init`

**목적**: 게임 시작 시 AI에 미로 구조를 학습시킴

**요청:**
```json
{
  "method": "POST",
  "url": "/api/v1/maze/init",
  "headers": { "Content-Type": "application/json" },
  "body": {
    "map": [
      ["#", "#", "#", "#", "#"],
      ["#", " ", "C", " ", "#"],
      ["#", " ", "#", " ", "#"],
      ["#", " ", " ", " ", "#"],
      ["#", "#", "#", "E", "#"]
    ]
  }
}
```

**응답:**
```json
{
  "message": "지도 기억 완료"
}
```

**백엔드 처리 (`index.mjs`):**
```javascript
app.post("/api/v1/maze/init", async (req, res) => {
  const { map } = req.body;
  
  // 2D 배열을 문자열로 변환
  const mapStr = map.map(row => row.join("")).join("\n");
  
  // mapMemory에 System Message 저장
  mapMemory = [
    new SystemMessage(`당신은 플레이어의 미로 탐험을 돕는 가이드입니다.
지도는 다음과 같습니다. (#: 벽, 공백: 길, E: 출구, C: 크리스탈)
${mapStr}
이 지도를 완벽하게 기억하고, 플레이어가 크리스탈을 모두 모아 출구로 나갈 수 있는 최단 경로를 안내하세요. 벽을 통과하는 경로를 절대로 생성하지 마세요.`)
  ];
  
  return res.status(200).json({ message: "지도 기억 완료" });
});
```

#### 2. 명령 실행 API: `/api/v1/maze`

**목적**: 플레이어 명령을 AI가 해석하고 이동 경로 반환

**요청:**
```json
{
  "method": "POST",
  "url": "/api/v1/maze",
  "headers": { "Content-Type": "application/json" },
  "body": {
    "command": "오른쪽으로 3칸 이동",
    "state": {
      "player": { "x": 1, "y": 1 },
      "crystals": [
        { "x": 2, "y": 1 },
        { "x": 3, "y": 3 }
      ],
      "size": 5
    }
  }
}
```

**응답:**
```json
{
  "thought": "현재 위치 (1,1)에서 오른쪽으로 3칸 이동합니다.",
  "moves": [
    { "direction": "right", "steps": 3 }
  ]
}
```

**AI 프롬프트:**
```
현재 위치: (1, 1)
출구 위치: (3, 3)
명령: "오른쪽으로 3칸 이동"

이 명령을 수행하기 위한 아주 짧고 명확한 생각과 실제 이동할 경로를 
오직 JSON 형식으로만 응답하세요.
빠른 응답이 생명입니다.
반드시 이 형식으로 답변하세요: 
{"thought": "", "moves": [{"direction": "", "steps": }]}
```

**백엔드 처리:**
```javascript
app.post("/api/v1/maze", async (req, res) => {
  const { command, state } = req.body;
  
  // 프롬프트 생성
  const prompt = `현재 위치: (${state.player.x}, ${state.player.y})
출구 위치: (${state.size-2}, ${state.size-2})
명령: "${command}"

이 명령을 수행하기 위한 아주 짧고 명확한 생각과 실제 이동할 경로를 오직 JSON 형식으로만 응답하세요.
빠른 응답이 생명입니다.
반드시 이 형식으로 답변하세요 : {"thought": "", "moves": [{"direction": "", "steps": }]}`;

  // mapMemory + 새 명령
  const context = [...mapMemory, new HumanMessage(prompt)];
  
  // LangChain Invoke
  const response = await llm.invoke(context);
  
  // JSON 파싱
  const result = parseAIResponse(response.content);
  
  return res.json(result);
});
```

#### 3. LangChain 설정 (`index.mjs`)

```javascript
import { initChatModel } from "langchain";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// LLM 초기화
const llm = await initChatModel("llama3.2:3b", {
  modelProvider: "ollama",
  baseUrl: "http://localhost:11434",
  temperature: 0,        // 결정적 응답 (창의성 제거)
  maxTokens: 200,        // 빠른 응답
  modelOptions: { 
    top_k: 1             // 가장 높은 확률의 토큰만 선택
  }
});
```

**파라미터 설명:**
- `temperature: 0` - AI가 항상 같은 방식으로 응답 (일관성 우선)
- `maxTokens: 200` - 응답 길이 제한으로 빠른 처리
- `top_k: 1` - 가장 높은 확률의 토큰만 샘플링 (안정성)

#### 4. AI 응답 파싱 (`index.mjs`)

```javascript
const parseAIResponse = (text) => {
  let thought = "생각을 읽을 수 없습니다.";
  let moves = [];

  console.log("AI 원본 텍스트:", text);

  try {
    // JSON 부분 추출
    const cleanText = text.replace(/json/g, "").replace(/ /g, "").trim();
    const jsonMatch = cleanText.match(/{[\s\S]*}/);

    if (jsonMatch) {
      // JSON 파싱
      const parsed = JSON.parse(jsonMatch[0]);
      thought = parsed.thought || thought;
      moves = parsed.moves || [];
    }
  } catch (e) {
    console.error("제이슨 파싱 에러:", e.message);
  }
  
  return { thought, moves };
};
```

**파싱 로직:**
1. AI 응답에서 JSON 부분 추출
2. 공백 제거 후 `{...}` 패턴 매칭
3. JSON 파싱 성공 시 `thought`, `moves` 추출
4. 실패 시 기본값 반환

### 난이도 설정 (`DIFFICULTY_CONFIG`)

`public/game.js`에서 정의:

```javascript
const DIFFICULTY_CONFIG = {
  easy: {
    size: 11,        // 11x11 그리드
    crystals: 3      // 3개 크리스탈
  },
  medium: {
    size: 17,        // 17x17 그리드
    crystals: 5      // 5개 크리스탈
  },
  hard: {
    size: 25,        // 25x25 그리드
    crystals: 10     // 10개 크리스탈
  }
};
```

**난이도별 특징:**

| 난이도 | 크기 | 크리스탈 | 칸 수 | 벽 비율 | 복잡도 |
|--------|------|---------|-------|--------|--------|
| Easy | 11x11 | 3 | 121 | ~50% | 낮음 |
| Medium | 17x17 | 5 | 289 | ~50% | 중간 |
| Hard | 25x25 | 10 | 625 | ~50% | 높음 |

**새 난이도 추가 (예: Insane):**

1. `public/game.js`에 설정 추가:
```javascript
DIFFICULTY_CONFIG.insane = {
  size: 33,
  crystals: 20
};
```

2. `public/index.html`에 버튼 추가:
```html
<button onclick="Game.start('insane')" id="btn-insane" class="diff-btn">Insane</button>
```

### 미로 생성 알고리즘

**Iterative DFS (재귀적 백트래킹)**

```javascript
generateMaze(size) {
  // 1. 전체 그리드를 벽('#')으로 초기화
  const grid = Array.from({length: size}, () => Array(size).fill('#'));
  
  // 2. DFS 탐색 함수
  const walk = (x, y) => {
    // 현재 셀을 경로로 표시
    grid[y][x] = ' ';
    
    // 이웃 방향을 무작위 순서로 섞기 (2칸 간격 유지)
    const dirs = [[0,-2],[0,2],[-2,0],[2,0]].sort(() => Math.random() - 0.5);
    
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      
      // 유효하고 미방문한 셀이면 방문
      if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1 && grid[ny][nx] === '#') {
        // 현재 셀과 다음 셀 사이의 벽 제거 (통로 연결)
        grid[y + dy / 2][x + dx / 2] = ' ';
        walk(nx, ny);  // 재귀 호출
      }
    }
  };
  
  walk(1, 1);  // (1,1)에서 시작
  grid[size - 2][size - 2] = 'E';  // 출구 설정
  return grid;
}
```

**알고리즘 특징:**

| 특징 | 설명 |
|------|------|
| **유형** | Randomized Depth-First Search |
| **시작점** | (1, 1) |
| **종료점** | (size-2, size-2) |
| **시간복잡도** | O(n²) |
| **공간복잡도** | O(n²) |
| **특성** | 완벽한 미로 (순환 없음, 모든 셀 연결) |
| **다양성** | 매번 다른 미로 (무작위 방향 선택) |

### 게임 로직 상세

#### 플레이어 이동 처리 (`processMove`)

```javascript
async processMove({ direction, steps = 1 }) {
  // 각 스텝마다 반복 (연속 이동)
  for (let i = 0; i < steps; i++) {
    // 1. 방향에 따른 다음 좌표 계산
    let nx = this.player.x, ny = this.player.y;
    if (direction === 'up') ny--;
    else if (direction === 'down') ny++;
    else if (direction === 'left') nx--;
    else if (direction === 'right') nx++;

    // 2. 경계 및 벽 검사
    if (ny >= 0 && ny < this.maze.length && 
        nx >= 0 && nx < this.maze[0].length && 
        this.maze[ny][nx] !== '#') {
      
      // 3. 유효한 이동이면 위치 업데이트
      this.player = {x: nx, y: ny};
      
      // 4. 크리스탈 수집 검사
      if (this.maze[ny][nx] === 'C') {
        this.maze[ny][nx] = ' ';  // 크리스탈 제거
        this.collected++;
      }
      
      // 5. UI 렌더링
      UI.render();
      
      // 6. 애니메이션 딜레이 (80ms = 시각적 부드러움)
      await new Promise(r => setTimeout(r, 80));
      
      // 7. 승리 조건 검사 (출구 + 모든 크리스탈)
      if (this.maze[ny][nx] === 'E' && this.collected >= this.crystals.length) {
        this.victory();
        return;
      }
    } else {
      // 벽이나 경계에 충돌하면 이동 중단
      break;
    }
  }
}
```

**흐름:**
1. 각 스텝마다 한 칸씩 이동
2. 유효성 검사 (경계, 벽)
3. 크리스탈 자동 수집
4. 80ms 딜레이로 애니메이션
5. 매 이동마다 승리 조건 검사

#### 크리스탈 배치 (`placeItems`)

```javascript
placeItems(symbol, count, minDist = 0) {
  const items = [];
  
  // count개의 아이템을 배치할 때까지 반복
  while (items.length < count) {
    // 무작위 위치 선택
    const rx = Math.floor(Math.random() * this.maze.length);
    const ry = Math.floor(Math.random() * this.maze.length);
    
    // 시작점으로부터의 맨해튼 거리 계산
    const dist = Math.abs(rx - 1) + Math.abs(ry - 1);
    
    // 유효한 위치면 배치
    if (this.maze[ry][rx] === ' ' && dist > minDist) {
      if (symbol) this.maze[ry][rx] = symbol;
      items.push({x: rx, y: ry});
    }
  }
  
  return items;
}
```

**배치 조건:**
- 경로 위에만 배치 (벽 제외)
- 시작점과의 거리 검사 (나중에 확장 가능)
- 배치 위치를 아이템 배열에 기록

### 문제 해결

#### 1. Ollama 연결 실패
```
오류: Error: ECONNREFUSED 127.0.0.1:11434
해결 방법:
  1. ollama serve 명령으로 Ollama 데몬이 실행 중인지 확인
  2. Windows/macOS에서는 Ollama 데스크톱 앱 실행
  3. 포트 11434가 사용 가능한지 확인: lsof -i :11434
```

#### 2. 포트 이미 사용 중
```
오류: listen EADDRINUSE: address already in use :::8000
해결 방법:
  1. lsof -i :8000 으로 프로세스 확인
  2. kill -9 <PID> 로 프로세스 종료
  3. 또는 index.mjs의 PORT를 다른 값으로 변경
```

#### 3. 모델 미다운로드
```
오류: Model 'llama3.2:3b' not found
해결 방법:
  ollama pull llama3.2:3b
  # 또는 다른 모델 사용:
  ollama pull llama2
  ollama pull mistral
```

#### 4. AI 응답이 JSON이 아님
```
오류: JSON 파싱 실패 → "생각을 읽을 수 없습니다."
원인: AI가 JSON 형식을 무시하고 다른 형식으로 응답
해결 방법:
  1. index.mjs의 temperature를 더 낮게 조정 (예: 0.1 → 0)
  2. 프롬프트를 더 명확하게 작성
  3. maxTokens를 줄여서 응답 길이 제한
  4. 콘솔 로그 확인: "AI 원본 텍스트"
```

#### 5. 화면이 로드되지 않음
```
오류: Cannot GET / or 404 Not Found
해결 방법:
  1. public/index.html 파일 존재 여부 확인
  2. index.mjs가 express.static("public") 설정 여부 확인
  3. 서버 재시작
```

### 향후 개선 사항

- [ ] React 기반 프론트엔드 마이그레이션 (`maze-game/` 폴더)
- [ ] `.env` 파일 지원 (dotenv 추가)
- [ ] 게임 진행 상황 저장/로드 (로컬스토리지)
- [ ] 스코어보드 및 통계 (플레이 시간 기록)
- [ ] 멀티플레이어 지원 (WebSocket)
- [ ] 다국어 지원 확대 (영어, 스페인어 등)
- [ ] WebSocket을 통한 실시간 AI 피드백
- [ ] 게임 재시작 버튼 추가
- [ ] 사운드 효과 및 배경음악
- [ ] 모바일 반응형 개선

---

<a name="english-section"></a>

# English Section

## Project Overview

**Maze Pro: Combat Protocol** is an interactive game where players explore a maze and collect crystals with guidance from a local AI powered by LangChain and Ollama. The AI interprets natural language commands and suggests optimal paths to navigate the maze and escape.

## Tech Stack

| Layer | Technology | Description |
|-------|-----------|-------------|
| **AI Engine** | LangChain 1.2.x | AI integration and message management |
| **LLM Provider** | Ollama (llama3.2:3b) | Locally-run language model |
| **Backend** | Node.js (v18+) + Express.js 5.x | REST API server |
| **Frontend** | Vanilla JavaScript | Client UI and game logic |
| **Styling** | CSS3 | Layout and fine animations |
| **Middleware** | CORS, Morgan | Cross-origin and HTTP logging |
| **Optional Frontend** | React 19.x, Vite 7.x, TypeScript 5.9.x | Future migration planned |

## Features

- **AI-Powered Guide**: LangChain interprets player natural language commands and converts them into executable movement paths
- **Difficulty Levels**: 3 difficulty tiers (Easy, Medium, Hard) with adjustable maze size and crystal count
- **Real-time Maze Generation**: Iterative DFS (recursive backtracking) algorithm generates unique mazes each game
- **AI Reasoning Display**: Shows the AI's reasoning process in real-time
- **Timer & Statistics**: Displays elapsed time and crystal collection progress
- **Responsive UI**: Modern design with smooth animations

---

## User Guide

### Starting a Game

1. Open browser and navigate to `http://localhost:8000`
2. Select difficulty level (top left):
   - **Easy**: 11x11 maze, 3 crystals
   - **Medium**: 17x17 maze, 5 crystals
   - **Hard**: 25x25 maze, 10 crystals
3. Wait for system initialization (loading screen shown)

### How to Play

#### Command Input Method

Type natural language commands in the input field and press the EXECUTE button or Enter key.

**Command Examples:**
- `move right 3 steps`
- `collect crystal`
- `go up and left`
- `move down`
- `go forward`
- `move to the left 3 cells`
- `find the shortest path out of the maze`
- `go to the nearest crystal`
- `explore all directions`

The AI interprets the command and returns a JSON response:
```json
{
  "thought": "I will move 3 steps to the right from the current position",
  "moves": [
    { "direction": "right", "steps": 3 }
  ]
}
```

Each command is limited to 200 characters maximum.

#### Supported Directions

- `up`
- `down`
- `left`
- `right`

### Game Rules

| Rule | Description |
|------|------------|
| **Start Point** | (1, 1) - top-left of the maze |
| **Goal** | Collect all crystals (💎) then reach the exit (🏁) |
| **Obstacles** | Walls (#) cannot be passed through |
| **Crystals** | Automatically disappear when collected, counter increments |
| **Exit** | Locked (🔒) until all crystals collected, then opens (🏁) |
| **Location** | Exit positioned at (size-2, size-2) in bottom-right |
| **Command Limit** | Maximum 200 characters |

### Game Status Display

- **💎 Collection Progress**: Top right displays "collected crystals / total crystals"
- **⏱️ Timer**: Elapsed time since game start (in seconds)
- **Status Message** (header):
  - `Neural Link Established` (green) - AI ready
  - `AI Offline` (red) - AI communication error
  - `MISSION ACCOMPLISHED` (green) - Game cleared
  - `MISSION FAILED` (red) - Game over

### Game Screen Layout

```
┌─────────────────────────────────────────────────────┬──────────┐
│ Maze Pro EXPLORER      [Status Message]  [Difficulty]│ 💎 0/5   │
├─────────────────────────────────────────────────────┼──────────┤
│                                                     │ ⏱️ 0s    │
│              Game Board (Maze)                      │          │
│              # # # # # #                            │ Mission  │
│              #   P C   #                            │ Guide    │
│              # # # # # #                            │          │
│                                                     │ Neural   │
│                                                     │ Logic    │
│                                                     │ (AI)     │
│                                                     │          │
│                                                     │ Activity │
│                                                     │ Log      │
├─────────────────────────────────────────────────────┴──────────┤
│ [Input Field: "Enter tactical protocol..."]  [EXECUTE]          │
└──────────────────────────────────────────────────────────────┘
```

**Legend:**
- `#` = Wall
- ` ` = Path
- `P` = Player (blue circle)
- `💎` = Crystal
- `🏁` = Exit (open)
- `🔒` = Exit (locked)

### AI Guide Function

The AI performs the following:

1. **Maze Learning**: Learns the entire maze structure at game start
2. **Natural Language Interpretation**: Understands and processes player commands
3. **Path Calculation**: Suggests valid movement paths avoiding walls
4. **Reasoning Display**: Shows the rationale for each decision in real-time

### Difficulty Levels

| Difficulty | Maze Size | Crystals | Cells | Recommended |
|------------|-----------|----------|-------|-------------|
| **Easy** | 11×11 | 3 | 121 | Beginners |
| **Medium** | 17×17 | 5 | 289 | Recommended (default) |
| **Hard** | 25×25 | 10 | 625 | Experts |

### Victory Conditions

1. Collect all crystals (💎 count equals maximum)
2. Reach the exit (🏁)
3. `MISSION ACCOMPLISHED` message displayed

---

## Developer Guide

### Prerequisites

#### Node.js Environment
- **Node.js**: v18 or higher (ES Module and Top-level await support required)
- **npm**: v9 or higher or **yarn** v1.22 or higher

#### AI Infrastructure
- **Ollama**: Latest version (local installation)
- **llama3.2:3b Model**: Pre-downloaded in Ollama

Ollama Installation and Model Download:
```bash
# 1. Install Ollama (visit https://ollama.ai)

# 2. Download model
ollama pull llama3.2:3b

# 3. Start Ollama server
ollama serve
# Default port: http://localhost:11434
```

#### Ports & Network
- **Local Port 8000**: Backend server (configurable)
- **Local Port 11434**: Ollama server (default)
- **Internet**: For initial Ollama model download

### Installation Steps

#### Step 1: Clone or Download Repository
```bash
git clone <repository-url>
cd Langchain_Mazegame
```

#### Step 2: Install Backend Dependencies
```bash
npm install
```

Main packages installed:
- **LangChain**: `@langchain/core`, `@langchain/ollama`, `langchain`
- **Backend**: `express`, `cors`, `morgan`

#### Step 3: Environment Configuration (Optional)

Create a `.env` file in the project root. Currently hardcoded in `index.mjs`, but recommended to add support:

```bash
cat > .env << 'EOF'
# Backend Server Configuration
PORT=8000
NODE_ENV=development

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b

# LLM Parameters
LLM_TEMPERATURE=0
LLM_MAX_TOKENS=200
LLM_TOP_K=1
EOF
```

#### Step 4: Ensure Ollama is Running

In a separate terminal:
```bash
ollama serve
# Or run Ollama desktop app (Windows/macOS)
```

#### Step 5: Start Server
```bash
npm start
# Or
node index.mjs
```

Expected output:
```
Server running at: http://localhost:8000
```

#### Step 6: Access Client

Open browser and navigate to:
```
http://localhost:8000
```

### Environment Variables

Configuration currently hardcoded in `index.mjs`:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8000` | Backend server port |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server address |
| `OLLAMA_MODEL` | `llama3.2:3b` | LLM model to use |
| `LLM_TEMPERATURE` | `0` | AI response creativity (0 = deterministic) |
| `LLM_MAX_TOKENS` | `200` | Maximum response length |
| `LLM_TOP_K` | `1` | Token sampling strategy (1 = best only) |

To add `.env` support, add at top of `index.mjs`:
```javascript
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8000;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';
```

### npm Scripts

**`package.json` (root):**

Current configuration:
```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

Recommended addition:
```json
{
  "scripts": {
    "start": "node index.mjs",
    "dev": "node index.mjs",
    "dev:watch": "nodemon index.mjs"
  }
}
```

After installation:
```bash
npm start      # Start server
npm run dev    # Development mode
npm run dev:watch  # Auto-restart on file change (requires nodemon)
```

### Project Structure

```
Langchain_Mazegame/
├── index.mjs                 # Main backend server (Express + LangChain)
├── package.json              # Backend dependencies and scripts
├── .gitignore                # Git ignore configuration
├── README.md                 # This file
│
├── public/                   # Static files (frontend)
│   ├── index.html            # Game UI (HTML container)
│   ├── game.js               # Game logic and AI communication (8KB)
│   └── style.css             # UI styling (5KB)
│
├── maze-game/                # React project (for future migration)
│   ├── package.json
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── eslint.config.js
│   └── src/
│       ├── index.css
│       └── App.css
│
└── .git/                     # Git repository
```

**File Sizes and Roles:**

| File | Size | Role |
|------|------|------|
| `index.mjs` | 3KB | Express server, LangChain integration, API endpoints |
| `public/game.js` | 8KB | Game core logic, maze generation, UI management |
| `public/style.css` | 5KB | Responsive UI, animations, theming |
| `public/index.html` | 2KB | HTML structure, render container |

### AI Integration Flow

#### Complete Workflow

```
[Game Start] 
    ↓
[1. /api/v1/maze/init] ← Send maze map
    ↓
[Initialize mapMemory] ← Store map in System Message
    ↓
[Player Issues Command]
    ↓
[2. /api/v1/maze] ← Send current state + command
    ↓
[LangChain Invoke] ← (System Message + new Human Message)
    ↓
[Ollama (llama3.2:3b)] ← AI model response
    ↓
[AI Response (JSON)] ← { "thought": "...", "moves": [...] }
    ↓
[parseAIResponse()] ← Parse and validate JSON
    ↓
[Client Execution] ← processMove() handle movements and render
```

#### 1. Initialization API: `/api/v1/maze/init`

**Purpose**: Teach AI the maze structure at game start

**Request:**
```json
{
  "method": "POST",
  "url": "/api/v1/maze/init",
  "headers": { "Content-Type": "application/json" },
  "body": {
    "map": [
      ["#", "#", "#", "#", "#"],
      ["#", " ", "C", " ", "#"],
      ["#", " ", "#", " ", "#"],
      ["#", " ", " ", " ", "#"],
      ["#", "#", "#", "E", "#"]
    ]
  }
}
```

**Response:**
```json
{
  "message": "Map memory initialized"
}
```

**Backend Processing (`index.mjs`):**
```javascript
app.post("/api/v1/maze/init", async (req, res) => {
  const { map } = req.body;
  
  // Convert 2D array to string
  const mapStr = map.map(row => row.join("")).join("\n");
  
  // Store System Message in mapMemory
  mapMemory = [
    new SystemMessage(`You are a guide helping the player explore a maze.
The map is as follows. (#: wall, space: path, E: exit, C: crystal)
${mapStr}
Remember this map perfectly and guide the player to the shortest path
to collect all crystals and reach the exit. Never create paths that
pass through walls.`)
  ];
  
  return res.status(200).json({ message: "Map memory initialized" });
});
```

#### 2. Command Execution API: `/api/v1/maze`

**Purpose**: AI interprets player command and returns movement path

**Request:**
```json
{
  "method": "POST",
  "url": "/api/v1/maze",
  "headers": { "Content-Type": "application/json" },
  "body": {
    "command": "move right 3 steps",
    "state": {
      "player": { "x": 1, "y": 1 },
      "crystals": [
        { "x": 2, "y": 1 },
        { "x": 3, "y": 3 }
      ],
      "size": 5
    }
  }
}
```

**Response:**
```json
{
  "thought": "From current position (1,1), I will move 3 steps to the right.",
  "moves": [
    { "direction": "right", "steps": 3 }
  ]
}
```

**AI Prompt:**
```
Current position: (1, 1)
Exit position: (3, 3)
Command: "move right 3 steps"

Respond with a very short, clear thought and the actual movement path
ONLY in JSON format. Quick response is critical.
Must respond in this format:
{"thought": "", "moves": [{"direction": "", "steps": }]}
```

**Backend Processing:**
```javascript
app.post("/api/v1/maze", async (req, res) => {
  const { command, state } = req.body;
  
  // Generate prompt
  const prompt = `Current position: (${state.player.x}, ${state.player.y})
Exit position: (${state.size-2}, ${state.size-2})
Command: "${command}"

Respond with a very short, clear thought and the actual movement path
ONLY in JSON format. Quick response is critical.
Must respond in this format:
{"thought": "", "moves": [{"direction": "", "steps": }]}`;

  // mapMemory + new command
  const context = [...mapMemory, new HumanMessage(prompt)];
  
  // LangChain Invoke
  const response = await llm.invoke(context);
  
  // Parse JSON
  const result = parseAIResponse(response.content);
  
  return res.json(result);
});
```

#### 3. LangChain Configuration (`index.mjs`)

```javascript
import { initChatModel } from "langchain";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Initialize LLM
const llm = await initChatModel("llama3.2:3b", {
  modelProvider: "ollama",
  baseUrl: "http://localhost:11434",
  temperature: 0,        // Deterministic responses (no creativity)
  maxTokens: 200,        // Quick responses
  modelOptions: { 
    top_k: 1             // Select only highest probability token
  }
});
```

**Parameter Explanations:**
- `temperature: 0` - AI always responds consistently (determinism first)
- `maxTokens: 200` - Response length limit for faster processing
- `top_k: 1` - Only sample highest probability token (stability)

#### 4. AI Response Parsing (`index.mjs`)

```javascript
const parseAIResponse = (text) => {
  let thought = "Unable to read thoughts.";
  let moves = [];

  console.log("AI raw text:", text);

  try {
    // Extract JSON portion
    const cleanText = text.replace(/json/g, "").replace(/ /g, "").trim();
    const jsonMatch = cleanText.match(/{[\s\S]*}/);

    if (jsonMatch) {
      // Parse JSON
      const parsed = JSON.parse(jsonMatch[0]);
      thought = parsed.thought || thought;
      moves = parsed.moves || [];
    }
  } catch (e) {
    console.error("JSON parsing error:", e.message);
  }
  
  return { thought, moves };
};
```

**Parsing Logic:**
1. Extract JSON portion from AI response
2. Remove spaces and match `{...}` pattern
3. If parse succeeds, extract `thought` and `moves`
4. If parse fails, return default values

### Difficulty Configuration (`DIFFICULTY_CONFIG`)

Defined in `public/game.js`:

```javascript
const DIFFICULTY_CONFIG = {
  easy: {
    size: 11,        // 11x11 grid
    crystals: 3      // 3 crystals
  },
  medium: {
    size: 17,        // 17x17 grid
    crystals: 5      // 5 crystals
  },
  hard: {
    size: 25,        // 25x25 grid
    crystals: 10     // 10 crystals
  }
};
```

**Difficulty Characteristics:**

| Difficulty | Size | Crystals | Cells | Wall Ratio | Complexity |
|------------|------|----------|-------|-----------|-----------|
| Easy | 11x11 | 3 | 121 | ~50% | Low |
| Medium | 17x17 | 5 | 289 | ~50% | Medium |
| Hard | 25x25 | 10 | 625 | ~50% | High |

**Add New Difficulty (e.g., Insane):**

1. Add configuration to `public/game.js`:
```javascript
DIFFICULTY_CONFIG.insane = {
  size: 33,
  crystals: 20
};
```

2. Add button to `public/index.html`:
```html
<button onclick="Game.start('insane')" id="btn-insane" class="diff-btn">Insane</button>
```

### Maze Generation Algorithm

**Iterative DFS (Recursive Backtracking)**

```javascript
generateMaze(size) {
  // 1. Initialize entire grid with walls ('#')
  const grid = Array.from({length: size}, () => Array(size).fill('#'));
  
  // 2. DFS exploration function
  const walk = (x, y) => {
    // Mark current cell as path
    grid[y][x] = ' ';
    
    // Shuffle neighbor directions (maintain 2-cell spacing)
    const dirs = [[0,-2],[0,2],[-2,0],[2,0]].sort(() => Math.random() - 0.5);
    
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      
      // Visit valid, unvisited cells
      if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1 && grid[ny][nx] === '#') {
        // Carve passage between current and next cell
        grid[y + dy / 2][x + dx / 2] = ' ';
        walk(nx, ny);  // Recursive call
      }
    }
  };
  
  walk(1, 1);  // Start from (1,1)
  grid[size - 2][size - 2] = 'E';  // Mark exit
  return grid;
}
```

**Algorithm Characteristics:**

| Characteristic | Description |
|---|---|
| **Type** | Randomized Depth-First Search |
| **Start Point** | (1, 1) |
| **End Point** | (size-2, size-2) |
| **Time Complexity** | O(n²) |
| **Space Complexity** | O(n²) |
| **Property** | Perfect maze (no loops, all cells connected) |
| **Diversity** | Different maze each game (random direction selection) |

### Game Logic Details

#### Player Movement Processing (`processMove`)

```javascript
async processMove({ direction, steps = 1 }) {
  // Repeat for each step (continuous movement)
  for (let i = 0; i < steps; i++) {
    // 1. Calculate next position based on direction
    let nx = this.player.x, ny = this.player.y;
    if (direction === 'up') ny--;
    else if (direction === 'down') ny++;
    else if (direction === 'left') nx--;
    else if (direction === 'right') nx++;

    // 2. Check boundaries and walls
    if (ny >= 0 && ny < this.maze.length && 
        nx >= 0 && nx < this.maze[0].length && 
        this.maze[ny][nx] !== '#') {
      
      // 3. Valid move - update position
      this.player = {x: nx, y: ny};
      
      // 4. Check for crystal collection
      if (this.maze[ny][nx] === 'C') {
        this.maze[ny][nx] = ' ';  // Remove crystal
        this.collected++;
      }
      
      // 5. Render UI
      UI.render();
      
      // 6. Animation delay (80ms = smooth visuals)
      await new Promise(r => setTimeout(r, 80));
      
      // 7. Check victory condition (exit + all crystals)
      if (this.maze[ny][nx] === 'E' && this.collected >= this.crystals.length) {
        this.victory();
        return;
      }
    } else {
      // Hit wall or boundary - stop movement
      break;
    }
  }
}
```

**Flow:**
1. Move one cell per step
2. Validate (boundaries, walls)
3. Auto-collect crystals
4. 80ms delay for animation
5. Check victory after each move

#### Crystal Placement (`placeItems`)

```javascript
placeItems(symbol, count, minDist = 0) {
  const items = [];
  
  // Repeat until count items placed
  while (items.length < count) {
    // Select random position
    const rx = Math.floor(Math.random() * this.maze.length);
    const ry = Math.floor(Math.random() * this.maze.length);
    
    // Calculate Manhattan distance from start
    const dist = Math.abs(rx - 1) + Math.abs(ry - 1);
    
    // Place if valid position
    if (this.maze[ry][rx] === ' ' && dist > minDist) {
      if (symbol) this.maze[ry][rx] = symbol;
      items.push({x: rx, y: ry});
    }
  }
  
  return items;
}
```

**Placement Conditions:**
- Only on paths (exclude walls)
- Distance check from start (extensible later)
- Record placement positions in items array

### Troubleshooting

#### 1. Ollama Connection Failed
```
Error: Error: ECONNREFUSED 127.0.0.1:11434
Solution Steps:
  1. Verify Ollama daemon: ollama serve
  2. On Windows/macOS: Run Ollama desktop app
  3. Check port availability: lsof -i :11434
```

#### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::8000
Solution Steps:
  1. Find process: lsof -i :8000
  2. Kill process: kill -9 <PID>
  3. Or change PORT in index.mjs
```

#### 3. Model Not Downloaded
```
Error: Model 'llama3.2:3b' not found
Solution:
  ollama pull llama3.2:3b
  # Or try alternative models:
  ollama pull llama2
  ollama pull mistral
```

#### 4. AI Response Not JSON
```
Error: JSON parse failure → "Unable to read thoughts."
Cause: AI ignores JSON format and responds differently
Solution Steps:
  1. Lower temperature: 0.1 → 0
  2. Make prompt more explicit
  3. Reduce maxTokens further
  4. Check console: "AI raw text"
```

#### 5. Page Won't Load
```
Error: Cannot GET / or 404 Not Found
Solution Steps:
  1. Verify public/index.html exists
  2. Check index.mjs has express.static("public")
  3. Restart server
```

### Future Improvements

- [ ] React frontend migration (`maze-game/` folder)
- [ ] Add `.env` file support (dotenv package)
- [ ] Game save/load functionality (localStorage)
- [ ] Leaderboard and statistics (playtime records)
- [ ] Multiplayer support (WebSocket)
- [ ] Expanded language support (Spanish, etc.)
- [ ] Real-time AI feedback via WebSocket
- [ ] Game restart button
- [ ] Sound effects and background music
- [ ] Mobile responsive improvements

---

**Last Updated**: April 1, 2026
**Version**: 1.0.0
**License**: ISC
