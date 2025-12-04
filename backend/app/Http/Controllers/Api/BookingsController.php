<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingsController extends Controller
{
    // Fetch bookings for services created by logged-in user
    public function index(Request $request)
    {
        $user = auth('api')->user(); // logged-in user
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        // Nested query: get all bookings for services created by this user
        $bookings = DB::select("
            SELECT b.*, s.name as service_name, u.name as booked_by
            FROM bookings b
            INNER JOIN services s ON b.services_id = s.services_id
            INNER JOIN users u ON b.user_id = u.id
            WHERE s.user_id = ?
            ORDER BY b.booking_id DESC
        ", [$user->id]);

        return response()->json([
            'success' => true,
            'bookings' => $bookings
        ]);
    }

    public function cancel($id)
    {
        // Delete the booking record
        $deleted = DB::table('bookings')->where('booking_id', $id)->delete();

        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => 'Booking deleted successfully'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }
    }



    public function confirm($id)
    {
        $updated = DB::table('bookings')
            ->where('booking_id', $id)
            ->update(['status' => true]);

        if ($updated) {
            return response()->json([
                'success' => true,
                'message' => 'Booking confirmed'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found or already confirmed'
            ], 404);
        }
    }

    public function available($id)
    {
        // First, get the service ID for this booking
        $booking = DB::table('bookings')->where('booking_id', $id)->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }

        // Update is_booked to false in service_availabilities
        $updated = DB::table('service_availabilities')
            ->where('services_id', $booking->services_id)
            ->update(['is_booked' => false, 'updated_at' => now()]);

        if ($updated) {
            return response()->json([
                'success' => true,
                'message' => 'Service marked as available'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update service availability'
            ], 500);
        }
    }


}
