let gameState = {
  
  timeStart: 0,
  timeEnd: 0,
  // double player mode
  cardCount: 16,
  currTurn: "p1",
  p2mode: {
    p1: {
      score: 0,
      moves: 0,
      streak: 0,
      maxStreak: 0,
      theme: "#FFB8B8"
    },
    p2: {
      score: 0,
      moves: 0,
      streak: 0,
      maxStreak: 0,
      theme: "#BBB8FF"
    }
  },
  
  // single player mode
  p1mode: {
    p1: {
      score: 0,
      moves: 0,
      streak: 0
    }
  }
  
  // any other if possible
};

let mode = "p2mode";

let p1modeSelector = document.querySelectorAll('[data-mode="p1mode"], [data-mode="p2mode"]');
let startBtn = document.querySelector('.startBtn');

let loader = document.querySelector('.loader');

p1modeSelector.forEach(div => {
  div.onclick = () => {
    mode = div.dataset.mode;
    
    p1modeSelector.forEach(box => {
      box.classList.remove('selected');
    });
    
    div.classList.add('selected');
    modeUIupdate();
  }
});

let startingUI = document.querySelector('.startingUI');

function startGame() {
  
  if (mode == "p2mode") {
    bg.style.backgroundColor = "#FFB8B8";
  }
  
  gameState.timeStart = Date.now();
  
  setTimeout(() => {
    startingUI.style.opacity = "0";
    
    setTimeout(() => {
      startingUI.style.display = "none";
    }, 800);
  }, 600);
}

let mode_2p_ui = document.querySelector('.p2ModeDiv');

function modeUIupdate() {
  if (mode === "p1mode") {
    mode_2p_ui.style.display = "none";
  } else { // mode === "p1mode"
    mode_2p_ui.style.display = "flex";
  }
}

startBtn.addEventListener('click', startGame);

let bg = document.querySelector('.bg');

function switchTurn() {
  // gameState.currTurn = gameState.currTurn === "p1" ? "p2" : "p1";
  if (gameState.currTurn === "p1") {
    gameState.currTurn = "p2";
    bg.style.backgroundColor = gameState[mode]["p2"].theme;
  } else {
    gameState.currTurn = "p1";
    bg.style.backgroundColor = gameState[mode]["p1"].theme;
  }
}

function reset() {
  // two player reset
  gameState.p2mode.p1.score = 0;
  gameState.p2mode.p1.moves = 0;
  gameState.p2mode.p1.streak = 0;
  
  gameState.p2mode.p2.score = 0;
  gameState.p2mode.p2.moves = 0;
  gameState.p2mode.p2.streak = 0;
  
  // one player reset
  gameState.p1mode.p1.score = 0;
  gameState.p1mode.p1.moves = 0;
  gameState.p1mode.p1.streak = 0;
  
  updateUI();
  shuffle(cardData);
  
  mode = "p2mode";
  gameState.currTurn = "p1";
  gameState.timeStart = 0;
  gameState.timeEnd = 0;
  
  startingUI.style.opacity = "1";
  startingUI.style.display = "flex";
  
  checking = false;
  card1 = null;
  card2 = null;
  
  allCards.forEach(card => {
    card.classList.remove('flipped');
  });
  
  p1modeSelector.forEach(div => {
    div.classList.remove('selected');
  });
  
  p1modeSelector[0].classList.add('selected');
  
  popupBg.style.display = "none";
  popUp.innerHTML = '';
  
  bg.style.backgroundColor = "#C4D1FF";
}

/* >===× RENDERING ×===< */

let cardHolder = document.querySelectorAll('.cardHolder');

cardHolder.forEach((div, idx) => {
  div.innerHTML = `
    <div class="card">
      <div class="front">?</div>
      
      <div class="back"></div>
    </div>
  `
});

/* >===× ASSIGNMENT ×===< */
const cardData = [
  { pairId: 1, value: "🍎" },
  { pairId: 1, value: "🍎" },
  
  { pairId: 2, value: "🍌" },
  { pairId: 2, value: "🍌" },
  
  { pairId: 3, value: "🍉" },
  { pairId: 3, value: "🍉" },
  
  { pairId: 4, value: "🍇" },
  { pairId: 4, value: "🍇" },
  
  { pairId: 5, value: "🍊" },
  { pairId: 5, value: "🍊" },
  
  { pairId: 6, value: "🥭" },
  { pairId: 6, value: "🥭" },
  
  { pairId: 7, value: "🍏" },
  { pairId: 7, value: "🍏" },
  
  { pairId: 8, value: "🥝" },
  { pairId: 8, value: "🥝" }
];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    // random position generator
    let j = Math.floor(Math.random() * (i + 1));
    
    // swap
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

shuffle(cardData);

// selected cards
let checking = false;
let card1 = null;
let card2 = null;

// Assigining
let allCards = document.querySelectorAll('.card');

function assignCards() {
  allCards.forEach((card, idx) => {
    card.data = cardData[idx];
    card.querySelector('.back').textContent = card.data.value;
  });
  
  allCards.forEach(card => {
    card.addEventListener('click', () => {
      
      if (checking) return;
      if (card === card1) return;
      if (card.classList.contains('flipped')) return;
      
      card.classList.add('flipped');
      
      if (card1 == null) {
        card1 = card;
        return;
      }
      
      card2 = card;
      
      checking = true;
      
      match();
      
    });
  });
}

assignCards();

function match() {
  if (checker()) { // true
    handleMatch();
  } else { // false;
    handleMisMatch();
  }
}

function checker() {
  
  let check =
    card1.data.pairId ===
    card2.data.pairId;
  
  return check;
}

function handleMatch() {
  
  console.log("MATCHED");
  
  setTimeout(() => {
    card1 = null;
    card2 = null;
    checking = false;
  }, 100);
  
  gameState[mode][gameState.currTurn].score++;
  gameState[mode][gameState.currTurn].moves++;
  gameState[mode][gameState.currTurn].streak++;
  
  updateUI();
  
  gameState.cardCount -= 2;
  checkEnd();
}

function handleMisMatch() {
  
  console.log("NOT MATCHED");
  
  gameState[mode][gameState.currTurn].moves++;
  
  gameState[mode][gameState.currTurn].maxStreak =
    Math.max(
      gameState[mode][gameState.currTurn].streak,
      gameState[mode][gameState.currTurn].maxStreak
    );
  
  gameState[mode][gameState.currTurn].streak = 0;
  
  
  setTimeout(() => {
    
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    
    setTimeout(() => {
      card1 = null;
      card2 = null;
      checking = false;
      
    }, 100);
    
  }, 1000);
  
  updateUI();
  
  // 2 player mode
  if (mode === "p2mode") {
    switchTurn();
  }
}

// one player Mode
let p1Score = document.querySelector('.p1score');
let p1Moves = document.querySelector('.p1moves');
let p1Streak = document.querySelector('.p1streak');

// two player Mode
let p2mode_p1moves = document.querySelector('.p1_2pmoves');
let p2mode_p1score = document.querySelector('.p1_2pscore');

let p2mode_p2moves = document.querySelector('.p2_2pmoves');
let p2mode_p2score = document.querySelector('.p2_2pscore');

function updateUI() {
  if (mode === "p2mode") {
    
    if (gameState.currTurn === "p1") {
      
      p2mode_p1moves.textContent = gameState[mode][gameState.currTurn].moves;
      p2mode_p1score.textContent = gameState[mode][gameState.currTurn].score;
      
    } else { // gameState.currTurn === "p2"
      
      p2mode_p2moves.textContent = gameState[mode][gameState.currTurn].moves;
      p2mode_p2score.textContent = gameState[mode][gameState.currTurn].score;
      
    }
    
    return;
  }
  
  let score = String(gameState[mode][gameState.currTurn].score).padStart(2, '0');
  let moves = String(gameState[mode][gameState.currTurn].moves).padStart(2, '0');
  let streak = String(gameState[mode][gameState.currTurn].streak).padStart(2, '0');
  
  p1Score.textContent = score;
  p1Moves.textContent = moves;
  p1Streak.textContent = streak;
}

function checkEnd() {
  
  gameState[mode][gameState.currTurn].maxStreak =
    Math.max(
      gameState[mode][gameState.currTurn].streak,
      gameState[mode][gameState.currTurn].maxStreak
    );
  
  if (gameState.cardCount <= 0) {
    setTimeout(() => {
      renderPopup();
    }, 800);
  }
}

let popupBg = document.querySelector('.popupBg');
let popUp = document.querySelector('.popUp');

function renderPopup() {
  
  popupBg.style.display = "block";
  
  let timeTaken = getTimeTaken();
  
  if (mode === "p1mode") {
    
    let moves = gameState[mode][gameState.currTurn].moves;
    let score = gameState[mode][gameState.currTurn].score;
    let streak = gameState[mode][gameState.currTurn].streak;
    
    popUp.innerHTML = `
      <h2>Game Finished</h2>
      
      <div class="gameMode">
        <span>Game Mode:</span>
        <span class="selectedMode">Single Player</span>
      </div>
      
      <div class="cup">
        <span>🏆</span>
      </div>
      
      <div class="popUpscoreDiv">Moves: ${moves}</div>
      <div class="popUpmovesDiv">Score: ${score}</div>
      <div class="popUpstreakDiv">Streak: ${streak}</div>
      
      <div class="timeDiv">
        <div>Time Taken</div>
        <div class="time">${timeTaken}</div>
      </div>
  
      <button class="playAgainBtn" type="submit">Play Again</button>
    `
    
  } else { // mode === "p2mode"
    
    let p1sc = gameState[mode]["p1"].score;
    let p1mv = gameState[mode]["p1"].moves;
    let p1st = gameState[mode]["p1"].maxStreak;
    
    let p2sc = gameState[mode]["p2"].score;
    let p2mv = gameState[mode]["p2"].moves;
    let p2st = gameState[mode]["p2"].maxStreak;
    
    let winner = getWinner();
    
    popUp.innerHTML = `
      <h2>Game Finished</h2>
      
      <div class="gameMode">
        <span>Game Mode:</span>
        <span class="selectedMode">Multiplayer</span>
      </div>
      
      <!-- TWO PLAYER UI -->
      <div class="statusGrid">
        
        <!-- PLAYER 1 STATS -->
        <div class="p1stat">
          <div>Player - 1</div>
          <div>Moves: <span>${p1mv}</span></div>
          <div>Score: <span>${p1sc}</span></div>
          <div>Streak: <span>${p1st}</span></div>
        </div>
        
        <!-- PLAYER 2 STATS -->
        <div class="p2stat">
          <div>Player - 2</div>
          <div>Moves: <span>${p2mv}</span></div>
          <div>Score: <span>${p2sc}</span></div>
          <div>Streak: <span>${p2st}</span></div>
        </div>
        
      </div>
      
      <div class="mode2p_winner">
        Winner 🏆: ${winner}
      </div>
      
      <div class="timeDiv">
        <div>Time Taken</div>
        <div class="time">${timeTaken}</div>
      </div>
      
      <button class="playAgainBtn" type="submit">Play Again</button>
    `
  }
  
  popUp.querySelector('.playAgainBtn').addEventListener('click', () => {
    loader.style.display = "block";
    setTimeout(() => {
      reload();
    }, 100);
  });
}

function getTimeTaken() {
  gameState.timeEnd = Date.now();
  
  let totalTimeDiff = gameState.timeEnd - gameState.timeStart;
  
  let min = Math.floor(totalTimeDiff / (60 * 1000));
  let sec = Math.floor((totalTimeDiff % (60 * 1000)) / 1000);
  let milSec = totalTimeDiff % 1000;
  
  let minStr = String(min).padStart(2, "0");
  let secStr = String(sec).padStart(2, "0");
  let milSecStr = String(milSec).padStart(2, "0");
  
  let time = `${minStr}:${secStr}:${milSecStr}`;
  
  return time;
  
  /* 
  Explanation:
  
  diff = mill seconds 
  
  1 sec = 1000 milsec
  1 min = 60 seconds
  
  1 sec = diff * 1000
  1 min = diff * 1000 * 60
  
  /* Calculation rule: 
  Divide the total milliseconds
  by the size of a larger 
  time unit to get complete units, 
  and use the remainder (%) 
  to remove those complete units and
  calculate the next smaller unit. 
  */
}

function getWinner() {
  if (gameState[mode]["p1"].score >
    gameState[mode]["p2"].score) {
    
    return "Player 1";
    
  } else if (gameState[mode]["p1"].score <
    gameState[mode]["p2"].score) {
    
    return "Player 2";
    
  } else {
    
    return "Draw";
  }
}

function reload() {
  loader.style.opacity = "1";
  
  setTimeout(() => {
    reset();
    
    setTimeout(() => {
      loader.style.display = "none";
    }, 2000);
  }, 500);
}