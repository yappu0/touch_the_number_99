import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['board'];
  static values = { gameId: Number };

  connect() {
    // TODO: 25に直す
    this.numbers = Array.from({ length: 25 }, (_, i) => i + 1);
    this.currentNumber = 1;
    this.clearCount = 0;
    this.replaceButtonCount = 1;
    this.createGameBoard();
  }

  createGameBoard() {
    this.shuffleArray(this.numbers);
    this.numbers.forEach((number) => {
      const button = document.createElement('button');
      button.textContent = number;
      button.dataset.action = 'click->game#handleNumberClick';
      button.dataset.number = number;
      this.boardTarget.appendChild(button);
    });
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  handleNumberClick(event) {
    console.log('Number clicked:', event.currentTarget.dataset.number);
    const number = parseInt(event.currentTarget.dataset.number);
    if (number === this.currentNumber) {
      event.currentTarget.disabled = true;
      this.currentNumber++;
      // TODO: 25に直す
      if (this.currentNumber > 25) {
        this.initGameBoard();
        this.postData('/game/attack', { count: this.replaceButtonCount });
      }
      // TODO: 5に直す
      if (this.clearCount === 5) {
        this.postData('/game/finish');
      }
    }
  }

  initGameBoard() {
    this.currentNumber = 1;
    this.clearCount++;
    this.replaceButtonCount++;
    this.boardTarget.innerHTML = '';
    this.createGameBoard();
  }

  async postData(url = '', data = {}) {
    try {
      await fetch(url, {
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
