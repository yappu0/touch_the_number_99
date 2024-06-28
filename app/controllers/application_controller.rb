class ApplicationController < ActionController::Base
  helper_method :game?

  private

  def game?
    false
  end
end
