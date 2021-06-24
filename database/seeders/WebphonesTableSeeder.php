<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class WebphonesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('webphones')->delete();
        
        \DB::table('webphones')->insert(array (
            0 => 
            array (
                'id' => 4,
                'name' => 'Support',
                'callerId' => '3007',
                'status' => 'active',
                'created_at' => '2021-02-08 15:04:47',
                'updated_at' => '2021-02-08 15:05:53',
            ),
            1 => 
            array (
                'id' => 5,
                'name' => 'Sale Support',
                'callerId' => '3007',
                'status' => 'active',
                'created_at' => '2021-02-08 15:05:23',
                'updated_at' => '2021-02-08 15:05:23',
            ),
            2 => 
            array (
                'id' => 6,
                'name' => 'تماس با پشتیبانی',
                'callerId' => '3007',
                'status' => 'active',
                'created_at' => '2021-02-08 15:05:36',
                'updated_at' => '2021-02-09 06:22:36',
            ),
        ));
        
        
    }
}