<?php

namespace App\Http\Controllers;

use App\Models\Estudiantes;
use Illuminate\Http\Request;

class EstudiantesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $verArchivados = $request->query('verArchivados') === 'true';
            if ($verArchivados) {
                $estudiantes = Estudiantes::onlyTrashed()->get(); 
            } else {
                $estudiantes = Estudiantes::all(); 
            }
            return response()->json($estudiantes);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al obtener los estudiantes.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedDatos = $request->validate([
                'numero_control' => 'required|string|min:9|max:9',
                'nombre' => 'required|string|max:30',
                'apellido' => 'required|string|max:50',  
                'carrera' => 'required|string|max:50',
                'semestre' => 'required|string|max:50',
                'imagen' => 'required|string|max:50',     
                ]);
                
                $registro = Estudiantes::create($validatedDatos);
                
                return response()->json([
                    'message' => 'Registro guardado correctamente',
                    'data' => $registro
                ], 200);
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json([
                    'message' => 'Error de validación',
                    'errors' => $e->errors()
                ], 422);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Ocurrió un error inesperado',
                    'error' => $e->getMessage()
                ], 500);
            }
    }

    /**
     * Display the specified resource.
     */
    public function show(Estudiantes $estudiantes)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Estudiantes $estudiantes)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'numero_control' => 'required|string|min:9|max:9',
                'nombre' => 'required|string|max:30',
                'apellido' => 'required|string|max:50',  
                'carrera' => 'required|string|max:50',
                'semestre' => 'required|string|max:50',
                'imagen' => 'required|string|max:50',  
            ]);
        
            $estudiante = Estudiantes::findOrFail($id);
            $estudiante->update($validatedData);
        
            return response()->json([
                'message' => 'Estudiante actualizado correctamente',
                'data' => $estudiante
                ], 200);
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json([
                    'message' => 'Error de validación',
                    'errors' => $e->errors()
                ], 422);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Error inesperado en el servidor',
                    'error' => $e->getMessage()
                ], 500);
            }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Estudiantes $estudiante)
    {
        try {
            $estudiante->delete();
            return response()->json(['message' => 'Estudiante archivado correctamente.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al archivar el estudiante.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function restaurar($id)
    {
        try {
            $estudiantes = Estudiantes::onlyTrashed()->findOrFail($id);
            $estudiantes->restore();
            return response()->json(['message' => 'Estudiante restaurado'], 200); 
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Estudiante no encontrado.',
                'message' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al restaurar el estudiante.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}