<?php

namespace App\Http\Controllers;

use App\Models\Laboratorio;
use Illuminate\Http\Request;

class LaboratorioController extends Controller
{
    public function index(Request $request)
    {
        try {
            $verArchivados = $request->query('verArchivados') === 'true';
            if ($verArchivados) {
                $laboratorios = Laboratorio::onlyTrashed()->get(); 
            } else {
                $laboratorios = Laboratorio::all(); 
            }
            return response()->json($laboratorios);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al obtener los laboratorios.',
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
                
                $registro = Laboratorio::create($validatedDatos);
                
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
            $laboratorio = Laboratorio::findOrFail($id);
            $laboratorio->update($validatedData);
            return response()->json([
                'message' => 'Laboratorio actualizado correctamente',
                'data' => $laboratorio
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

    public function destroy(Laboratorio $laboratorio)
    {
        try {
            $laboratorio->delete();
            return response()->json(['message' => 'Laboratorio archivado correctamente.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al archivar la laboratorio.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    public function restaurar($id)
    {
        try {
            $laboratorio = Laboratorio::onlyTrashed()->findOrFail($id);
            $laboratorio->restore();
            return response()->json(['message' => 'Laboratorio restaurada'], 200); 
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Laboratorio no encontrada.',
                'message' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al restaurar la laboratorio.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    //listar laboratorios
    public function list()
    {
        try {
            $laboratorios = Laboratorio::select('nombre',)->get();
            return response()->json($laboratorios);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener los laboratorios.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
