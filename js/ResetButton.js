import { UI } from './Ui.js';
import { SVG_SELECTOR, SPRITE_URL } from './Statements.js';

export class ResetButton extends UI{
  constructor() {
    super();
    this.element = this.getElement(this.UiSelectors.resetButton);
  }
  
  changeEmotion(emotion) {
    
    this.element.querySelector(SVG_SELECTOR).setAttribute('href', `${SPRITE_URL}${emotion}`);
  }
}