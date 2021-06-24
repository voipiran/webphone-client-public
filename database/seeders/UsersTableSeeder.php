<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('users')->delete();
        
        \DB::table('users')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name' => 'Admin',
                'email' => 'admin@admin.com',
                'email_verified_at' => NULL,
                'password' => '$2y$10$Imwp3fimpImx7.4D7zdhLuuXrUCWPpI.K3DQOnTQDoyn6AKliNJdC',
                'remember_token' => NULL,
                'created_at' => '2021-02-08 13:24:23',
                'updated_at' => '2021-02-08 13:24:23',
            ),
        ));
        
        
    }
}