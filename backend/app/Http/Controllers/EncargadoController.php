<?php

namespace App\Http\Controllers;

use App\Models\Encargado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Auth;

class EncargadoController extends Controller
{
    public function index(Request $request)
    {
        try {
            $verArchivados = $request->query('verArchivados') === 'true';
            if ($verArchivados) {
                $encargados = Encargado::onlyTrashed()->get(); 
            } else {
                $encargados = Encargado::all(); 
            }
            return response()->json($encargados);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al obtener los encargados.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedDatos = $request->validate([
                'email' => 'required|email|min:10|unique:encargados,email', 
                'nombre' => 'required|string|max:30',
                'apellido' => 'required|string|max:50',  
                'password' => 'required|string|min:8', 
                
            ]);

            // Encriptar la contraseña
            $validatedDatos['password'] = Hash::make($validatedDatos['password']);
            $validatedDatos['is_admin'] = false;
            $registro = Encargado::create($validatedDatos);
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
            'email' => 'required|string|min:10|unique:encargados,email,' . $id,
            'nombre' => 'required|string|max:30',
            'apellido' => 'required|string|max:50',
            'password' => 'nullable|string|min:8',
        ]);
        if (!empty($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        } else {
            unset($validatedData['password']);
        }
        $encargado = Encargado::findOrFail($id);
        unset($validatedData['is_admin']); 
        $encargado->update($validatedData);
        return response()->json([
            'message' => 'Encargado actualizado correctamente',
            'data' => $encargado
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


    public function destroy(Encargado $encargado)
    {
        try {
            $encargado->delete();
            return response()->json(['message' => 'Encargado archivado correctamente.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al archivar el encargado.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function restaurar($id)
    {
        try {
            $encargado = Encargado::onlyTrashed()->findOrFail($id);
            $encargado->restore();
            return response()->json(['message' => 'Encargado restaurado'], 200); 
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Encargado no encontrado.',
                'message' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al restaurar el encargado.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);
        
            $user = Encargado::where('email', $request->email)->first();
        
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Credenciales inválidas'], 401);
            }
    
            $token = JWTAuth::fromUser($user);
    
            return response()->json([
                'token' => $token,
                'user' => [
                    'name' => $user->nombre . ' ' . $user->apellido,
                    'email' => $user->email,
                    'is_admin' => (bool) $user->is_admin,
                ],
            ]);
        } catch (\Throwable $e) {
            \Log::error('Error en login: ' . $e->getMessage());
            return response()->json(['error' => 'Error en el servidor'], 500);
        }
    }
    
    public function logout()
    {
        Auth::guard('encargado')->logout();

        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    public function user()
    {
        return response()->json(Auth::guard('encargado')->user());
    }

        public function perfil()
    {
        return response()->json(auth()->user());
    }

    public function actualizarPerfil(Request $request)
    {
        $encargado = auth()->user();

        $validated = $request->validate([
            'email' => 'nullable|email|unique:encargados,email,' . $encargado->id,
            'password' => 'nullable|string|min:8',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }
        $encargado->update($validated);

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'data' => $encargado,
        ]);
    }


}
