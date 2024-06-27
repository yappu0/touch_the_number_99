import consumer from './consumer';

document.addEventListener('turbo:load', () => {
  if (!document.querySelector('[data-player-id]')) {
    return;
  }

  console.log('aaa');
  this.player_id = document.querySelector('[data-player-id]').dataset.playerId;

  consumer.subscriptions.create(
    {
      channel: 'GameChannel',
      player_id: this.player_id,
    },
    {
      connected() {
        this.player_id = document.querySelector('[data-player-id]').dataset.playerId;
        console.log('Connected to GameChannel');
      },

      disconnected() {
        console.log('Disconnected from GameChannel');
      },

      received(data) {
        console.log('Received data', data);

        if (data.action === 'game_start') {
          window.location.href = '/game';
        }

        if (data.action === 'game_over') {
          alert(`Game Over! The winner is ${data.winner}`);
          window.location.href = '/player';
        }

        if (data.action === 'game_won') {
          alert('Congratulations! You won!!!');
          window.location.href = '/player';
        }

        if (data.action === 'attack') {
          console.log('Attack received');
          replaceButtons(data.count.count);
        }
      },
    }
  );
});

const replaceButtons = (count) => {
  const buttons = Array.from(document.querySelectorAll('.numbers button:not([disabled])'));

  if (buttons.length < count) {
    return;
  }

  for (let i = buttons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
  }

  const selectedButtons = buttons.slice(0, count);
  const parent = buttons[0].parentNode;
  const positions = selectedButtons.map((button) => Array.from(parent.children).indexOf(button));

  for (let i = 0; i < count; i++) {
    const currentButton = selectedButtons[i];
    const nextPosition = positions[(i + 1) % count];
    const referenceNode = parent.children[nextPosition];
    parent.insertBefore(currentButton, referenceNode);
  }
};
