class Player < ApplicationRecord
  extend Enumerize

  enumerize :status, in: %i[waiting playing finished watching]

  validates :name, presence: true
  validates :player_token, presence: true, uniqueness: true

  before_validation :set_player_token, on: :create

  scope :default_order, -> { order(:id) }
  scope :playing, -> { where(status: :playing) }
  scope :waiting, -> { where(status: :waiting) }

  private

  def set_player_token
    self.player_token = SecureRandom.uuid
  end
end
