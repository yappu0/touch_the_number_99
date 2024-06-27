import consumer from './consumer';

document.addEventListener('turbo:load', () => {
  if (!document.querySelector('[data-player-id]')) {
    return;
  }

  console.log('aaa');
  this.player_id = document.querySelector('[data-player-id]').dataset.playerId;

  consumer.subscriptions.create({
    channel: 'GameChannel',
    player_id: this.player_id,
  }, {
    connected () {
      this.player_id = document.querySelector('[data-player-id]').dataset.playerId;
      console.log('Connected to GameChannel');
    },

    disconnected () {
      console.log('Disconnected from GameChannel');
    },

    received (data) {
      console.log('Received data', data);

      if (data.action === 'game_start') {
        window.location.href = '/game';
      }

      if (data.action === 'game_over') {
        alert(`Game Over! The winner is ${data.winner}`);
        Turbo.visit('/player');
      }

      if (data.action === 'game_won') {
        alert('Congratulations! You won!!!');
        Turbo.visit('/player');
      }
    },
  });
});
