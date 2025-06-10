<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Encargado extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, SoftDeletes;
    protected $table = 'encargados';
    protected $fillable = [
        'email',
        'nombre',
        'apellido',
        'password',
        //'is_admin',
    ];
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function isAdmin()
    {
        return $this->is_admin === true;
    }
}


