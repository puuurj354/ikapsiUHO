<?php

namespace App\Http\Middleware;

use App\Enums\Role;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Anda harus login terlebih dahulu.');
        }

        /** @var User $user */
        $user = Auth::user();

        // Check if user has admin role
        if (!$user->isAdmin()) {
            // Redirect non-admin users to their appropriate dashboard
            return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki akses ke halaman admin.');
        }

        return $next($request);
    }
}
