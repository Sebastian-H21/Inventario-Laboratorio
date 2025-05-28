<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prestamo extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'fecha_prestamo',
        'fecha_devolucion',
        'practica',
        'id_estudiante',
        'id_maestro',
        'id_encargado',
        'id_materia',
    ];

    public function estudiante()
    {
        return $this->belongsTo(Estudiantes::class, 'id_estudiante', 'id')->withTrashed();
    }

    public function maestro()
    {
        return $this->belongsTo(Maestro::class, 'id_maestro', 'id')->withTrashed();
    }

    public function encargado()
    {
        return $this->belongsTo(Encargado::class, 'id_encargado')->withTrashed();
    }

    public function materiales()
    {
        return $this->belongsToMany(Material::class, 'detalle_prestamos', 'prestamo_id', 'material_id')->withTrashed();
    }

    public function materia()
    {
        return $this->belongsTo(Materia::class, 'id_materia', 'id')->withTrashed();
    }

    public function materialesDetalle()
    {
        return $this->hasMany(DetallePrestamo::class, 'prestamo_id', 'id')->withTrashed();
    }

    protected static function booted()
    {
        static::deleting(function ($prestamo) {
            if ($prestamo->isForceDeleting()) {
                $prestamo->materialesDetalle()->forceDelete();
            } else {
                $prestamo->materialesDetalle()->delete(); 
            }
        });
    }


}


