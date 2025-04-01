<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estudiantes extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_control',
        'nombre',
        'apellido',
        'carrera',
        'semestre',
        'estado',
        'imagen',
    ];
}
