class Player < ApplicationRecord
  extend Enumerize

  enumerize :status, in: %i[waiting playing finished watching], scope: :shallow

  validates :name, presence: true
  validates :player_token, presence: true, uniqueness: true

  before_validation :set_player_token, on: :create

  scope :default_order, -> { order(:id) }

  def my_ranking(game)
    data = Game.tap_ranking(game.id)

    # データをtap数が多い順にソート
    sorted_data = data.sort_by { |_, count| -count }

    # 自分のデータと順位を探す
    my_data_with_index = sorted_data.each_with_index.find { |(id, _), _| id == self.id.to_s }

    if my_data_with_index
      index = my_data_with_index[1]
      tap_count = my_data_with_index[0][1]
      rank = index + 1  # インデックスは0から始まるので、順位として表示するには+1する
      { rank: rank, tap_count: tap_count }
    else
      nil
    end
  end

  private

  def set_player_token
    self.player_token = SecureRandom.uuid
  end
end
