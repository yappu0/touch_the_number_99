class Game < ApplicationRecord
  extend Enumerize

  enumerize :status, in: %i[in_progress finished], scope: :shallow

  validates :status, presence: true

  def finish!(player)
    end_time = Time.current.to_i
    start_time = REDIS.get("start_time:#{self.id}:#{player.id}").to_i
    elapsed_time = end_time - start_time
    player.update(status: 'finished')
    REDIS.set("elapsed_time:#{self.id}:#{player.id}", elapsed_time)
    ActionCable.server.broadcast "player_#{player.id}_game_channel", { action: 'finish' }
    game_set if Player.finished.count * 2 > Player.playing.count
  end

  def game_set
    update_columns(status: 'finished')
    Player.playing.or(Player.finished).find_each do |player|
      p 'game_set'
      p player.id
      ActionCable.server.broadcast "player_#{player.id}_game_channel", { action: 'game_set' }
    end
    Player.playing.update_all(status: 'finished')
    Player.watching.update_all(status: 'finished')
  end

  def attack!(player, count)
    return if status.finished?

    Player.playing.where.not(id: player.id).find_each do |opponent|
      ActionCable.server.broadcast "player_#{opponent.id}_game_channel", { action: 'attack', count: }
    end
  end

  def time_ranking
    # クリアまでにかかった時間のランキングを取得
    REDIS.keys("elapsed_time:#{self.id}:*").map do |key|
      user_id = key.split(':').last
      elapsed_time = REDIS.get(key)
      [user_id, elapsed_time]
    end.sort_by { |_, elapsed_time| elapsed_time }
  end

  def tap_ranking
    REDIS.zrevrange("game:#{self.id}", 0, -1, with_scores: true)
  end

  class << self
    def start!
      game = Game.create(status: 'in_progress')
      Player.waiting.update_all(status: 'playing')
      Player.playing.find_each do |player|
        ActionCable.server.broadcast "player_#{player.id}_game_channel", { action: 'game_start', game_id: game.id }
        start_time = Time.current.to_i.to_s
        REDIS.set("start_time:#{game.id}:#{player.id}", start_time)
        REDIS.zadd("game:#{game.id}", 0, player.id)
      end
    end

    def tap_square(game_id, user_id)
      REDIS.zincrby("game:#{game_id}", 1, user_id)
    end
  end
end
