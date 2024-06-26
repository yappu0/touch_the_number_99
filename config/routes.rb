Rails.application.routes.draw do
  resource :player, only: %i[show create]
  resource :game, only: %i[show] do
    get :wait
    get :watch
    post :finish
  end
  namespace :admins do
    resource :home, only: %i[show] do
      post :game_start
    end
  end

  root 'players#show'
end
