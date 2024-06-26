class Game
  class << self
    def start
      Player.default_order.each do |player|
        player.start
      end
    end
  end
end
