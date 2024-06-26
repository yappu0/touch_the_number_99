class CreatePlayers < ActiveRecord::Migration[7.1]
  def change
    create_table :players do |t|
      t.string :name, null: false
      t.string :status
      t.string :player_token, null: false

      t.timestamps
    end
  end
end
