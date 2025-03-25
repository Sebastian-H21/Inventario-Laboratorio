<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Maestros extends Model
{
    use HasFactory;

    protected $table = 'maestros';

    protected $fillable = [
        'rfc',
        'nombre',
        'apellidos'
    ];
}
