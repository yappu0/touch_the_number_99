class Admins::HomesController < ApplicationController
  def show
  end

  def game_start
    Game.start
    redirect_to admins_home_url, notice: 'ゲームを開始しました'
  end
end
