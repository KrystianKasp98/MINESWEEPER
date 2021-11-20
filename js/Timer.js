import { UI } from './Ui.js'

export class Timer extends UI{
  //private properties
  #element = null;
  #interval = null;
  #maxNumberOfSeconds = 999;//time limit
  constructor() {
    super();
    this.numberOfSeconds = 0;
  }
  init() {
    this.#element = this.getElement(this.UiSelectors.timer);
  }
  #startTimer() {
    this.#interval = setInterval(() => this.#updateTimer(), 1000);
  }
  stopTimer() {
    clearInterval(this.#interval);//clearing timer after 999secs
  }
  resetTimer() {
    this.numberOfSeconds = 0;
    this.#setTimerValue(this.numberOfSeconds);
    this.stopTimer();
    this.#startTimer();
  }
  #updateTimer() {
    this.numberOfSeconds <= this.#maxNumberOfSeconds ? this.#setTimerValue(this.numberOfSeconds++) : this.stopTimer();
  }
  //update text timer in HTML
  #setTimerValue(value) {
    this.#element.textContent = value;
  }
}