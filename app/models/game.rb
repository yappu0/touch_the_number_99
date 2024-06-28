class Game < ApplicationRecord
  extend Enumerize

  enumerize :status, in: %i[waiting in_progress finished], scope: :shallow

  validates :status, presence: true

  def finish!(player)
    end_time = Time.current.to_i
    start_time = REDIS.get("start_time:#{self.id}:#{player.id}").to_i
    elapsed_time = end_time - start_time
    player.update(status: 'finished')
    REDIS.set("elapsed_time:#{self.id}:#{player.id}", elapsed_time)
    ActionCable.server.broadcast "game_#{self.id}_player_#{player.id}_channel", { action: 'finish' }
    game_set if Player.finished.count * 2 > Player.playing.count
  end

  def game_set
    update_columns(status: 'finished')
    ActionCable.server.broadcast "game_#{self.id}_channel", { action: 'game_set' }
    Player.playing.update_all(status: 'finished')
    Player.watching.update_all(status: 'finished')
  end

  def attack!(player, count)
    return if status.finished?

    ranking = Game.tap_ranking(self.id)
    attack_target_player_ids = []
    [{ rank_range: 0..0.1, hit_rate: 0.75 }, { rank_range: 0.1..0.25, hit_rate: 0.5 }, { rank_range: 0.25..0.5, hit_rate: 0.25 }, { rank_range: 0.5..75, hit_rate: 0.15 }].each do |hash|
      rank_range, hit_rate = hash
      ranking.each_with_index do |(player_id, _), index|
        if rank_range.include?(index.to_f / ranking.size)
          attack_target_player_ids << player_id if rand < hit_rate
        end
        if attack_target_player_ids.size > 0
          break
        end
      end
    end

    # 対象がいなければ全体の１割をランダム。うまいことやってもっといい感じにしたい
    if attack_target_player_ids.empty?
      target_count = (ranking.count * 0.1).to_i
      target_count = 1 if target_count == 0
      attack_target_player_ids = Player.playing.where.not(id: player.id).sample(target_count).pluck(:id)
    end

    Player.playing.where(id: attack_target_player_ids).where.not(id: player.id).find_each do |opponent|
      ActionCable.server.broadcast "game_#{self.id}_player_#{opponent.id}_channel", { action: 'attack', count: }
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

  class << self
    def start!
      game = Game.waiting.last
      game.update!(status: 'in_progress')
      Player.waiting.update_all(status: 'playing')
      ActionCable.server.broadcast "game_#{game.id}_channel", { action: 'game_start', game_id: game.id }
      start_time = Time.current.to_i.to_s
      Player.playing.find_each do |player|
        REDIS.set("start_time:#{game.id}:#{player.id}", start_time)
        REDIS.zadd("game:#{game.id}", 0, player.id)
      end
    end

    def tap_ranking(game_id)
      REDIS.zrevrange("game:#{game_id}", 0, -1, with_scores: true)
    end

    def tap_square(game_id, user_id)
      old_ranking = tap_ranking(game_id).slice(0, 5)
      p old_ranking
      REDIS.zincrby("game:#{game_id}", 1, user_id)
      new_ranking = tap_ranking(game_id).slice(0, 5)
      p new_ranking
      if old_ranking != new_ranking
        ActionCable.server.broadcast "game_#{game_id}_channel", { action: 'tap', ranking: new_ranking }
      end
    end
  end
end
