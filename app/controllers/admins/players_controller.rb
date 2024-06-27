class Admins::PlayersController < ApplicationController
  def destroy
    Player.destroy_all
    redirect_to admins_home_url, notice: 'プレイヤーを削除しました'
  end
end
