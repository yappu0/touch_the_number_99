Rails.application.routes.draw do
  resource :home, only: %i[show create]
  resource :game, only: %i[] do
    get :wait
    get :watch
  end
  namespace :admins do
    resource :home, only: %i[show] do
      post :game_start
    end
  end

  root "homes#show"
end
