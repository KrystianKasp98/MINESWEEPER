// class import
import { Cell } from './Cell.js';
import { UI } from './Ui.js';
import { Counter } from './Counter.js';
import { Timer } from './Timer.js';
import { ResetButton } from './ResetButton.js';
import { Modal } from './Modal.js';

//const import
import {
  CLOSE_BUTTON_TEXT,
  LOSE_TEXT,
  WIN_OVER_999_TEXT,
  NEGATIVE_EMOJI,
  POSITIVE_EMOJI,
  NEUTRAL_EMOJI,
  CLICKED_CSS,
  NOT_CLICKED_CSS,
  VARIABLE_CSS
} from './Statements.js';

//Game inherits from UI
class Game extends UI{
  //private 'hash method' - config
  #confing = {
    easy: {
      rows: 8,
      cols: 8,
      mines: 10,
    },
    normal: {
      rows: 16,
      cols: 16,
      mines: 40,
    },
    expert: {
      rows: 16,
      cols: 30,
      mines: 99,
    },
  }

  #counter = new Counter();//instance of flag counter
  #timer = new Timer();//instance of timer
  #modal = new Modal();//instance of modal

  //flag of game state
  #isGameFinished = false;
  //flag of first click in individual game
  #isFirstClick = true;

  //number of rows,cols, mines(depends on config)
  #numberOfRows = null;
  #numberOfCols = null;
  #numberOfMines = null;

  #cells=[];//array for instances of cell  
  #cellsElements = null;//Nodelist of cells
  #cellsToReveal = 0;//property deciding about the win 
  #revealedCells = 0;//property which informs about how many cells is revealed 

  #board = null;//handle of cell board

  #levelButtons = null;//Nodelist for level buttons

  //all buttons
  #buttons = {
    modal: null,
    easy: null,
    normal: null,
    expert: null,
    reset: new ResetButton(),//instance of ResetButton
  }

  //first initialization 
  initializeGame() {
    this.#handleElements();
    this.#counter.init();
    this.#timer.init();
    this.#addButtonsEventListeners();
    this.#newGame();
  }
  #newGame(rows = this.#confing.easy.rows, cols = this.#confing.easy.cols, mines = this.#confing.easy.mines) {

    //dependence between level and number of cols,rows,mines
    this.#numberOfRows = rows;
    this.#numberOfCols = cols;
    this.#numberOfMines = mines;

    //dependence number of lags and number of mines
    this.#counter.setValue(this.#numberOfMines);
    //resetting the timer
    this.#timer.resetTimer();
    
    //dependence between cells to reveal and board size 
    this.#cellsToReveal = this.#numberOfCols * this.#numberOfRows - this.#numberOfMines;

    //setting css variable which is responsibles for board layout
    this.#setStyles();

    this.#generateCells();//creating cells in dependence of rows and colums
    this.#renderBoard();//rendering div fields in dependence of rows and colums
    
    this.#cellsElements = this.getElements(this.UiSelectors.cell);//Nodelist of cells

    this.#buttons.reset.changeEmotion(NEUTRAL_EMOJI); //setting neutral emoji
    
    //resetting flags & property
    this.#isGameFinished = false;
    this.#isFirstClick = true;
    this.#revealedCells = 0;
    //setting EventListner on board 
    this.#addCellsEventListners();
  }
  //method serving end of game 
  #endGame(isWin){
    this.#isGameFinished = true;
    this.#timer.stopTimer();
    this.#modal.buttonText = CLOSE_BUTTON_TEXT;

    //lose condition
    if (!isWin) {
      this.#revealMines();
      this.#modal.infoText = LOSE_TEXT;
      this.#buttons.reset.changeEmotion(NEGATIVE_EMOJI);
      
    }
    //win condition
    else {
      this.#modal.infoText = this.#timer.numberOfSeconds == 999
        ? WIN_OVER_999_TEXT
        : ` You won, it took you ${this.#timer.numberOfSeconds} sec`;
      this.#buttons.reset.changeEmotion(POSITIVE_EMOJI); 
    }
    //show modal
    this.#modal.setText();
    this.#modal.toggleModal();
     
  }

  //assigning handles to elements
  #handleElements(){
    this.#board = this.getElement(this.UiSelectors.board);
    this.#buttons.modal = this.getElement(this.UiSelectors.modalButton);
    this.#buttons.easy = this.getElement(this.UiSelectors.easyButton);
    this.#buttons.normal = this.getElement(this.UiSelectors.normalButton);
    this.#buttons.expert = this.getElement(this.UiSelectors.expertButton);
    this.#levelButtons = this.getElements(this.UiSelectors.levelButtons);
  }
  #addCellsEventListners() {
    this.#board.addEventListener('click', this.#handleCellClick);
    this.#board.addEventListener('contextmenu', this.#handleCellContextMenu);
  }
  #removeBorderBtn() {
    this.#levelButtons.forEach(item => {
      item.classList.add(NOT_CLICKED_CSS);
      item.classList.remove(CLICKED_CSS);
    })
  }
  //adding convex effect on clicked level button
  #addClickedBtn(btn){
     btn.classList.add(CLICKED_CSS);
     btn.classList.remove(NOT_CLICKED_CSS);
    }
  //adding EventListeners on buttons
  #addButtonsEventListeners() {
    //modal BTN- method of hiding the modal
    this.#buttons.modal.addEventListener('click', this.#modal.toggleModal);
    //reset BTN
    this.#buttons.reset.element.addEventListener('click', () =>
      this.#handleNewGameClick());

    // easy BTN
    this.#buttons.easy.addEventListener('click', () => {
      this.#handleNewGameClick(
      this.#confing.easy.rows,
      this.#confing.easy.cols,
      this.#confing.easy.mines);
      this.#removeBorderBtn();
      this.#addClickedBtn(this.#buttons.easy); 
    })
      
    // normalBTN
    this.#buttons.normal.addEventListener('click', () => {
      this.#handleNewGameClick(
      this.#confing.normal.rows,
      this.#confing.normal.cols,
        this.#confing.normal.mines);
      this.#removeBorderBtn();
      this.#addClickedBtn(this.#buttons.normal); 
    })
      
    // expertBTN
      this.#buttons.expert.addEventListener('click', () => {
      this.#handleNewGameClick(
      this.#confing.expert.rows,
      this.#confing.expert.cols,
        this.#confing.expert.mines);
        this.#removeBorderBtn();
        this.#addClickedBtn(this.#buttons.expert); 
      
    })
      
  }
  //reset game method
  #handleNewGameClick(
    rows = this.#numberOfRows,
    cols = this.#numberOfCols,
    mines = this.#numberOfMines) {
    this.#newGame(rows, cols, mines);
  }
  //method which generates cells
  #generateCells() {
    this.#cells.length = 0;//clearing the array of cells
    //creating 2d array dependent on number of row and cels
    for(let row = 0; row < this.#numberOfRows; row++){
      this.#cells[row] = [];
      for(let col = 0; col < this.#numberOfCols; col++){
        this.#cells[row].push(new Cell(col,row));
      }
    }
  }
  #renderBoard() {
    
    //clearing the divs from the previous game
    while (this.#board.firstChild) {
      this.#board.removeChild(this.#board.lastChild)
    }

    //converting array of cells and creating fields in html and assigning data selectors to cells
    this.#cells.flat().forEach(cell => {
      this.#board.insertAdjacentHTML('beforeend', cell.createElement()); 
      cell.element = cell.getElement(cell.selector);
    });
  }
  //method which generates mines in cells
  #placeMinesInCells(cellInstance) {
    let minesToPlace = this.#numberOfMines;
    while (minesToPlace) {
      const rowIndex = this.#getRandomInteger(0, this.#numberOfRows - 1);
      const colIndex = this.#getRandomInteger(0, this.#numberOfCols - 1);

      const cell = this.#cells[rowIndex][colIndex];//selector of drawn cell

      const hasCellMine = cell.isMine;//checking drawn cell whether it has a mine

      //condition for adding a mine
      if (!hasCellMine  && (cellInstance.x != cell.x || cellInstance.y != cell.y)) {
        cell.addMine();
        minesToPlace--;
      }
    }
  }
  #findCell(e) {
    const target = e.target;
    //getting x and y position of cell from data attributes
    const rowIndex = parseInt(target.getAttribute('data-y'), 10);
    const colIndex = parseInt(target.getAttribute('data-x'), 10);
    const cell = this.#cells[rowIndex][colIndex]; //reference to a specify cell
    return cell
  }
  //left click method
  #handleCellClick = (e) => {    
    const cell = this.#findCell(e);
    //checking the cell
    this.#clickCell(cell);
  }
  //right click method
  #handleCellContextMenu = (e) => {   
    e.preventDefault();

    const cell = this.#findCell(e);

    //when the game is over or cell is reveal
    if (cell.isReveal || this.#isGameFinished) return;

    //getting flag
    if (cell.isFlagged) {
      this.#counter.increment();
      cell.toggleFlag();
      return
    }
    //setting flag
    if (this.#counter.value) {
      this.#counter.decrement();
      cell.toggleFlag();
    }
    
  }
  //checking cell  
  #clickCell(cell) {
    //conditions that's preventing action
    if (cell.isReveal || this.#isGameFinished || cell.isFlagged) return;
    
    //lose game condition
    if (cell.isMine) {
      this.#endGame(false);
    }
    this.#setCellValue(cell);
      
    //win game condition
    if (this.#revealedCells === this.#cellsToReveal && !this.#isGameFinished) {
      this.#endGame(true);
    }
  }
  #revealMines() {
    this.#cells.flat().filter(({ isMine }) => isMine).forEach((cell) => {
      cell.revealCell();
    });
  }
  //method of reveal cell
  #setCellValue(cell) {
    let minesCount = 0;

    //firs click protection
    if (this.#isFirstClick) {
      cell.revealCell(); 
      this.#revealedCells++;
      this.#isFirstClick = false;
      this.#placeMinesInCells(cell);//place mines
    }
     
    //mechanism which is checking how many mines there are within range of cell, with exceptions likes cell in position(0,0)
    for (let rowIndex = Math.max(cell.y - 1,0); rowIndex <= Math.min(cell.y + 1,this.#numberOfRows-1); rowIndex++){
      for (let colIndex = Math.max(cell.x - 1, 0); colIndex <= Math.min(cell.x + 1, this.#numberOfCols - 1); colIndex++) {
        if (this.#cells[rowIndex][colIndex].isMine) minesCount++;
      }
    }
    //setting number of mines within range of cell
    cell.value = minesCount;
    cell.revealCell();
    this.#revealedCells++;

    //mechanism which does method recursion is when any mines within range of cell
    if (!cell.value) {
      for (let rowIndex = Math.max(cell.y - 1, 0); rowIndex <= Math.min(cell.y + 1, this.#numberOfRows - 1); rowIndex++) {
        for (let colIndex = Math.max(cell.x - 1, 0); colIndex <= Math.min(cell.x + 1, this.#numberOfCols - 1); colIndex++) {
          const cell = this.#cells[rowIndex][colIndex];
        
          if (!cell.isReveal) {
            this.#clickCell(cell);
          }
        }
      }
    }
  }
  //method which changes css variable in dependence of cols
  #setStyles(){
    document.documentElement.style.setProperty(VARIABLE_CSS, this.#numberOfCols)
  }
  //random method for generate mines
  #getRandomInteger(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}




//game initialization
window.onload = function () {
  const game = new Game();

  game.initializeGame();
}