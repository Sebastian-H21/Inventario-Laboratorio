<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Maestro extends Model
{
    use HasFactory;

    protected $fillable = [
        'rfc',
        'nombre',
        'apellido',
        'estado',
    ];
}
