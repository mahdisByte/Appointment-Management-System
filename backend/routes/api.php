<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServicesController;
use App\Http\Controllers\Api\ServicePageController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\UserAuthController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\AdminProfileController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\Api\ProviderApplicationController;
use App\Http\Controllers\Api\UserSettingsController; // ✅ make sure this is imported


use Illuminate\Http\Request;
use App\Http\Controllers\UserController;

use App\Http\Controllers\Api\BookingsController;
// ----------------------------
// Public Routes
// ----------------------------
Route::post('/chatbot', [ChatbotController::class, 'sendMessage']);

// User Auth
Route::post('signup', [UserAuthController::class, 'signup']);
Route::post('login', [UserAuthController::class, 'login']);

// Admin Auth
Route::post('admin/login', [AdminAuthController::class, 'login']);

// Public Services & Contact
Route::get('services', [ServicesController::class, 'home_card']);
Route::get('services/{services_id}', [ServicesController::class, 'show']);
Route::get('service/{services_id}', [ServicePageController::class, 'show']);
Route::post('/contact', [ContactController::class, 'store']);


// -------------------------------------
// Protected Routes (User JWT - auth:api)
// -------------------------------------
Route::middleware('auth:api')->group(function () {
    // Auth
    Route::post('logout', [UserAuthController::class, 'logout']);
    Route::get('me', [UserAuthController::class, 'me']);
    Route::post('refresh', [UserAuthController::class, 'refresh']);

    // Profile (basic info + settings)
    Route::get('profile', [ProfileController::class, 'getProfile']);
    Route::put('profile/update-picture', [ProfileController::class, 'updatePicture']);

    // Settings (name/email/delete)
    Route::put('profile/update-name', [UserSettingsController::class, 'updateName']);
    Route::put('profile/update-email', [UserSettingsController::class, 'updateEmail']);
    Route::delete('profile', [UserSettingsController::class, 'deleteProfile']);

    // Provider Application
    Route::post('/provider-applications', [ProviderApplicationController::class, 'store']);

    // Services & Bookings
    Route::post('services', [ServicesController::class, 'addService']);
    Route::post('addBookings', [ServicePageController::class, 'addBookings']);
    Route::get('bookings', [ServicePageController::class, 'getBookings']);
    Route::get('my-bookings', [ServicePageController::class, 'getUserBookings']);

    // New route: fetch services created by logged-in user
    Route::get('my-services', [ServicesController::class, 'myServices']);

    // Other
    Route::post('addReview', [ReviewController::class, 'addReview']);
    Route::post('addPayment', [PaymentController::class, 'addPayment']);
    Route::get('search', [SearchController::class, 'search']);

    //User delete route
    Route::delete('services/{services_id}', [ServicesController::class, 'destroy']);

    Route::get('provider-bookings', [BookingsController::class, 'index']); // bookings for services created by logged-in user
    Route::put('bookings/{id}/cancel', [BookingsController::class, 'cancel']);
    Route::put('bookings/{id}/available', [BookingsController::class, 'available']);
    Route::put('bookings/{id}/confirm', [BookingsController::class, 'confirm']);
    });


// ---------------------------------------
// Protected Routes (Admin JWT - auth:admin)
// ---------------------------------------
Route::middleware('auth:admin')->group(function () {
    // Profile
    Route::get('admin/profile', [AdminProfileController::class, 'getProfile']);
    Route::get('admin-services', [ServicesController::class, 'adminServices']);

    Route::delete('admin/services/{services_id}', [ServicesController::class, 'destroy']);
    Route::post('admin/logout', [AdminAuthController::class, 'logout']);

    // Application Management
    Route::get('/admin/applications', [ProviderApplicationController::class, 'index']);
    Route::post('/admin/applications/{application}/approve', [ProviderApplicationController::class, 'approve']);
    Route::post('/admin/applications/{application}/reject', [ProviderApplicationController::class, 'reject']);
});
