class Game < ApplicationRecord
  extend Enumerize

  enumerize :status, in: %i[in_progress finished]

  validates :status, presence: true

  scope :in_progress, -> { where(status: :in_progress) }

  def finish!(player)
    update(winner_id: player.id, status: 'finished')
    Player.update_all(status: 'finished')
    ActionCable.server.broadcast 'game_channel', { action: 'game_finished', winner: player.name }
  end

  class << self
    def start!
      game = Game.create(status: 'in_progress')
      Player.waiting.update_all(status: 'playing')
      ActionCable.server.broadcast 'game_channel', { action: 'game_start', game_id: game.id }
    end

    def in_progress?
      where(status: :in_progress).exists?
    end
  end
end
