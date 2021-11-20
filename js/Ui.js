//element handles class
export class UI {
  constructor() {
    this.UiSelectors = {
      board: `[data-board]`,
      cell: '[data-cell]',
      counter: `[data-counter]`,
      timer: `[data-timer]`,
      resetButton: `[data-button-reset]`,
      easyButton: `[data-button-easy]`,
      normalButton: `[data-button-normal]`,
      expertButton: `[data-button-expert]`,
      modal: `[data-modal]`,
      modalHeader: `[data-modal-header]`,
      modalButton: `[data-modal-button]`,
      levelButtons: `[data-button-border]`,
    };
  }
  //elemnet handle
  getElement(selector) {
    return document.querySelector(selector);
  }
  //Nodelist
  getElements(selector) {
    return document.querySelectorAll(selector);
  }
}