<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Administrador extends Model
{
    use HasFactory;

    protected $fillable = [
        'rfc',
        'nombre',
        'apellido',
        'contrase',
    ];
}