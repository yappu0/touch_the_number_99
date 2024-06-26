class PlayersController < ApplicationController
  def show
    @player = Player.find_or_initialize_by(player_token: session[:player_token])
  end

  def create
    @player = Player.new(player_params)
    if @player.save
      session[:player_token] = @player.player_token
      redirect_to player_path
    else
      render :show
    end
  end

  private

  def player_params
    params.require(:player).permit(:name)
  end
end
