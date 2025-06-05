<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MaestroController;
use App\Http\Controllers\EstudiantesController;
use App\Http\Controllers\EncargadoController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\PrestamoController;
use App\Http\Controllers\AdministradorController;
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\UbicacionController;
use App\Http\Controllers\MateriaController;

// Login único
Route::post('/login', [EncargadoController::class, 'login']);

// Rutas para encargados autenticados (admin o no)
Route::middleware('auth:encargado')->group(function () {
    Route::post('/logout', [EncargadoController::class, 'logout']);
    Route::get('/user', [EncargadoController::class, 'user']);

    Route::get('/perfil', [EncargadoController::class, 'perfil']);
    Route::put('/perfil', [EncargadoController::class, 'actualizarPerfil']);
    
    Route::apiResource('maestros', MaestroController::class);
    Route::post('/maestros/{id}/restaurar', [MaestroController::class, 'restaurar']);
    Route::get('/maestros/list', [MaestroController::class, 'list']);

    Route::apiResource('estudiantes', EstudiantesController::class);
    Route::post('/estudiantes/{id}/restaurar', [EstudiantesController::class, 'restaurar']);
    Route::get('/estudiantes/list', [EstudiantesController::class, 'list']);

    Route::apiResource('materials', MaterialController::class);
    Route::post('/materials/{id}/restaurar', [MaterialController::class, 'restaurar']);

    Route::apiResource('prestamos', PrestamoController::class);
    Route::post('/prestamos/{id}/restaurar', [PrestamoController::class, 'restaurar']);

    Route::apiResource('marcas', MarcaController::class);
    Route::post('/marcas/{id}/restaurar', [MarcaController::class, 'restaurar']);

    Route::apiResource('categorias', CategoriaController::class);
    Route::post('/categorias/{id}/restaurar', [CategoriaController::class, 'restaurar']);

    Route::apiResource('ubicacions', UbicacionController::class);
    Route::post('/ubicacions/{id}/restaurar', [UbicacionController::class, 'restaurar']);

    Route::apiResource('materias', MateriaController::class);
    Route::post('/materias/{id}/restaurar', [MateriaController::class, 'restaurar']);

    Route::apiResource('laboratorios', MarcaController::class);
    Route::post('/laboratorios/{id}/restaurar', [MarcaController::class, 'restaurar']);
});

// Rutas exclusivas para administradores
Route::middleware(['auth:encargado', 'is.admin'])->group(function () {
    Route::apiResource('encargados', EncargadoController::class);
    Route::post('/encargados/{id}/restaurar', [EncargadoController::class, 'restaurar']);
});