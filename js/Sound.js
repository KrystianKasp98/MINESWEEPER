import{ SUCCES_URL, FAILURE_URL } from './Statements.js'

class Sound{
  constructor(succes, failure)
  {
    this.succes = new Audio(succes);
    this.failure = new Audio(failure);
  }
}

export const sound = new Sound(SUCCES_URL, FAILURE_URL);