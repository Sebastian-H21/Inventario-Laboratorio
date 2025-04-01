<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestamo extends Model
{
    use HasFactory;

    protected $fillable = [
        'fecha_prestamo',
        'fecha_devolucion',
        'id_estudiante',
        'rfc',
        'id_material',
        'estado',
    ];
}
