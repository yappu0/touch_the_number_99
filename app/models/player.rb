class Player < ApplicationRecord
  extend Enumerize

  enumerize :status, in: %i[waiting playing finished watching]

  validates :name, presence: true
  validates :clear_count, numericality: { greater_than_or_equal_to: 0 }
  validates :player_token, presence: true, uniqueness: true

  before_validation :set_player_token, on: :create

  scope :default_order, -> { order(:id) }

  def start
    self.update!(status: :playing)
  end

  private

  def set_player_token
    self.player_token = SecureRandom.hex(16)
  end
end
