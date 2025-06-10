<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Material extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'materials';
    protected $fillable = [
        'codigo',
        'nombre',
        'cantidad',
        'observaciones',
        'id_marca',
        'id_categoria',
        'id_ubicacion',
        'id_laboratorio',
    ];


    public function prestamos()
    {
        return $this->belongsToMany(Prestamo::class, 'detalle_prestamos', 'material_id', 'prestamo_id')->withTrashed();
    }
    
    public function marca()
    {
        return $this->belongsTo(Marca::class, 'id_marca')->withTrashed();
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'id_categoria')->withTrashed();
    }
    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'id_ubicacion')->withTrashed();
    }
    public function laboratorio()
    {
        return $this->belongsTo(Laboratorio::class, 'id_laboratorio')->withTrashed();
    }

}
