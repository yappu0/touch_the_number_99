import consumer from './consumer';

document.addEventListener('turbo:load', () => {
  if (!document.querySelector('[data-player-id]')) {
    return;
  }

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

        if (data.action === 'finish') {
          alert('ゲームクリア！集計までお待ちください');
        }

        if (data.action === 'game_set') {
          alert('ゲーム終了！結果発表です！');
          window.location.href = '/game/result';
        }

        if (data.action === 'attack') {
          console.log('Attack received');
          attack(data.count.count);
        }
      },
    }
  );
});

const attack = (count) => {
  const functions = [reverseText, convertToKanji, convertToRoman, smallFont, shuffle];

  const randomIndex = Math.floor(Math.random() * functions.length);
  const selectedFunction = functions[randomIndex];

  selectedFunction(count);
};

const getRandomButtons = (count) => {
  const buttons = Array.from(document.querySelectorAll('.numbers button:not([disabled])'));
  if (buttons.length < count) return [];
  return buttons.sort(() => 0.5 - Math.random()).slice(0, count);
};

const shuffle = (count) => {
  const selectedButtons = getRandomButtons(count);
  if (selectedButtons.length === 0) return;

  const parent = selectedButtons[0].parentNode;
  const fragment = document.createDocumentFragment();
  selectedButtons.forEach((button) => fragment.appendChild(button));
  parent.appendChild(fragment);
  applyRandomAnimation(selectedButtons);
};

const smallFont = (count) => {
  const selectedButtons = getRandomButtons(count);
  selectedButtons.forEach((button) => {
    button.style.fontSize = `${parseFloat(getComputedStyle(button).fontSize) * 0.5}px`;
  });
  applyRandomAnimation(selectedButtons);
};

const convertToRoman = (count) => {
  const romanNumerals = [
    { value: 20, numeral: 'XX' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' },
  ];

  const toRoman = (num) => {
    return romanNumerals.reduce((result, { value, numeral }) => {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
      return result;
    }, '');
  };

  const selectedButtons = getRandomButtons(count)
  selectedButtons.forEach((button) => {
    button.textContent = toRoman(parseInt(button.dataset.number));
  });
  applyRandomAnimation(selectedButtons);
};

const convertToKanji = (count) => {
  const kanjiNumerals = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

  const toKanji = (num) => {
    if (num <= 10) return kanjiNumerals[num];
    if (num < 20) return '十' + (num % 10 !== 0 ? kanjiNumerals[num % 10] : '');
    return (
        kanjiNumerals[Math.floor(num / 10)] + '十' + (num % 10 !== 0 ? kanjiNumerals[num % 10] : '')
    );
  };

  const selectedButtons = getRandomButtons(count)
  selectedButtons.forEach((button) => {
    const number = parseInt(button.dataset.number);
    button.textContent = toKanji(number);
    Object.assign(button.style, {
      writingMode: 'vertical-rl',
      textOrientation: 'upright',
      lineHeight: '1',
    });
  });
  applyRandomAnimation(selectedButtons);
};

const reverseText = (count) => {
  const selectedButtons = getRandomButtons(count)
  selectedButtons.forEach((button) => {
    button.textContent = button.textContent.split('').reverse().join('');
    Object.assign(button.style, {
      transform: 'scaleX(-1)',
      display: 'inline-block',
    });
  });
  applyRandomAnimation(selectedButtons);
};

const applyRandomAnimation = (buttons) => {
  const animations = ['shake-animation'];
  const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

  buttons.forEach(button => {
    button.classList.add(randomAnimation);
    button.addEventListener('animationend', () => {
      button.classList.remove(randomAnimation);
    }, { once: true });
  });
};
