<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    /**
     * Send a message to Gemini API
     */
    public function sendMessage(Request $request)
    {
        $message = $request->input('message');

        if (!$message) {
            return response()->json(['error' => 'Message is required'], 400);
        }

        // ✅ Use a valid Gemini model (replace with one from /gemini-models)
        $modelName = "models/gemini-2.5-pro";
        $endpoint = "https://generativelanguage.googleapis.com/v1beta/{$modelName}:generateContent?key=" . env('GEMINI_API_KEY');

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])
            // ⚡ Disable SSL verification temporarily if you have certificate issues
            ->withoutVerifying()
            ->post($endpoint, [
                'contents' => [
                    ['parts' => [['text' => $message]]]
                ]
            ]);

            if ($response->failed()) {
                Log::error('Gemini API failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return response()->json([
                    'error' => 'Gemini API request failed',
                    'status' => $response->status(),
                    'body' => $response->json()
                ], 500);
            }

            return response()->json($response->json());

        } catch (\GuzzleHttp\Exception\RequestException $e) {
            Log::error('Gemini RequestException: ' . $e->getMessage());
            return response()->json([
                'error' => 'RequestException',
                'message' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            Log::error('General Exception: ' . $e->getMessage());
            return response()->json([
                'error' => 'Exception',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Optional: List available Gemini models
     */
    public function listModels()
    {
        $endpoint = "https://generativelanguage.googleapis.com/v1beta/models?key=" . env('GEMINI_API_KEY');

        try {
            $response = Http::get($endpoint);

            if ($response->failed()) {
                Log::error('Failed to fetch Gemini models', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return response()->json([
                    'error' => 'Failed to retrieve models list',
                    'details' => $response->body()
                ], 500);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            Log::error('Exception fetching models: ' . $e->getMessage());
            return response()->json([
                'error' => 'Exception',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
