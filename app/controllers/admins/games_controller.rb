class Admins::GamesController < ApplicationController
  def destroy
    Game.destroy_all
    Player.update_all(status: 'finished')
    redirect_to admins_home_url, notice: 'ゲームを削除しました'
  end
end
