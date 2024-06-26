import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['board'];
  static values = { gameId: Number };

  connect() {
    // TODO: 25に直す
    this.numbers = Array.from({ length: 5 }, (_, i) => i + 1);
    this.currentNumber = 1;
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
      if (this.currentNumber > 5) {
        this.sendWinStatus();
      }
    }
  }

  async sendWinStatus() {
    try {
      await fetch('/game/finish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({ game_id: this.gameIdValue }),
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
