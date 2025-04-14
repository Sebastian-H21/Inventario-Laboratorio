<?php

namespace App\Http\Controllers;

use App\Models\Maestro;
use Illuminate\Http\Request;

class MaestroController extends Controller
{
/**
* Display a listing of the resource.
*/
public function index(Request $request)
{
    try {
        $verArchivados = $request->query('verArchivados') === 'true';
        if ($verArchivados) {
            $maestros = Maestro::onlyTrashed()->get(); 
        } else {
            $maestros = Maestro::all(); 
        }
        return response()->json($maestros);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Ocurrió un error al obtener los maestros.',
            'message' => $e->getMessage(),
        ], 500);
    }
    
}

/**
* Show the form for creating a new resource.
*/
public function create()
{

}

/**
* Store a newly created resource in storage.
*/
public function store(Request $request)
{
    try {
        $validatedDatos = $request->validate([
            'rfc' => 'required|string|min:13|max:13',
            'nombre' => 'required|string|max:30',
            'apellido' => 'required|string|max:50',    
            ]);
            
            $registro = Maestro::create($validatedDatos);
            
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
public function show(Maestro $maestro)
{
    //
}

/**
* Show the form for editing the specified resource.
*/
public function edit(Maestro $maestro)
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
            'rfc' => 'required|string|min:13|max:13',
            'nombre' => 'required|string|max:30',
            'apellido' => 'required|string|max:50',
                
        ]);
    
        $maestro = Maestro::findOrFail($id);
        $maestro->update($validatedData);
    
        return response()->json([
            'message' => 'Maestro actualizado correctamente',
            'data' => $maestro
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
public function destroy(Maestro $maestro)
{
    try {
        $maestro->delete();
        return response()->json(['message' => 'Maestro archivado correctamente.'], 200);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Ocurrió un error al archivar el maestro.',
            'message' => $e->getMessage(),
        ], 500);
    }
}

public function restaurar($id)
{
    try {
        $maestro = Maestro::onlyTrashed()->findOrFail($id);
        $maestro->restore();
        return response()->json(['message' => 'Maestro restaurado'], 200); 

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json([
            'error' => 'Maestro no encontrado.',
            'message' => $e->getMessage(),
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Ocurrió un error al restaurar el maestro.',
            'message' => $e->getMessage(),
        ], 500);
    }
}

}
