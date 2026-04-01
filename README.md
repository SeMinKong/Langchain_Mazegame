# Maze Pro: AI 기반 미로 탐색 게임

**[English Version](./README.en.md)**

**LangChain**과 **Ollama**를 활용하여 로컬 AI와 함께 미로를 탐험하는 인터랙티브 게임, **Maze Pro**입니다. 단순히 키보드로 조작하는 기존 미로 게임과 달리, 플레이어의 자연어 명령을 AI가 해석하여 최적의 경로를 제안하는 사용자 경험을 제공합니다.

**Demo**

<video src="https://github.com/user-attachments/assets/026a9755-f771-4a47-ba00-288c7d07dcc4" width="600" controls></video>

## 주요 특징

- **AI 기반 내비게이션**: **LangChain**을 통해 사용자의 자연어 명령을 해석하고, 실행 가능한 이동 로직으로 변환합니다.
- **로컬 LLM 연동**: **Ollama**를 통해 **llama3.2:3b** 모델을 로컬에서 실행하여 개인정보 보호와 저지연 응답을 확보했습니다.
- **동적 미로 생성**: 재귀적 백트래킹(Recursive Backtracking) 알고리즘을 사용하여 매번 새로운 미로를 생성합니다.
- **실시간 AI 사고 과정 시각화**: AI가 경로를 계산하는 "Neural Logic"을 실시간으로 보여주어 몰입감을 높였습니다.
- **웹 인터페이스**: 다크 테마 기반의 반응형 디자인(Vanilla JS, CSS3)으로 구현했습니다.

## 기술 스택

- **AI 엔진**: LangChain, Ollama (llama3.2:3b)
- **백엔드**: Node.js, Express.js
- **프론트엔드**: Vanilla JavaScript, CSS3
- **향후 계획**: React 19 및 TypeScript로의 마이그레이션 예정

## 프로젝트 구조

```text
├── index.mjs        # LangChain 연동을 포함한 백엔드 서버
├── public/          # 프론트엔드 정적 파일
│   ├── game.js      # 게임 코어 로직 및 AI 통신
│   ├── style.css    # UI 디자인 및 애니메이션
│   └── index.html   # 게임 컨테이너
└── maze-game/       # (진행 중) React 마이그레이션 프로젝트
```

## 핵심 기술 구현 내용

### 1. 지능형 명령 해석(Prompt Engineering)
미로의 전체 구조를 LLM의 시스템 메시지에 학습시키는 전략을 선택했습니다. 이를 통해 AI가 벽과 길의 제약 조건을 완벽히 이해하고, 유효한 JSON 형식의 이동 경로를 안정적으로 반환하도록 설계했습니다.

### 2. 재귀적 백트래킹 알고리즘
모든 미로가 반드시 해결 가능하면서도 순환이 없는 '완벽한 미로'를 만들기 위해 DFS 기반의 알고리즘을 구현했습니다. 이는 매 세션마다 플레이어에게 새로운 도전 과제를 제공합니다.

## 빠른 시작

### 사전 요구사항
- Node.js (v18 이상)
- [Ollama](https://ollama.ai/) 설치 및 실행 (`ollama pull llama3.2:3b`)

### 설치 및 실행
```bash
git clone <repository-url>
cd Langchain_Mazegame
npm install
node index.mjs
```
`http://localhost:8000`에서 게임을 시작할 수 있습니다.

## 게임 방법
- **난이도 선택**: Easy, Medium, Hard 중 선택합니다.
- **명령어 입력**: "오른쪽으로 3칸 가줘" 또는 "가장 가까운 크리스탈을 찾아줘"와 같이 입력합니다.
- **목표**: 모든 크리스탈()을 수집하고 출구()에 도달하세요.

>  **더 자세한 정보가 필요하신가요?**
> 상세한 API 통신 규격, DFS 미로 생성 알고리즘 원리 및 프롬프트 파라미터는 [상세 매뉴얼(DETAILS.md)](./DETAILS.md)에서 확인하실 수 있습니다.

---
LangChain & Local AI로 구축한 프로젝트입니다.
