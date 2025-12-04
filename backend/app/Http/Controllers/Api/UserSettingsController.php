<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class UserSettingsController extends Controller
{

    // 🔑 Update username
    public function updateName(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255'
    ]);

    try {
        $user = JWTAuth::parseToken()->authenticate();
        $user->update(['name' => $request->name]);

        return response()->json([
            'success' => true,
            'msg' => 'Name updated successfully',
            'user' => $user
        ]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'msg' => 'Failed to update name'], 500);
    }
}


    // 🔑 Update email
    public function updateEmail(Request $request)
{
    $request->validate([
        'email' => 'required|email|max:255|unique:users,email'
    ]);

    try {
        $user = JWTAuth::parseToken()->authenticate();
        $user->update(['email' => $request->email]);

        return response()->json([
            'success' => true,
            'msg' => 'Email updated successfully',
            'user' => $user
        ]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'msg' => 'Failed to update email'], 500);
    }
}


    // 🔑 Delete profile
    public function deleteProfile()
{
    try {
        $user = JWTAuth::parseToken()->authenticate();
        $user->delete();

        return response()->json([
            'success' => true,
            'msg' => 'User deleted successfully'
        ]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'msg' => 'Failed to delete user'], 500);
    }
}

}
