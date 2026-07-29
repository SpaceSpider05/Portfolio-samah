<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\CreateBooking;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreBookingRequest;
use App\Http\Resources\Api\V1\BookingResource;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BookingController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $bookings = Booking::query()
            ->latest()
            ->get();

        return BookingResource::collection($bookings);
    }

    public function store(StoreBookingRequest $request, CreateBooking $createBooking): JsonResponse
    {
        $booking = $createBooking->execute($request->validated());

        return response()->json([
            ...(new BookingResource($booking))->resolve(),
            'message' => 'Your booking request has been received. A confirmation email is on its way.',
        ], 201);
    }
}
