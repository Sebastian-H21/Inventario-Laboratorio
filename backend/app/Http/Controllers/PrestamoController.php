<?php

namespace App\Http\Controllers;

use App\Models\Prestamo;
use App\Models\Maestro;
use App\Models\Estudiantes;
use App\Models\Material;
use App\Models\DetallePrestamo;
use Illuminate\Http\Request;
use App\Models\Materia;
use App\Models\Laboratorio;

class PrestamoController extends Controller
{

    public function index(Request $request)
    {
        try {
            $verArchivados = $request->query('verArchivados') === 'true';

            $prestamos = Prestamo::with([
                'estudiante',
                'maestro',
                'encargado',
                'materialesDetalle.material',
                'materia',
                'laboratorio',
            ])
            ->when($verArchivados, fn($q) => $q->onlyTrashed())
            ->get()
            ->map(function ($prestamo) {
                $prestamo->materiales_detalle = $prestamo->materialesDetalle
                    ->map(function ($detalle) {
                        return $detalle->material ? [
                            'id' => $detalle->material->id,
                            'codigo' => $detalle->material->codigo,
                            'nombre' => $detalle->material->nombre,
                        ] : null;
                    })
                    ->filter();

                return $prestamo;
            });

            return response()->json($prestamos->values()->toArray());
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al obtener los préstamos.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'numero_control' => 'required|exists:estudiantes,numero_control',
            'rfc' => 'required|exists:maestros,rfc',
            'id_materia' => 'required|exists:materias,id',
            'fecha_devolucion' => 'required|date|after_or_equal:today|date_format:Y-m-d H:i:s',
            'practica' => 'required|string|max:50',
            'materiales' => 'required|array|min:1',
            'materiales.*' => 'string|exists:materials,codigo',
            'id_laboratorio' => 'required|exists:laboratorios,id'
        ]);

        $estudiante = Estudiantes::where('numero_control', $request->numero_control)->first();
        $maestro = Maestro::where('rfc', $request->rfc)->first();
        $materia = Materia::findOrFail($request->id_materia);
        $encargadoId = auth('encargado')->id();
        $laboratorio = Laboratorio::findOrFail($request->id_laboratorio);

        // Obtener materiales
        $materiales = Material::whereIn('codigo', $request->materiales)->get();

        // Validar que todos los materiales pertenezcan al laboratorio seleccionado
        $materialesInvalidos = $materiales->filter(function ($material) use ($laboratorio) {
            return $material->id_laboratorio !== $laboratorio->id;
        });

        if ($materialesInvalidos->isNotEmpty()) {
            $nombres = $materialesInvalidos->pluck('nombre')->implode(', ');
            return response()->json([
                'message' => "Los siguientes materiales no pertenecen al laboratorio seleccionado: $nombres"
            ], 422);
        }

        // Registrar el préstamo
        $prestamo = Prestamo::create([
            'fecha_prestamo' => now()->format('Y-m-d H:i:s'),
            'fecha_devolucion' => $request->fecha_devolucion,
            'practica' => $request->practica,
            'id_estudiante' => $estudiante->id,
            'id_maestro' => $maestro->id,
            'id_encargado' => $encargadoId,
            'id_materia' => $materia->id,
            'id_laboratorio' => $laboratorio->id,
        ]);

        foreach ($materiales as $material) {
            DetallePrestamo::create([
                'prestamo_id' => $prestamo->id,
                'material_id' => $material->id,
            ]);
        }

        // Cargar relaciones y retornar respuesta
        $prestamo->load(['estudiante', 'maestro', 'materialesDetalle.material', 'encargado', 'materia', 'laboratorio']);

        $prestamo->materiales_detalle = $prestamo->materialesDetalle
            ->filter(fn($d) => $d->material !== null)
            ->map(fn($d) => [
                'id' => $d->material->id,
                'codigo' => $d->material->codigo,
                'nombre' => $d->material->nombre,
            ])
            ->values();

        return response()->json([
            'message' => 'Registro guardado correctamente',
            'data' => $prestamo,
        ]);
    } catch (\Exception $e) {
        \Log::error('Error al registrar préstamo: ' . $e->getMessage());
        return response()->json([
            'message' => 'Ocurrió un error inesperado',
            'error' => $e->getMessage(),
        ], 500);
    }
}



    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'numero_control' => 'required|exists:estudiantes,numero_control',
                'rfc' => 'required|exists:maestros,rfc',
                'id_materia' => 'required|exists:materias,id',
                'id_laboratorio' => 'required|exists:laboratorios,id',
            ]);

            $estudiante = Estudiantes::where('numero_control', $request->numero_control)->first();
            $maestro = Maestro::where('rfc', $request->rfc)->first();
            $materia = Materia::findOrFail($request->id_materia);
            $laboratorio = Laboratorio::findOrFail($request->id_laboratorio);

            $request->merge([
                'id_estudiante' => $estudiante->id,
                'id_maestro' => $maestro->id,
                'id_materia' => $materia->id,
                'id_laboratorio' => $laboratorio->id,
                'materiales' => $request->input('materiales', []),
            ]);

            $validatedData = $request->validate([
                'fecha_devolucion' => 'required|date|after_or_equal:today|date_format:Y-m-d H:i:s',
                'practica' => 'required|string|max:50',
                'id_estudiante' => 'required|exists:estudiantes,id',
                'id_maestro' => 'required|exists:maestros,id',
                'id_materia' => 'required|exists:materias,id',
                'materiales' => 'required|array|min:1',
                'materiales.*' => 'string|exists:materials,codigo',
                'id_laboratorio' => 'required|exists:laboratorios,id',
            ]);

            $prestamo = Prestamo::findOrFail($id);
            $prestamo->update(collect($validatedData)->except('materiales')->toArray());
            
            $materialesActuales = $prestamo->materiales()->pluck('codigo')->toArray();
            $materialesNuevos = $request->materiales;
            
            $materialIds = Material::whereIn('codigo', $request->materiales)->pluck('id');
            $materialIds = Material::whereIn('codigo', $request->materiales)->pluck('id');
            $prestamo->materiales()->sync($materialIds);
            
            $prestamo->load(['estudiante', 'maestro', 'materialesDetalle.material', 'encargado', 'materia','laboratorio']);
            $prestamo->materiales_detalle = $prestamo->materialesDetalle
                ->filter(fn($d) => $d->material !== null)
                ->map(fn($d) => [
                    'id' => $d->material->id,
                    'codigo' => $d->material->codigo,
                    'nombre' => $d->material->nombre,
                ])
                ->values();

            return response()->json([
                'message' => 'Préstamo actualizado correctamente',
                'data' => $prestamo
            ]);
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



    public function destroy($id)
        {
            try {
                $prestamo = Prestamo::findOrFail($id);

                if ($prestamo->trashed()) {
                    return response()->json([
                        'message' => 'El préstamo ya ha sido eliminado.'
                    ], 200);
                }

                $prestamo->delete();

                return response()->json([
                    'message' => 'Préstamo eliminado correctamente',
                    'id' => $prestamo->id
                ]);
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'Préstamo no encontrado.',
                ], 404);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'No se pudo eliminar el préstamo.',
                    'error' => $e->getMessage(),
                ], 500);
            }
        }

    

    public function restaurar($id)
    {
        try {
            $prestamo = Prestamo::onlyTrashed()->findOrFail($id);
            $prestamo->restore();
            return response()->json(['message' => 'Prestamo restaurado'], 200); 
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Prestamo no encontrado.',
                'message' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al restaurar el Prestamo.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
