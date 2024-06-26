class GamesController < ApplicationController
  before_action :set_player, only: %i[wait watch]
  before_action :authenticate_player
  before_action :started?, only: %i[wait]

  def wait
  end

  def watch
  end

  private

  def set_player
    @player = Player.find_by(player_token: session[:player_token])
  end

  def authenticate_player
    redirect_to root_path if @player.blank?
  end

  def started?
    if Player.where(status: :playing).exists?
      @player.update!(status: :watching)
      redirect_to watch_game_path
    else
      @player.update!(status: :waiting)
    end
  end
end
