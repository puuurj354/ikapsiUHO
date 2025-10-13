<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    /**
     * Display users list
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $role = $request->query('role');
        $angkatan = $request->query('angkatan');

        $query = User::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role && $role !== 'all') {
            $query->where('role', $role);
        }

        if ($angkatan && $angkatan !== 'all') {
            $query->where('angkatan', $angkatan);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role,
                'angkatan' => $angkatan,
            ],
        ]);
    }

    /**
     * Store new user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::defaults()],
            'role' => 'required|in:ADMIN,ALUMNI,admin,alumni', // Support both uppercase dan lowercase
            'angkatan' => 'nullable|string|max:4',
            'profesi' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'profile_picture' => 'nullable|image|max:2048',
        ]);

        // Convert role ke lowercase (enum format)
        $validated['role'] = strtolower($validated['role']);

        $validated['password'] = Hash::make($validated['password']);
        $validated['email_verified_at'] = now();

        if ($request->hasFile('profile_picture')) {
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile-pictures', 'public');
        }

        User::create($validated);

        return back()->with('success', 'User berhasil ditambahkan.');
    }

    /**
     * Update user
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => ['nullable', Password::defaults()],
            'role' => 'required|in:ADMIN,ALUMNI,admin,alumni', // Support both uppercase dan lowercase
            'angkatan' => 'nullable|string|max:4',
            'profesi' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'profile_picture' => 'nullable|image|max:2048',
        ]);

        // Convert role ke lowercase (enum format)
        $validated['role'] = strtolower($validated['role']);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        if ($request->hasFile('profile_picture')) {
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile-pictures', 'public');
        }

        $user->update($validated);

        return back()->with('success', 'User berhasil diperbarui.');
    }

    /**
     * Delete user
     */
    public function destroy(User $user)
    {
        /** @var User $authUser */
        $authUser = Auth::user();

        if ($user->id === $authUser->id) {
            return back()->with('error', 'Tidak dapat menghapus akun sendiri.');
        }

        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        $user->delete();

        return back()->with('success', 'User berhasil dihapus.');
    }
}
