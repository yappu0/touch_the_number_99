class Game < ApplicationRecord
  extend Enumerize

  enumerize :status, in: %i[in_progress finished], scope: :shallow

  validates :status, presence: true

  def finish!(winner)
    p 'finish!'
    p 'finish!'
    p 'finish!'
    p 'finish!'
    p 'finish!'
    update(winner_id: winner.id, status: 'finished')
    Player.playing.update_all(status: 'finished')
    Player.watching.update_all(status: 'finished')
    Player.finished.where.not(id: winner.id).find_each do |finished_player|
      ActionCable.server.broadcast "player_#{finished_player.id}_game_channel", { action: 'game_over', winner: winner.name }
    end
    ActionCable.server.broadcast "player_#{winner.id}_game_channel", { action: 'game_won', winner: winner.name }

  end

  class << self
    def start!
      game = Game.create(status: 'in_progress')
      Player.waiting.update_all(status: 'playing')
      Player.playing.find_each do |player|
        ActionCable.server.broadcast "player_#{player.id}_game_channel", { action: 'game_start', game_id: game.id }
      end
    end
  end
end
