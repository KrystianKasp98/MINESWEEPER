import { UI } from './Ui.js'

export class Counter extends UI{
  constructor() {
    super();
    this.value = null;
  }
  #element = null;//private property
  
  init() {
    this.#element = this.getElement(this.UiSelectors.counter);
  }

  setValue(value) {
    this.value = value;
    this.#updateValue();
  }
  //increasing the flags
  increment() {
    this.value++;
    this.#updateValue();
  }
  //decreasing the flags
  decrement() {
    this.value--;
    this.#updateValue();
  }

  #updateValue() {
    this.#element.textContent = this.value;
  }
}