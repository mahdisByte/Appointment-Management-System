<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    /**
     * Get logged-in user or admin profile
     */
    public function getProfile(Request $request)
    {
        try {
            $token = JWTAuth::getToken();
            $user = null;
            $isAdmin = false;

            // Try user guard
            try {
                $user = JWTAuth::setToken($token)->authenticate();
            } catch (\Exception $e) {
                // Try admin guard
                try {
                    $user = JWTAuth::setToken($token)->guard('admin')->authenticate();
                    $isAdmin = true;
                } catch (\Exception $ex) {
                    return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
                }
            }

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_verified' => $user->is_verified ?? null,
                    'application_status' => $user->application_status ?? null,
                    'profile_picture' => $user->profile_picture ?? null,
                    'created_at' => $user->created_at,
                    'is_admin' => $isAdmin,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not retrieve profile.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update profile picture for user or admin
     */
    public function updatePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|url'
        ]);

        try {
            $token = JWTAuth::getToken();
            $user = null;

            // Try user guard
            try {
                $user = JWTAuth::setToken($token)->authenticate();
            } catch (\Exception $e) {
                // Try admin guard
                try {
                    $user = JWTAuth::setToken($token)->guard('admin')->authenticate();
                } catch (\Exception $ex) {
                    return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
                }
            }

            $user->update([
                'profile_picture' => $request->profile_picture
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile picture updated successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile picture',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ... you can add other shared profile methods here
}
