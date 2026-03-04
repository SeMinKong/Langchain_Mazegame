/**
 * Game Core Logic
 */
const Game = {
  maze: [],
  player: { x: 1, y: 1 },
  crystals: [],
  collected: 0,
  isActive: false,
  startTime: 0,
  timerInterval: null,
  abortController: null,

  async start(diff) {
    this.stop();
    UI.showLoading();
    
    const size = diff === 'easy' ? 11 : diff === 'medium' ? 17 : 25;
    this.maze = this.generateMaze(size);
    this.player = { x: 1, y: 1 };
    this.collected = 0;
    
    const cCount = diff === 'easy' ? 3 : diff === 'medium' ? 5 : 10;
    this.crystals = this.placeItems('C', cCount);
    
    this.isActive = true;
    this.startTime = Date.now();

    // Inform AI about the new map
    try {
      await fetch('/api/v1/maze/init', { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({map: this.maze}) 
      });
      UI.setStatus("Neural Link Established", "var(--success)");
    } catch (e) {
      UI.setStatus("AI Offline", "var(--enemy)");
    }

    UI.hideLoading();
    UI.updateDifficultyButtons(diff);
    
    this.timerInterval = setInterval(() => {
      UI.updateTimer(Math.floor((Date.now() - this.startTime) / 1000));
    }, 1000);

    UI.render();
  },

  stop() {
    this.isActive = false;
    clearInterval(this.timerInterval);
    if (this.abortController) this.abortController.abort();
  },

  generateMaze(size) {
    const grid = Array.from({length: size}, () => Array(size).fill('#'));
    const walk = (x, y) => {
      grid[y][x] = ' ';
      const dirs = [[0,-2],[0,2],[-2,0],[2,0]].sort(() => Math.random() - 0.5);
      for (const [dx, dy] of dirs) {
        const nx = x + dx, ny = y + dy;
        if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1 && grid[ny][nx] === '#') {
          grid[y + dy / 2][x + dx / 2] = ' ';
          walk(nx, ny);
        }
      }
    };
    walk(1, 1);
    grid[size - 2][size - 2] = 'E';
    return grid;
  },

  placeItems(symbol, count, minDist = 0) {
    const items = [];
    while (items.length < count) {
      const rx = Math.floor(Math.random() * this.maze.length);
      const ry = Math.floor(Math.random() * this.maze.length);
      const dist = Math.abs(rx - 1) + Math.abs(ry - 1);
      if (this.maze[ry][rx] === ' ' && dist > minDist) {
        if (symbol) this.maze[ry][rx] = symbol;
        items.push({x: rx, y: ry});
      }
    }
    return items;
  },

  async handleCommand() {
    const input = document.getElementById('command');
    const cmd = input.value.trim();
    if (!cmd || !this.isActive) return;

    UI.setBtnDisabled(true);
    this.abortController = new AbortController();
    
    const state = { 
      player: this.player, 
      crystals: this.crystals.filter(c => this.maze[c.y][c.x] === 'C'), 
      size: this.maze.length 
    };

    try {
      const res = await fetch('/api/v1/maze', { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({command: cmd, state}),
        signal: this.abortController.signal 
      });
      const data = await res.json();
      
      if (data.thought) UI.logThoughts(data.thought);
      
      const moves = data.moves || [];
      if (moves.length > 0) {
        UI.addHistory(cmd);
        for (const m of moves) {
          if (!this.isActive) break;
          await this.processMove(m);
        }
      }
    } catch (e) {
      console.error("Neural Error:", e);
    } finally {
      this.abortController = null;
      UI.setBtnDisabled(false);
      input.value = '';
      input.focus();
    }
  },

  async processMove({ direction, steps = 1 }) {
    if (!direction) return;
    for (let i = 0; i < steps; i++) {
      let nx = this.player.x, ny = this.player.y;
      if (direction === 'up') ny--;
      else if (direction === 'down') ny++;
      else if (direction === 'left') nx--;
      else if (direction === 'right') nx++;

      if (ny >= 0 && ny < this.maze.length && nx >= 0 && nx < this.maze[0].length && this.maze[ny][nx] !== '#') {
        this.player = {x: nx, y: ny};
        if (this.maze[ny][nx] === 'C') {
          this.maze[ny][nx] = ' ';
          this.collected++;
        }
        UI.render();
        await new Promise(r => setTimeout(r, 80));
        
        if (this.maze[ny][nx] === 'E' && this.collected >= this.crystals.length) {
          this.victory();
          return;
        }
      } else break;
    }
  },

  gameOver() { this.stop(); UI.setStatus("MISSION FAILED", "var(--enemy)"); UI.render(); },
  victory() { this.stop(); UI.setStatus("MISSION ACCOMPLISHED", "var(--success)"); UI.render(); }
};

/**
 * UI Management
 */
const UI = {
  container: document.getElementById('game-container'),
  
  render() {
    this.container.innerHTML = '';
    this.container.style.gridTemplateColumns = `repeat(${Game.maze.length}, 26px)`;
    
    Game.maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        const div = document.createElement('div');
        div.className = 'cell';
        if (cell === '#') div.classList.add('wall');
        else {
          div.classList.add('path');
          if (cell === 'E') {
            const locked = Game.collected < Game.crystals.length;
            div.classList.add('exit', locked ? 'locked' : '');
            div.textContent = locked ? '🔒' : '🏁';
          } else if (cell === 'C') {
            div.classList.add('item');
            div.textContent = '💎';
          }
        }
        if (Game.player.x === x && Game.player.y === y) div.classList.add('player');
        this.container.appendChild(div);
      });
    });
    this.updateStats();
  },

  updateStats() {
    document.getElementById('crystal-count').textContent = `${Game.collected}/${Game.crystals.length}`;
  },

  updateTimer(s) { document.getElementById('timer').textContent = s + 's'; },
  
  setStatus(msg, color) {
    const el = document.getElementById('status-msg');
    el.textContent = msg;
    el.style.color = color || 'var(--secondary-text)';
  },

  logThoughts(thoughts) {
    const box = document.getElementById('thought-process');
    const thoughtsArray = Array.isArray(thoughts) ? thoughts : [thoughts];
    
    box.innerHTML = thoughtsArray.map(t => `<div style="margin-bottom:6px; border-left:2px solid var(--accent); padding-left:8px;">${t}</div>`).join('');
    box.scrollTop = box.scrollHeight;
  },

  addHistory(cmd) {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.textContent = `> ${cmd}`;
    document.getElementById('history').prepend(item);
  },

  showLoading() { document.getElementById('loading-overlay').style.display = 'flex'; },
  hideLoading() { document.getElementById('loading-overlay').style.display = 'none'; },
  
  updateDifficultyButtons(diff) {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.toggle('active', b.id === `btn-${diff}`));
  },

  setBtnDisabled(bool) { document.getElementById('send-btn').disabled = bool; }
};

// Event Listeners
document.getElementById('send-btn').addEventListener('click', () => Game.handleCommand());
document.getElementById('command').addEventListener('keypress', (e) => { if(e.key === 'Enter') Game.handleCommand(); });

// Initial Start
Game.start('medium');
