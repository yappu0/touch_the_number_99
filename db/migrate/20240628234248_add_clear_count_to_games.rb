class AddClearCountToGames < ActiveRecord::Migration[7.1]
  def change
    add_column :games, :clear_count, :integer, default: 0
  end
end
