<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ubicacion extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
    ];
}
