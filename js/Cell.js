import { UI } from './Ui.js'
import { FLAG_CSS, NOT_CLICKED_CSS, CELL_REVEALED_CSS, MINE_CSS,} from './Statements.js';
export class Cell extends UI{
  constructor(x,y){
    super();
    this.x=x;
    this.y=y;
    this.value = 0;//number of mines within range
    this.isMine = false;
    this.isReveal = false;
    this.isFlagged = false;
    this.selector = `[data-x="${this.x}"][data-y="${this.y}"]`;//cell selector-HTML
    this.element = null;//cell handle 
  }
  createElement(){
    const element = `<div class="cell border border--concave" data-cell data-x="${this.x}" data-y="${this.y}"></div>`;
    return element;
  }
  toggleFlag() {
      this.isFlagged = !this.isFlagged;
      this.element.classList.toggle(FLAG_CSS);
  }
  revealCell() {
      this.isReveal = true;
      this.element.classList.remove(NOT_CLICKED_CSS);
      this.element.classList.add(CELL_REVEALED_CSS);
    
    if (this.isMine) {
      this.element.classList.add(MINE_CSS);
      return;//jezeli mina to i tak po grze
    }
    //when mine within range
    if (this.value) {
      this.element.textContent = this.value;
      
      this.element.classList.add(`cell-info-${this.value}`);//color change depending on mines within range
    }
  }
  addMine() {
    this.isMine = true;
  }
  
}