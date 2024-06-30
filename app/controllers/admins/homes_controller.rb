class Admins::HomesController < ApplicationController
  before_action :basic_auth

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

  private

  def basic_auth
    authenticate_or_request_with_http_basic do |username, password|
      username == ENV['BASIC_ID'] && password == ENV['BASIC_PASSWORD']
    end
  end
end
