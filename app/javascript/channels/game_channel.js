import consumer from './consumer';

document.addEventListener('turbo:load', () => {
  if (!document.querySelector('[data-game-id]')) {
    console.log('No game ID found');
    return;
  }

  console.log('Game ID found');
  this.game_id = document.querySelector('[data-game-id]').dataset.gameId;

  consumer.subscriptions.create(
    {
      channel: 'GameChannel',
      game_id: this.game_id,
    },
    {
      connected () {
        this.game_id = document.querySelector('[data-game-id]').dataset.gameId;
        this.player_id = document.querySelector('[data-player-id]').dataset.playerId;
        this.hard = document.querySelector('[data-game-hard-value]').dataset.hard;
        console.log(`Connected to Game${this.game_id}Channel`);
      },

      disconnected () {
        console.log('Disconnected from GameChannel');
      },

      received (data) {
        console.log('Received data', data);

        if (data.action === 'tap') {
          this.playerRanking = data.ranking.findIndex(([user_id, _]) => {
            return user_id === this.player_id;
          });
          this.playerScore = data.ranking[this.playerRanking][1];
          if (this.hard) {
            if (this.playerScore >= 75) {
              document.querySelector('.js-current-ranking-number').textContent = '？';
            } else {
              document.querySelector('.js-current-ranking-number').textContent = this.playerRanking + 1;
            }
          } else {
            if (this.playerScore >= 50) {
              document.querySelector('.js-current-ranking-number').textContent = '？';
            } else {
              document.querySelector('.js-current-ranking-number').textContent = this.playerRanking + 1;
            }
          }

          displayRanking(data.ranking);
        }

        if (data.action === 'game_start') {
          let countdown = 3;
          document.getElementById('loader').classList.add('hidden');
          const countdownElement = document.getElementById('countdown');
          countdownElement.textContent = countdown;
          const countdownInterval = setInterval(() => {
            countdown -= 1;
            countdownElement.textContent = countdown;
            if (countdown <= 0) {
              clearInterval(countdownInterval);
              if (data.hard === true) {
                window.location.href = '/game?hard=true';
              } else {
                window.location.href = '/game';
              }
            }
          }, 1000);
        }

        if (data.action === 'game_set') {
          alert('ゲーム終了！結果発表です！');
          window.location.href = '/game/result';
        }
      },
    },
  );
});

const createRankingElement = (userId, score, rank) => {
  const li = document.createElement('li');
  li.textContent = `${rank}位: ${userId} ${Math.trunc(score / 5)}周目 ${score % 5}タイル`;
  li.classList.add('bg-blue-100', 'border', 'border-blue-200', 'rounded', 'p-2', 'mb-2');
  return li;
};

const displayRanking = (rankingData) => {
  const rankingContainer = document.querySelector('.js-ranking');
  rankingContainer.innerHTML = '';  // Clear any existing ranking data

  let rank = 0;
  rankingData.forEach(([userId, score]) => {
    rank += 1;
    const rankingElement = createRankingElement(userId, score, rank);
    rankingContainer.appendChild(rankingElement);
  });
};
