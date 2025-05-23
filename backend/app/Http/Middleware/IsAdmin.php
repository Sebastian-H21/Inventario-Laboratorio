<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::guard('encargado')->user();

        if (!$user || !$user->is_admin) {
            return response()->json(['message' => 'Acceso no autorizado.'], 403);
        }

        return $next($request);
    }
}

