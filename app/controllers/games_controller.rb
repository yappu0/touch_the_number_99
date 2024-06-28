class GamesController < ApplicationController
  before_action :set_player, only: %i[show wait watch finish attack result]
  before_action :set_game, except: %i[tap]
  before_action :redirect_to_root_if_no_game, only: %i[show finish]
  before_action :authenticate_player, except: %i[tap]

  def show
  end

  def wait
    redirect_to watch_game_path if Game.in_progress.present?
    @waiting_game = Game.find_or_create_by(status: :waiting)
    @player.update_columns(status: :waiting)
  end

  def watch
    @player.update_columns(status: :watching) if @game.present?
  end

  def attack
    @game.attack!(@player, count: params[:count])
    render json: { status: 'attack' }
  end

  def finish
    @game.finish!(@player)
    render json: { status: 'success' }
  end

  def tap
    Game.tap_square(params[:game_id], params[:player_id])
    render json: { status: 'tap' }
  end

  def result
    @finished_game = Game.finished.last
    @my_ranking = @player.my_ranking(@finished_game)
  end

  private

  def set_player
    @player = Player.find_by(player_token: session[:player_token])
  end

  def set_game
    @game = Game.in_progress.last
  end

  def redirect_to_root_if_no_game
    redirect_to root_path if @game.blank?
  end

  def authenticate_player
    redirect_to root_path if @player.blank?
  end

  def game?
    action_name == 'show'
  end
end
