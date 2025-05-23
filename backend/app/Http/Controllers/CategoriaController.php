<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $verArchivados = $request->query('verArchivados') === 'true';
            if ($verArchivados) {
                $categorias = Categoria::onlyTrashed()->get(); 
            } else {
                $categorias = Categoria::all(); 
            }
            return response()->json($categorias);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al obtener las categorias.',
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
                
                $registro = Categoria::create($validatedDatos);
                
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
            $categoria = Categoria::findOrFail($id);
            $categoria->update($validatedData);
            return response()->json([
                'message' => 'Categoria actualizado correctamente',
                'data' => $categoria
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

    public function destroy(Categoria $categoria)
    {
        try {
            $categoria->delete();
            return response()->json(['message' => 'Categoria archivado correctamente.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al archivar la categoria.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function restaurar($id)
    {
        try {
            $categoria = Categoria::onlyTrashed()->findOrFail($id);
            $categoria->restore();
            return response()->json(['message' => 'Categoria restaurada'], 200); 
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Categoria no encontrado.',
                'message' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al restaurar la categoria.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    //listar categorias
    public function list()
    {
        try {
            $Categorias = Categoria::select('nombre',)->get();
            return response()->json($categorias);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener las catrgorias.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
