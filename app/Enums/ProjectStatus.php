<?php

namespace App\Enums;

enum ProjectStatus: string
{
    case Draft = 'draft';
    case InProgress = 'in_progress';
    case Completed = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::InProgress => 'In progress',
            self::Completed => 'Completed',
        };
    }
}
