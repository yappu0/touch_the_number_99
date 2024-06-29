class Player < ApplicationRecord
  extend Enumerize

  enumerize :status, in: %i[waiting playing finished watching], scope: :shallow

  validates :name, presence: true
  validates :player_token, presence: true, uniqueness: true

  before_validation :set_player_token, on: :create

  scope :default_order, -> { order(:id) }

  def my_ranking(game)
    tap_rankings = Game.tap_ranking(game.id)
    elapsed_times = tap_rankings.map(&:first).map do |user_id|
      REDIS.get("elapsed_time:#{game.id}:#{user_id}")
    end
    tap_rankings.zip(elapsed_times).each { |item, time| item << time }
    sorted_data = tap_rankings.sort_by { |_, _, count, time| [-count, time.to_i] }

    my_data_with_index = sorted_data.each_with_index.find { |(id, _, _), _| id == self.id.to_s }
    if my_data_with_index
      index = my_data_with_index[1]
      rank = index + 1
      tap_count = my_data_with_index[0][2]
      elapsed_time = my_data_with_index[0][3]
      { rank: rank, tap_count: tap_count, elapsed_time: }
    else
      nil
    end
  end

  private

  def set_player_token
    self.player_token = SecureRandom.uuid
  end
end
