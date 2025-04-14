<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Encargado extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'usuario',
        'nombre',
        'apellido',
        'contrasena',
    ];
}
