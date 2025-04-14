<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;


class Prestamo extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'fecha_prestamo',
        'fecha_devolucion',
        'id_estudiante',
        'rfc',
        'id_material',
        'estado',
    ];
}
