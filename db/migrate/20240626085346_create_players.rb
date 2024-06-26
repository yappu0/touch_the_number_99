class CreatePlayers < ActiveRecord::Migration[7.1]
  def change
    create_table :players do |t|
      t.string :name, null: false, default: ''
      t.integer :clear_count, null: false, default: 0
      t.string :status, null: false, default: 'waiting'
      t.string :session_token, null: false, default: ''

      t.timestamps
    end
  end
end
