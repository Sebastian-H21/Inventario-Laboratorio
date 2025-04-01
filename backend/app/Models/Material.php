<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo',
        'nombre',
        'cantidad',
        'marca',
        'categoria',
        'ubicacion',
        'estado',
    ];
}
