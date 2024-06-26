import consumer from "./consumer"

consumer.subscriptions.create("GameChannel", {
  connected() {
    console.log("Connected to GameChannel");
  },

  disconnected() {
    console.log("Disconnected from GameChannel");
  },

  received(data) {
    console.log("Received data", data);

    if (data.action === 'game_start') {
      Turbo.visit('/game');
    }

    if (data.action === 'game_finished') {
      alert(`Game Over! The winner is ${data.winner}`)
      Turbo.visit('/player');
    }
  }
});
