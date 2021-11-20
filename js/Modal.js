import { UI } from './UI.js'
import { VISIBILITY_CSS } from './Statements.js'

export class Modal extends UI{
  constructor() {
    super();
    this.buttonText = '';
    this.infoText = '';
    this.element = this.getElement(this.UiSelectors.modal);
    this.button = this.getElement(this.UiSelectors.modalButton); 
    this.header = this.getElement(this.UiSelectors.modalHeader); 
  }

  toggleModal=()=> {
    this.element.classList.toggle(VISIBILITY_CSS);
  }
  setText() {
    this.header.textContent = this.infoText;
    this.button.textContent = this.buttonText;
  }
}