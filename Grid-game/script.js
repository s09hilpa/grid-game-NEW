const gameBoard = document.getElementById("game-board");
const displayClick = document.getElementById("clickcount");
const displayTimer = document.getElementById("timer");
const startBtn = document.getElementById("start-button");
const popUp = document.getElementById("pop-up");
const playAgainBtn = document.getElementById("play-again-button");
const finalTime = document.getElementById("final-time");
const finalClicks = document.getElementById("final-clicks");

let openedCards = [];
let clicks = 0;
let seconds = 0;
let timer = null;
let lock = false;
let matchedPairs = 0;
let cardList = [];

// //cards
// const cardList = [
//   { name: "snow", emoji: "❄️" },
//   { name: "snow", emoji: "❄️" },
//   { name: "fire", emoji: "🔥" },
//   { name: "fire", emoji: "🔥" },
//   { name: "tree", emoji: "🌲" },
//   { name: "tree", emoji: "🌲" },
//   { name: "water", emoji: "🌊" },
//   { name: "water", emoji: "🌊" },
//   { name: "rainbow", emoji: "🌈" },
// ];

//start game
startBtn.addEventListener("click", startGame);

//play again
playAgainBtn.addEventListener("click", function () {
  popUp.style.display = "none";
  startGame();
});

async function startGame() {
  resetGame();
  await fetchCards();
  shuffleCards();
  createCards();
}

//reset game when press start button

function resetGame() {
  clearInterval(timer); //stop timer

  seconds = 0;
  clicks = 0;
  openedCards = [];
  lock = false;
  matchedPairs = 0;

  displayClick.textContent = 0;
  displayTimer.textContent = "0:00";

  gameBoard.innerHTML = ""; //clear cards
}

//timer

function startTimer() {
  timer = setInterval(function () {
    seconds++;

    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;

    if (secs < 10) {
      displayTimer.textContent = mins + ":0" + secs;
    } else {
      displayTimer.textContent = mins + ":" + secs;
    }
  }, 1000);
}

//fetch cards from the API
async function fetchCards() {
  try {
    const response = await fetch("/cards");
    if (!response.ok) {
      throw new Error("Failed to fetch cards");
    }
    cardList = await response.json();
    console.log("Cards loaded from database:", cardList);
  } catch (error) {
    console.error("Error fetching cards:", error);
    // if API fails
    // cardList = [
    //   { name: "snow", emoji: "❄️" },
    //   { name: "snow", emoji: "❄️" },
    //   { name: "fire", emoji: "🔥" },
    //   { name: "fire", emoji: "🔥" },
    //   { name: "tree", emoji: "🌲" },
    //   { name: "tree", emoji: "🌲" },
    //   { name: "water", emoji: "🌊" },
    //   { name: "water", emoji: "🌊" },
    //   { name: "rainbow", emoji: "🌈" },
    // ];
  }
}

// shuffle cards
function shuffleCards() {
  cardList.sort(function () {
    return Math.random() - 0.5;
  });
}

//generate cards
function createCards() {
  for (let i = 0; i < cardList.length; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-name", cardList[i].name);

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">#</div>
        <div class="card-back">${cardList[i].emoji}</div>
      </div>
    `;

    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  }
}

//flip cards

function flipCard(event) {
  let card = event.currentTarget;

  if (lock) {
    return;
  }

  if (card.classList.contains("flipped")) {
    return;
  }

  if (card.classList.contains("matched")) {
    return;
  }
  //timer starts on first clicks
  if (clicks === 0) {
    startTimer();
  }

  card.classList.add("flipped");
  openedCards.push(card);
  clicks++;
  displayClick.textContent = clicks;

  if (openedCards.length === 2) {
    checkMatch();
  }
}

//check if cards match
function checkMatch() {
  let card1 = openedCards[0];
  let card2 = openedCards[1];

  if (card1.getAttribute("data-name") === card2.getAttribute("data-name")) {
    card1.classList.add("matched");
    card2.classList.add("matched");

    matchedPairs++;
    openedCards = [];

    //if game won
    checkWin();
  } else {
    lock = true;

    setTimeout(function () {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");

      openedCards = [];
      lock = false;
    }, 1000);
  }
}

//game over if player wins
function checkWin() {
  if (matchedPairs === 4) {
    clearInterval(timer);
    setTimeout(function () {
      finalTime.textContent = displayTimer.textContent;
      finalClicks.textContent = clicks;
      popUp.style.display = "flex";
    }, 500);
  }
}

//reset game
window.addEventListener("DOMContentLoaded", async function () {
  await fetchCards();
  shuffleCards();
  createCards();
});
