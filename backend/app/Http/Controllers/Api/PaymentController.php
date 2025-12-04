<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function addPayment(Request $request)
    {
        // Validate request
        $request->validate([
            'booking_id'     => 'required|integer',
            'payment_method' => 'required|string|max:50',
            'amount_paid'    => 'required|numeric',
        ]);

        $booking_id = $request->booking_id;
        $payment_method = $request->payment_method;
        $amount_paid = $request->amount_paid;

        try {
            // Insert payment using raw SQL
            DB::insert(
                'INSERT INTO payments (booking_id, payment_method, amount_paid, created_at, updated_at)
                 VALUES (?, ?, ?, NOW(), NOW())',
                [$booking_id, $payment_method, $amount_paid]
            );

            // Fetch the inserted payment
            $lastId = DB::getPdo()->lastInsertId();
            $payment = DB::select('SELECT * FROM payments WHERE payment_id = ? LIMIT 1', [$lastId]);

            return response()->json([
                'success' => true,
                'message' => 'Payment saved successfully!',
                'payment' => $payment[0] ?? null
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
