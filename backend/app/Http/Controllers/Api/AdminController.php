<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // Get all pending provider applications
    public function pendingProviders()
    {
        $pendingUsers = DB::select("SELECT id, name, email, created_at FROM users WHERE role = 'provider' AND status = 'pending' ORDER BY id ASC");
        return response()->json($pendingUsers);
    }

    // Approve provider
    public function approveProvider($id)
    {
        DB::update("UPDATE users SET status = 'approved' WHERE id = ?", [$id]);
        return response()->json(['message' => 'Provider approved']);
    }

    // Reject provider
    public function rejectProvider($id)
    {
        DB::update("UPDATE users SET status = 'rejected' WHERE id = ?", [$id]);
        return response()->json(['message' => 'Provider rejected']);
    }
}
