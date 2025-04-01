<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Encargado extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario',
        'nombre',
        'apellido',
        'contrasena',
    ];
}
