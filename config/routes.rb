Rails.application.routes.draw do
  resource :player, only: %i[show create]
  resource :game, only: %i[show] do
    get :wait
    get :watch
    post :attack
    post :finish
    post :tap
    get :result
  end
  namespace :admins do
    resource :home, only: %i[show] do
      post :game_start
    end
    resource :player, only: %i[destroy]
    resource :game, only: %i[destroy]
    root 'homes#show'
  end

  get 'qr', to: 'games#qr'

  root 'players#show'
end
