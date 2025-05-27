<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use Illuminate\Http\Request;

class MateriaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $verArchivados = $request->query('verArchivados') === 'true';
            if ($verArchivados) {
                $materias = Materia::onlyTrashed()->get(); 
            } else {
                $materias = Materia::all(); 
            }
            return response()->json($materias);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al obtener las materias.',
                'message' => $e->getMessage(),
            ], 500);
        }
        
    }

    public function store(Request $request)
    {
        try {
            $validatedDatos = $request->validate([
                'nombre' => 'required|string|max:50',
                ]);
                
                $registro = Materia::create($validatedDatos);
                
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


    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'nombre' => 'required|string|max:50',
                    
            ]);
            $materia = Materia::findOrFail($id);
            $materia->update($validatedData);
            return response()->json([
                'message' => 'Materia actualizado correctamente',
                'data' => $materia
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

    public function destroy(Materia $materia)
    {
        try {
            $materia->delete();
            return response()->json(['message' => 'Materia archivado correctamente.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al archivar la materia.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    public function restaurar($id)
    {
        try {
            $materia = Materia::onlyTrashed()->findOrFail($id);
            $materia->restore();
            return response()->json(['message' => 'Materia restaurada'], 200); 
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Materia no encontrada.',
                'message' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al restaurar la materia.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    //listar materias
    public function list()
    {
        try {
            $materias = Materia::select('nombre',)->get();
            return response()->json($materias);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener las materias.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
