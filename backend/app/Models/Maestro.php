<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;


class Maestro extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    protected $fillable = [
        'rfc',
        'nombre',
        'apellido',
        
    ];

    public function prestamos()
    {
        return $this->hasMany(Prestamo::class, 'id_maestro');
    }
}
