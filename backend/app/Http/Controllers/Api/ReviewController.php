<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function addReview(Request $request)
    {
        // Validate input
        $request->validate([
            'services_id' => 'required|integer',
            'rating'      => 'required|integer|min:0|max:5',
            'comment'     => 'required|string|max:100',
        ]);

        $services_id = $request->services_id;
        $rating = $request->rating;
        $comment = $request->comment;

        try {
            // Insert review using raw SQL
            DB::insert(
                'INSERT INTO reviews (services_id, rating, comment, created_at, updated_at)
                 VALUES (?, ?, ?, NOW(), NOW())',
                [$services_id, $rating, $comment]
            );

            // Fetch the inserted review
            $lastId = DB::getPdo()->lastInsertId();
            $review = DB::select('SELECT * FROM reviews WHERE review_id = ? LIMIT 1', [$lastId]);

            return response()->json([
                'success' => true,
                'message' => 'Review submitted successfully',
                'review' => $review[0] ?? null
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Operation failed. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
