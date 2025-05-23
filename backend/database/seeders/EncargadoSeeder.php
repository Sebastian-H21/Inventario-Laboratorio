<?php

namespace Database\Seeders;

use App\Models\Encargado;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EncargadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Encargado::create([
            'email' => 'admin@correo.com',
            'nombre' => 'Admin',
            'apellido' => 'Principal',
            'password' => Hash::make('12345678'),
            'is_admin' => true,
        ]);
    }
}
