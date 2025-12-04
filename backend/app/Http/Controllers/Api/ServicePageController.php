<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class ServicePageController extends Controller
{
    // Show single service
    public function show($services_id)
    {
        $service = DB::selectOne(
            "SELECT * FROM services WHERE services_id = ?",
            [$services_id]
        );

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found'
            ], 404);
        }

        $image = DB::selectOne(
            "SELECT path FROM images WHERE user_id = ? LIMIT 1",
            [$service->user_id]
        );

        $service->profile_picture = $image ? $image->path : 'default.jpeg';

        // Booking availability
        $availability = DB::selectOne(
            "SELECT is_booked FROM service_availabilities WHERE services_id = ?",
            [$service->services_id]
        );
        $service->is_booked = $availability ? (bool)$availability->is_booked : false;

        return response()->json([
            'success' => true,
            'service' => $service
        ]);
    }

    // Add booking
    public function addBookings(Request $request)
    {
        $request->validate([
            'services_id' => 'required|integer',
            'user_id' => 'required|integer',
            'booking_time' => 'required|string',
        ]);

        $bookingId = DB::table('bookings')->insertGetId([
            'services_id' => $request->services_id,
            'user_id' => $request->user_id,
            'booking_time' => $request->booking_time,
            'status' => false,
            'payment_status' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::update(
            "UPDATE service_availabilities SET is_booked = 1, updated_at = NOW() WHERE services_id = ?",
            [$request->services_id]
        );

        $booking = DB::selectOne(
            "SELECT * FROM bookings WHERE booking_id = ?",
            [$bookingId]
        );

        return response()->json([
            'success' => true,
            'message' => 'Booking completed successfully!',
            'booking' => $booking
        ]);
    }

    // Get bookings for logged-in user
    public function getUserBookings()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $userId = $user->id;

            $bookings = DB::table('bookings')
                ->where('user_id', $userId)
                ->get();

            return response()->json([
                'success' => true,
                'bookings' => $bookings
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated or token invalid'
            ], 401);
        }
    }
}
