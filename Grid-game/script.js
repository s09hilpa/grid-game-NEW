const cards = document.querySelectorAll(".card");
const displayClick = document.getElementById("clickcount");
const displayTimer = document.getElementById("timer");
const startBtn = document.getElementById("start-button");

let openedCards = [];
let clicks = 0;
let seconds = 0;
let myTimer = null;
let gameStart = false;

// this is for time
function runClock() {
  seconds = seconds + 1;

  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;

  if (secs < 10) {
    displayTimer.textContent = mins + ":0" + secs;
  } else {
    displayTimer.textContent = mins + ":" + secs;
  }
}
//time starts if you click a card
function flipCard() {
  if (gameStart == false) {
    gameStart = true;
    myTimer = setInterval(runClock, 1000);
  }
  //this flips cards//
  this.classList.add("flipped");
  clicks = clicks + 1; //count the clicks
  displayClick.textContent = clicks;
  openedCards.push(this);

  if (openedCards.length === 2) {
    let card1 = openedCards[0];
    let card2 = openedCards[1];

    if (card1.getAttribute("name") === card2.getAttribute("name")) {
      // if a match then keep them flipped
      openedCards = [];
    } else {
      // if not a match then flip them back
      setTimeout(function () {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        openedCards = []; // this will clear the list for the next turn
      }, 1000);
    }
  }
}

for (let i = 0; i < cards.length; i++) {
  cards[i].onclick = flipCard;

  // this shuffle all card
  let randomNumber = Math.floor(Math.random() * 9);
  cards[i].style.order = randomNumber;
}

//start button clicks
startBtn.onclick = function () {
  //start when the clock not running
  if (gameStart == false) {
    gameStart = true;

    //this starts time
    myTimer = setInterval(runClock, 1000);
  }
};
