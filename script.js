let defaultBoard, playerName;
let humanScore = 0, aiScore = 0;
const gameboard = document.querySelector("#gameboard");
const cells = document.querySelectorAll(".cell");
const submit = document.querySelector("#submit");
const input = document.querySelector("#name");
const human = "O";
const ai = "X";
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
submit.addEventListener("click", hideForm, false);
render();

function render() {
  defaultBoard = Array.from(Array(9).keys());
  document.querySelector('#next').style.display = 'none';
  document.querySelector('#tie-message').style.display = 'none';
  for (let index = 0; index < cells.length; index++) {
    cells[index].innerHTML = "";
    cells[index].removeAttribute('style', 'backgroundColor');
    cells[index].addEventListener("click", huClick, false);
  }
}

function nextRound() {
  render();
}

function hideForm() {
  playerName = input.value;
  document.getElementById("player").style.display = "none";
  let score = document.getElementById("scores");
  let playerDiv =document.createElement('div');
  let aiDiv =document.createElement('div');
  playerDiv.id = "player-score";
  aiDiv.id = "ai-score";
  playerDiv.innerHTML = `${playerName}:\n${humanScore}`;
  aiDiv.innerHTML = `AI:\n${aiScore}`
  playerDiv.style.cssText = `font-size: 30px;`;
  aiDiv.style.cssText = `font-size: 30px;`;
  score.appendChild(playerDiv);
  score.appendChild(aiDiv);
}
function huClick(e) {
  if(input.value == "") alert("Please enter your name: ");
  if(typeof defaultBoard[e.target.id] == 'number' && input.value != ""){
    turn(e.target.id, human);
    if(!checkTie()) turn(bestMove(), ai);
  }
} 

function turn(eID, player) {
  defaultBoard[eID] = player;
  document.getElementById(eID).innerHTML = player;
  let won = checkWinner(defaultBoard, player);
  if(won){gameOver(won);}
}

function checkWinner(board, player) {
  let moves = board.reduce((a, current, index) => (current === player) ? a.concat(index) : a, []);
  let won = null;
  for (let [index, win] of winningCombos.entries()) {
    if (win.every(e => moves.indexOf(e) > -1)) {
      won = {index: index, player: player};
      break;
    }
  }
  return won;
}

function updateScoreboard(won){
  won.player == human ? humanScore++ : aiScore++;
  document.getElementById("player-score").innerHTML = `${playerName}:\n${humanScore}`;
  document.getElementById("ai-score").innerHTML = `AI:\n${aiScore}`
}

function gameOver(won) {
  for (let index of winningCombos[won.index]) {
    document.getElementById(index).style.backgroundColor =
    won.player == human ? "yellow" : "green"; 
  }
  for (let index = 0; index < cells.length; index++) {
    cells[index].removeEventListener('click', huClick, false);
  }
  document.querySelector("#next").style.display = "block";
  updateScoreboard(won);
}

function tieMessage(){
  let message = document.getElementById('tie-message');
  message.style.display = "block";
}

function emptyDiv() {
  return defaultBoard.filter(s => typeof s == 'number');
}

function bestMove() {
  return minimax(defaultBoard, ai).index;
}

function checkTie() {
  let aiWon = checkWinner(defaultBoard, ai);
  let humanWon = checkWinner(defaultBoard, human);
  if (emptyDiv().length == 0 && aiWon == null && humanWon == null) {
    for (let index = 0; index < cells.length; index++) {
      cells[index].removeEventListener('click', huClick, false);
      cells[index].style.backgroundColor = 'red';
    }
    document.getElementById("next").style.display = "block";
    tieMessage();
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  let availableDivs = emptyDiv(newBoard);

  if (checkWinner(newBoard, player)) {
    return {score: -10};
  }else if (checkWinner(newBoard, ai)) {
    return {score: 10};
  }else if (availableDivs.length === 0) {
    return {score: 0}
  }
  let moves = [];
  for (let i = 0; i < availableDivs.length; i++) {
    let move = {};
    move.index = newBoard[availableDivs[i]];
    newBoard[availableDivs[i]] = player;

    if (player == ai){
      let result = minimax(newBoard, human);
      move.score = result.score;
    }else {
      let result = minimax(newBoard, ai);
      move.score = result.score;
    }
    newBoard[availableDivs[i]] = move.index;

    moves.push(move);
  } 

  let bestMove;
  if(player === ai){
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
      
    }
  }else{
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
      
    }
  }
  return moves[bestMove];
}