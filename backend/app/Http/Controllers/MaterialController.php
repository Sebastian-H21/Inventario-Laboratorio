<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Categoria;
use App\Models\Marca;
use App\Models\Ubicacion;
use App\Models\Laboratorio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades;
use Illuminate\Support\Str;

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
            'nombre' => 'required|string|max:30',
            'cantidad' => 'required|numeric',
            'observaciones' => 'nullable|string|max:50',
            'modelo' => 'required|string|max:50',
            'id_marca' => 'required|exists:marcas,id',
            'id_categoria' => 'required|exists:categorias,id',
            'id_ubicacion' => 'required|exists:ubicacions,id',
            'id_laboratorio' => 'required|exists:laboratorios,id',
        ]);
        $laboratorio = Laboratorio::findOrFail($validatedData['id_laboratorio']);
        $ultimo = \App\Models\Material::withTrashed()
            ->where('id_laboratorio', $validatedData['id_laboratorio'])
            ->orderByDesc('id')
            ->first();
        $numero = 1;
        if ($ultimo && preg_match('/-(\d{3,})$/', $ultimo->codigo, $matches)) {
            $numero = intval($matches[1]) + 1;
        }
        $codigo = $this->generarCodigoMaterial($laboratorio->nombre,$validatedData['nombre'], $numero);
        $validatedData['codigo'] = $codigo;
        $validatedData['observaciones'] = $validatedData['observaciones'] ?? 'Sin observaciones';
        $registro = \App\Models\Material::create($validatedData);
        $registro->load('marca:id,nombre', 'categoria:id,nombre', 'ubicacion:id,nombre', 'laboratorio:id,nombre');
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
                'nombre' => 'required|string|max:30',
                'cantidad' => 'required|numeric',
                'observaciones' => 'nullable|string|max:50',
                'modelo' => 'required|string|max:50',
                'id_marca' => 'required|exists:marcas,id',
                'id_categoria' => 'required|exists:categorias,id',
                'id_ubicacion' => 'required|exists:ubicacions,id',
                'id_laboratorio' => 'required|exists:laboratorios,id',
            ]);
            $validatedData['observaciones'] = $validatedData['observaciones'] ?? 'Sin observaciones';
            $material = Material::findOrFail($id);
            $codigoOriginal = $material->codigo;
            if ($validatedData['nombre'] !== $material->nombre) {
                $laboratorio = $material->laboratorio;
                if (preg_match('/-(\d{4})$/', $codigoOriginal, $matches)) {
                    $numero = intval($matches[1]);
                } else {
                    $numero = 1;
                }
                $codigoNuevo = $this->generarCodigoMaterial($laboratorio->nombre, $validatedData['nombre'], $numero);
                $validatedData['codigo'] = $codigoNuevo;
            } else {
                $validatedData['codigo'] = $codigoOriginal;
            }
            $material->update($validatedData);
            $material->load('marca:id,nombre', 'categoria:id,nombre', 'ubicacion:id,nombre', 'laboratorio:id,nombre');
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
    public function obtenerUltimoNumero()
    {
        try {
            $ultimo = \App\Models\Material::withTrashed()
                ->orderByDesc('id')
                ->first();
            if (!$ultimo) {
                return response()->json(['ultimoNumero' => 1]);
            }
            $matches = [];
            if (preg_match('/-(\d{4})$/', $ultimo->codigo, $matches)) {
                $numero = intval($matches[1]) + 1;
                return response()->json(['ultimoNumero' => $numero]);
            }
            return response()->json(['ultimoNumero' => 1]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener el último número'], 500);
        }
    }
    public function obtenerUltimoNumeroPorLaboratorio($id_laboratorio)
    {
        try {
            $ultimo = \App\Models\Material::withTrashed()
                ->where('id_laboratorio', $id_laboratorio)
                ->orderByDesc('id')
                ->first();
            if (!$ultimo) {
                return response()->json(['ultimoNumero' => 1]);
            }
            $matches = [];
            if (preg_match('/-(\d{4})$/', $ultimo->codigo, $matches)) {
                $numero = intval($matches[1]) + 1;
                return response()->json(['ultimoNumero' => $numero]);
            }
            return response()->json(['ultimoNumero' => 1]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener el último número'], 500);
        }
    }
    private function generarCodigoMaterial($nombre, $nombreLab, $numero)
    {
        $nombreCorto = collect(explode(' ', strtoupper(Str::ascii($nombre))))
            ->take(2)
            ->map(fn($p) => substr($p, 0, 3))
            ->implode('');
        $labCorto = substr(strtoupper(Str::ascii($nombreLab)), 0, 3);
        $secuencia = str_pad($numero, 4, '0', STR_PAD_LEFT);
        return "{$nombreCorto}-{$labCorto}-{$secuencia}";
    }
}
