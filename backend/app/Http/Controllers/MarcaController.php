<?php

namespace App\Http\Controllers;

use App\Models\Marca;
use Illuminate\Http\Request;


class MarcaController extends Controller
{

    public function index(Request $request)
    {
        try {
            $verArchivados = $request->query('verArchivados') === 'true';
            if ($verArchivados) {
                $marcas = Marca::onlyTrashed()->get(); 
            } else {
                $marcas = Marca::all(); 
            }
            return response()->json($marcas);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al obtener las marcas.',
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
                
                $registro = Marca::create($validatedDatos);
                
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
            $marca = Marca::findOrFail($id);
            $marca->update($validatedData);
            return response()->json([
                'message' => 'Marca actualizado correctamente',
                'data' => $marca
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

    public function destroy(Marca $marca)
    {
        try {
            $marca->delete();
            return response()->json(['message' => 'Marca archivado correctamente.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al archivar la marca.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    public function restaurar($id)
    {
        try {
            $marca = Marca::onlyTrashed()->findOrFail($id);
            $marca->restore();
            return response()->json(['message' => 'Marca restaurada'], 200); 
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Marca no encontrada.',
                'message' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al restaurar la marca.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    //listar marcas
    public function list()
    {
        try {
            $marcas = Marca::select('nombre',)->get();
            return response()->json($marcas);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener las marcas.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
