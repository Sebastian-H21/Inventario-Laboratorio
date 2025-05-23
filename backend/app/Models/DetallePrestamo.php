<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DetallePrestamo extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'detalle_prestamos';

    protected $fillable = ['prestamo_id', 'material_id'];

    public function prestamo()
    {
        return $this->belongsTo(Prestamo::class);
    }

    public function material()
    {
        return $this->belongsTo(Material::class)->withTrashed();
    }
}
