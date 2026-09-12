import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { analyzeProtocolHealth } from '@/lib/ai/impactlens';
import { INITIAL_CAMPAIGN, INITIAL_RESPONDERS, INITIAL_PACKAGES } from '@/lib/demo/data';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getServerAiCredentials(): { apiKey?: string; model: string } {
  let apiKey = process.env.AI_API_KEY;
  let model = process.env.AI_MODEL || 'gemini-1.5-flash';

  if (!apiKey) {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (trimmed.startsWith('AI_API_KEY=')) {
            apiKey = trimmed.slice('AI_API_KEY='.length).trim();
          }
          if (trimmed.startsWith('AI_MODEL=')) {
            model = trimmed.slice('AI_MODEL='.length).trim();
          }
        }
      }
    } catch {}
  }

  return { apiKey, model };
}

/**
 * @file app/api/ai/impact/route.ts
 * @notice ImpactLens Deterministic Audit & AI Oracle API Route
 * @dev Read-only execution of deterministic rules with optional AI explanation layer.
 */
export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Use defaults if empty body
    }

    const campaign = body.campaign || INITIAL_CAMPAIGN;
    const responders = body.responders || INITIAL_RESPONDERS;
    const packages = body.packages || INITIAL_PACKAGES;

    const creds = getServerAiCredentials();
    const report = await analyzeProtocolHealth(campaign, responders, packages, creds);

    return NextResponse.json({
      status: 'SUCCESS',
      report,
      engine: report.engine || 'Deterministic Audit Engine',
      model: report.model || creds.model,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'FAILED',
        error: err?.message || 'Failed to generate AI impact report',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const creds = getServerAiCredentials();
  const report = await analyzeProtocolHealth(INITIAL_CAMPAIGN, INITIAL_RESPONDERS, INITIAL_PACKAGES, creds);
  return NextResponse.json({
    status: 'SUCCESS',
    report,
    engine: report.engine || 'Deterministic Audit Engine',
    model: report.model || creds.model,
    debug: {
      hasKey: Boolean(creds.apiKey),
      keyLen: creds.apiKey?.length,
      model: creds.model,
      engine: report.engine,
    },
    timestamp: new Date().toISOString(),
  });
}
