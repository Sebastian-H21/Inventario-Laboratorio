<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Categoria;
use App\Models\Marca;
use App\Models\Ubicacion;
use App\Models\Laboratorio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        try {
            $verArchivados = $request->query('verArchivados') === 'true';
            if ($verArchivados) {
                $materials = Material::onlyTrashed()
                    ->with(['categoria:id,nombre', 'marca:id,nombre', 'ubicacion:id,nombre','laboratorio:id,nombre'])
                    ->get();
            } else {
                $materials = Material::with(['categoria:id,nombre', 'marca:id,nombre', 'ubicacion:id,nombre','laboratorio:id,nombre'])
                    ->get();
            }
            return response()->json($materials);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al obtener los materiales',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'codigo' => 'required|string|min:10|max:10',
                'nombre' => 'required|string|max:30',
                'cantidad' => 'required|numeric',
                'observaciones' => 'nullable|string|max:50',
                'id_marca' => 'required|exists:marcas,id',
                'id_categoria' => 'required|exists:categorias,id',
                'id_ubicacion' => 'required|exists:ubicacions,id',
                'id_laboratorio' => 'required|exists:laboratorios,id',
            ]);

            $validatedData['observaciones'] = $validatedData['observaciones'] ?? 'Sin observaciones';
            $registro = Material::create($validatedData);
            $registro->load('marca:id,nombre', 'categoria:id,nombre', 'ubicacion:id,nombre','laboratorio:id,nombre');
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
                'codigo' => 'required|string|min:10|max:10',
                'nombre' => 'required|string|max:30',
                'cantidad' => 'required|numeric',
                'observaciones' => 'nullable|string|max:50',
                'id_marca' => 'required|exists:marcas,id',
                'id_categoria' => 'required|exists:categorias,id',
                'id_ubicacion' => 'required|exists:ubicacions,id',
                'id_laboratorio' => 'required|exists:laboratorios,id',
            ]);
            
            $validatedData['observaciones'] = $validatedData['observaciones'] ?? 'Sin observaciones';
            $material = Material::findOrFail($id);
            $material->update($validatedData);

            $material->load('marca:id,nombre', 'categoria:id,nombre', 'ubicacion:id,nombre','laboratorio:id,nombre');

            return response()->json([
                'message' => 'Material actualizado correctamente',
                'data' => $material
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

    public function destroy(Material $material)
    {
        try {
            if ($material->trashed()) {
                return response()->json(['message' => 'El material ya está archivado.'], 200);
            }
            $material->delete();
            return response()->json(['message' => 'Material archivado correctamente.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al archivar el material.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function restaurar($id)
    {
        try {
            $material = Material::onlyTrashed()->findOrFail($id);
            $material->restore();
            return response()->json(['message' => 'Material restaurado'], 200); 
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Material no encontrado.',
                'message' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al restaurar el material.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


}
