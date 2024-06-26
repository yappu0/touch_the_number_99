class CreateGames < ActiveRecord::Migration[7.1]
  def change
    create_table :games do |t|
      t.string :status, null: false
      t.integer :winner_id

      t.timestamps
    end
  end
end
