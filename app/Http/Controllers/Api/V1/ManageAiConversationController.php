<?php

namespace App\Http\Controllers\Api\V1;

use App\Ai\Services\AiConversationAdminService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\SendAiFollowUpRequest;
use App\Http\Resources\Api\V1\AiConversationResource;
use App\Models\AiConversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use RuntimeException;
use Throwable;

class ManageAiConversationController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $conversations = AiConversation::query()
            ->select([
                'id',
                'session_id',
                'locale',
                'visitor_name',
                'visitor_email',
                'status',
                'message_count',
                'preview',
                'booking_id',
                'visitor_profile',
                'lead_payload',
                'summary',
                'follow_up_sent_at',
                'last_message_at',
                'created_at',
            ])
            ->latest('last_message_at')
            ->latest('id')
            ->get();

        return AiConversationResource::collection($conversations);
    }

    public function show(AiConversation $aiConversation): AiConversationResource
    {
        return (new AiConversationResource($aiConversation))->withMessages();
    }

    public function summarize(
        AiConversation $aiConversation,
        AiConversationAdminService $adminService,
    ): JsonResponse {
        try {
            $conversation = $adminService->summarize($aiConversation);
        } catch (Throwable $exception) {
            return response()->json([
                'message' => $exception->getMessage() ?: 'Could not summarize this conversation.',
            ], 422);
        }

        return response()->json(
            (new AiConversationResource($conversation))->withMessages()->resolve()
        );
    }

    public function draftFollowUp(
        AiConversation $aiConversation,
        AiConversationAdminService $adminService,
    ): JsonResponse {
        try {
            $draft = $adminService->draftFollowUp($aiConversation);
        } catch (Throwable $exception) {
            return response()->json([
                'message' => $exception->getMessage() ?: 'Could not draft a follow-up email.',
            ], 422);
        }

        return response()->json([
            'subject' => 'Following up on your chat with Samah AI',
            'message' => $draft,
        ]);
    }

    public function sendFollowUp(
        SendAiFollowUpRequest $request,
        AiConversation $aiConversation,
        AiConversationAdminService $adminService,
    ): JsonResponse {
        try {
            $conversation = $adminService->sendFollowUp($aiConversation, $request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        } catch (Throwable $exception) {
            return response()->json([
                'message' => $exception->getMessage() ?: 'Could not send the follow-up email.',
            ], 500);
        }

        return response()->json([
            ...(new AiConversationResource($conversation))->withMessages()->resolve(),
            'message' => 'Follow-up email sent.',
        ]);
    }
}
