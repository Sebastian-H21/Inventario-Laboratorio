<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Estudiantes extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'numero_control',
        'nombre',
        'apellido',
        'carrera',
        'semestre',
        'imagen',
    ];
}
