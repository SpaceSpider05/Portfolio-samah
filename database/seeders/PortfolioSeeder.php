<?php

namespace Database\Seeders;

use App\Models\AboutProfile;
use App\Models\Achievement;
use App\Models\Project;
use App\Models\Service;
use App\Models\TimelineEvent;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        $about = AboutProfile::query()->updateOrCreate(
            ['name' => 'Samah'],
            [
                'role' => 'Digital Marketing Strategist',
                'photo_url' => '/images/about-portrait.jpg',
                'bio' => 'A decade of crafting brand systems, performance campaigns, and immersive digital experiences for ambitious companies.',
                'mission' => 'To prove marketing quality through the product itself — every scroll, every interaction, every detail.',
                'is_active' => true,
            ],
        );

        TimelineEvent::query()->where('about_profile_id', $about->id)->delete();
        Achievement::query()->where('about_profile_id', $about->id)->delete();

        $timeline = [
            ['year' => '2016', 'title' => 'First agency role', 'description' => 'Cut teeth on multi-channel campaigns for lifestyle brands.'],
            ['year' => '2019', 'title' => 'Independent studio', 'description' => 'Launched a boutique practice focused on premium digital growth.'],
            ['year' => '2022', 'title' => 'Product-led marketing', 'description' => 'Merged design systems with performance media for SaaS and retail.'],
            ['year' => '2025', 'title' => 'Immersive experiences', 'description' => 'Building cinematic web products that sell the craft, not just the claim.'],
        ];

        foreach ($timeline as $index => $item) {
            TimelineEvent::query()->create([
                ...$item,
                'about_profile_id' => $about->id,
                'sort_order' => $index,
            ]);
        }

        foreach ([
            ['label' => 'Awards', 'value' => 18, 'suffix' => '+'],
            ['label' => 'Campaigns', 'value' => 240, 'suffix' => '+'],
            ['label' => 'Markets', 'value' => 12, 'suffix' => ''],
        ] as $index => $item) {
            Achievement::query()->create([
                ...$item,
                'about_profile_id' => $about->id,
                'sort_order' => $index,
            ]);
        }

        Service::query()->upsert([
            [
                'slug' => 'seo',
                'title' => 'SEO Strategy',
                'description' => 'Technical foundations, content architecture, and ranking systems that compound.',
                'hover_demo' => 'seo',
                'cta' => 'Climb the ranks',
                'is_published' => true,
                'sort_order' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'social-media',
                'title' => 'Social Media',
                'description' => 'Editorial calendars, creative systems, and community loops that feel native.',
                'hover_demo' => 'social',
                'cta' => 'Grow the feed',
                'is_published' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'paid-ads',
                'title' => 'Paid Ads',
                'description' => 'Precision acquisition across Meta, Google, and LinkedIn with creative that converts.',
                'hover_demo' => 'ads',
                'cta' => 'Scale spend',
                'is_published' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['slug'], ['title', 'description', 'hover_demo', 'cta', 'is_published', 'sort_order', 'updated_at']);

        Project::query()->upsert([
            [
                'slug' => 'lumen-retail',
                'title' => 'Lumen Retail Rebrand',
                'client' => 'Lumen Co.',
                'category' => 'Brand + Performance',
                'summary' => 'A full-funnel relaunch that turned a regional retailer into a digital-first brand.',
                'challenge' => 'Fragmented messaging and declining organic reach across three markets.',
                'solution' => 'Unified brand system, SEO content hubs, and social commerce creative tested weekly.',
                'results' => json_encode(['+186% organic traffic', '3.2x ROAS', '41% lift in AOV']),
                'technologies' => json_encode(['Next.js', 'GA4', 'Meta Ads', 'Contentful']),
                'cover_image' => '/images/project-lumen.svg',
                'video_preview' => null,
                'is_published' => true,
                'status' => 'completed',
                'sort_order' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'northline-saas',
                'title' => 'Northline SaaS Growth',
                'client' => 'Northline',
                'category' => 'Demand Gen',
                'summary' => 'Pipeline acceleration for a B2B analytics platform entering enterprise.',
                'challenge' => 'High CAC and weak demo conversion from paid channels.',
                'solution' => 'Account-based creative, LinkedIn experiments, and landing experiences tuned to ICP.',
                'results' => json_encode(['-38% CAC', '+92% demo bookings', '2.1x pipeline']),
                'technologies' => json_encode(['HubSpot', 'LinkedIn Ads', 'Framer', 'Looker']),
                'cover_image' => '/images/project-northline.svg',
                'video_preview' => null,
                'is_published' => true,
                'status' => 'completed',
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'atelier-social',
                'title' => 'Atelier Social Engine',
                'client' => 'Atelier Maison',
                'category' => 'Social + Content',
                'summary' => 'A content operating system that made a luxury label culturally fluent online.',
                'challenge' => 'Beautiful product, quiet presence — no consistent narrative on social.',
                'solution' => 'Editorial pillars, short-form production system, and creator micro-collaborations.',
                'results' => json_encode(['12M+ campaign reach', '+240% engagement', 'Sold-out drop in 6 hours']),
                'technologies' => json_encode(['Instagram', 'TikTok', 'CapCut', 'Notion']),
                'cover_image' => '/images/project-atelier.svg',
                'video_preview' => null,
                'is_published' => true,
                'status' => 'completed',
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['slug'], [
            'title', 'client', 'category', 'summary', 'challenge', 'solution', 'results',
            'technologies', 'cover_image', 'video_preview', 'is_published', 'status', 'sort_order', 'updated_at',
        ]);
    }
}
