class Admins::HomesController < ApplicationController
  def show
  end

  def game_start
    if params[:hard]
      Game.start!(hard: true)
      redirect_to admins_home_url, notice: 'ゲーム（ハード）を開始しました'
    else
      Game.start!
      redirect_to admins_home_url, notice: 'ゲームを開始しました'
    end
  end
end
