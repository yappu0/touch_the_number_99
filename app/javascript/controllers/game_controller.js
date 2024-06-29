import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['board', 'firstCutIn', 'secondCutIn', 'thirdCutIn', 'gameSetCutIn', 'currentRanking', 'rankings'];
  static values = { gameId: Number, playerId: Number, hard: String };

  connect () {
    // TODO: 25に直す
    this.numbers = Array.from({ length: 25 }, (_, i) => i + 1);
    this.currentNumber = 1;
    this.clearCount = 0;
    this.replaceButtonCount = 1;
    this.createGameBoard();
  }

  createGameBoard () {
    this.shuffleArray(this.numbers);
    this.numbers.forEach((number) => {
      const button = document.createElement('button');
      button.textContent = number;
      button.dataset.action = 'click->game#handleNumberClick';
      button.dataset.number = number;
      this.boardTarget.appendChild(button);
    });
  }

  shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  handleNumberClick (event) {
    console.log('Number clicked:', event.currentTarget.dataset.number);
    const number = parseInt(event.currentTarget.dataset.number);
    if (number === this.currentNumber) {
      event.currentTarget.disabled = true;
      this.currentNumber++;
      this.postData('/game/tap', { game_id: this.gameIdValue, player_id: this.playerIdValue });

      // TODO: 25に直す
      if (this.currentNumber > 25) {
        this.initGameBoard();
        if (this.hardValue === 'true') {
          this.postData('/game/attack', { count: this.replaceButtonCount });
        }
      }
      // TODO: 5に直す
      if (this.hardValue === 'true') {
        if (this.clearCount === 4) {
          this.postData('/game/finish');
        }
      } else {
        if (this.clearCount === 3) {
          this.postData('/game/finish');
        }
      }
    }
  }

  initGameBoard () {
    this.currentNumber = 1;
    this.clearCount++;
    this.replaceButtonCount++;
    this.boardTarget.innerHTML = '';
    if (this.clearCount === 1) {
      document.querySelectorAll('.js-cutin-ranking-number').forEach((rankingNumber) => {
        rankingNumber.textContent = document.querySelector('.js-current-ranking-number').textContent;
      });
      this.firstCutInTarget.classList.remove('hidden');
      this.currentRankingTarget.classList.add('hidden');
      this.rankingsTarget.classList.add('hidden');

      setTimeout(() => {
        this.firstCutInTarget.classList.add('hidden');
        this.currentRankingTarget.classList.remove('hidden');
        this.rankingsTarget.classList.remove('hidden');
        this.createGameBoard();
      }, 2000);
    } else if (this.clearCount === 2) {
      if (this.hardValue === 'true') {
        document.querySelectorAll('.js-cutin-ranking-number').forEach((rankingNumber) => {
          rankingNumber.textContent = document.querySelector('.js-current-ranking-number').textContent;
        });
        this.secondCutInTarget.classList.remove('hidden');
        this.currentRankingTarget.classList.add('hidden');
        this.rankingsTarget.classList.add('hidden');

        setTimeout(() => {
          this.secondCutInTarget.classList.add('hidden');
          this.currentRankingTarget.classList.remove('hidden');
          this.rankingsTarget.classList.remove('hidden');
          this.createGameBoard();
        }, 2000);
      } else {
        document.querySelectorAll('.js-cutin-ranking-number').forEach((rankingNumber) => {
          rankingNumber.textContent = document.querySelector('.js-current-ranking-number').textContent;
        });
        this.thirdCutInTarget.classList.remove('hidden');
        this.currentRankingTarget.classList.add('hidden');
        this.rankingsTarget.classList.add('hidden');

        setTimeout(() => {
          this.thirdCutInTarget.classList.add('hidden');
          this.currentRankingTarget.classList.remove('hidden');
          this.rankingsTarget.classList.remove('hidden');
          this.createGameBoard();
        }, 2000);
      }

    } else if (this.clearCount === 3) {
      if (this.hardValue === 'true') {
        document.querySelectorAll('.js-cutin-ranking-number').forEach((rankingNumber) => {
          rankingNumber.textContent = document.querySelector('.js-current-ranking-number').textContent;
        });
        this.thirdCutInTarget.classList.remove('hidden');
        this.currentRankingTarget.classList.add('hidden');
        this.rankingsTarget.classList.add('hidden');

        setTimeout(() => {
          this.thirdCutInTarget.classList.add('hidden');
          this.currentRankingTarget.classList.remove('hidden');
          this.rankingsTarget.classList.remove('hidden');
          this.createGameBoard();
        }, 2000);
      } else {
        document.querySelectorAll('.js-cutin-ranking-number').forEach((rankingNumber) => {
          rankingNumber.textContent = document.querySelector('.js-current-ranking-number').textContent;
        });
        this.gameSetCutInTarget.classList.remove('hidden');
        this.currentRankingTarget.classList.add('hidden');
        this.rankingsTarget.classList.add('hidden');
      }
    } else if (this.clearCount === 4) {
      document.querySelectorAll('.js-cutin-ranking-number').forEach((rankingNumber) => {
        rankingNumber.textContent = document.querySelector('.js-current-ranking-number').textContent;
      });
      this.gameSetCutInTarget.classList.remove('hidden');
      this.currentRankingTarget.classList.add('hidden');
      this.rankingsTarget.classList.add('hidden');
    }
  }

  async postData (url = '', data = {}) {
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
