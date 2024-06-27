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
        console.log(`Connected to Game${this.game_id}Channel`);
      },

      disconnected () {
        console.log('Disconnected from GameChannel');
      },

      received (data) {
        console.log('Received data', data);

        if (data.action === 'tap') {
          displayRanking(data.ranking);
        }

        if (data.action === 'game_start') {
          window.location.href = '/game';
        }

        if (data.action === 'game_set') {
          alert('ゲーム終了！結果発表です！');
          window.location.href = '/game/result';
        }
      },
    },
  );
});

const createRankingElement = (userId, score) => {
  const li = document.createElement('li');
  li.textContent = `一位: ユーザーID：${userId}, 数: ${score}`;
  return li;
};

const displayRanking = (rankingData) => {
  const rankingContainer = document.querySelector('.js-ranking');
  rankingContainer.innerHTML = '';  // Clear any existing ranking data

  rankingData.forEach(([userId, score]) => {
    const rankingElement = createRankingElement(userId, score);
    rankingContainer.appendChild(rankingElement);
  });
};
