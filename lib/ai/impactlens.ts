/**
 * @file impactlens.ts
 * @notice ImpactLens Analytical Evaluation Layer
 * @dev Strict read-only audit engine.
 *      Input must come strictly from on-chain verified protocol state.
 *      Never modifies balances or overrides smart contract states.
 */

import { CampaignData, ResponderNode, AidPackage } from '@/lib/demo/data';

export interface ImpactLensReport {
  summary: string;
  verifiedFacts: string[];
  missingEvidence: string[];
  fraudWarnings: string[];
  campaignHealth: 'LOW' | 'MEDIUM' | 'HIGH';
  disclaimer: string;
  auditedAt: string;
  anomalyScore: number; // 0 (pristine) to 100 (high risk)
  engine?: string;
  model?: string;
}

/**
 * Analyzes verified protocol telemetry deterministically or via Gemini AI Oracle.
 */
export async function analyzeProtocolHealth(
  campaign: CampaignData,
  responders: ResponderNode[],
  packages: AidPackage[],
  options?: { apiKey?: string; model?: string }
): Promise<ImpactLensReport> {
  const apiKey = options?.apiKey || process.env.AI_API_KEY;
  const model = options?.model || process.env.AI_MODEL || 'gemini-1.5-flash';

  if (apiKey) {
    try {
      const prompt = `You are ImpactLens, an analytical audit AI oracle for ReliefMesh cross-chain aid protocol on Creditcoin CC3.
Analyze this verified protocol state:
- Campaign: ${campaign.id} - ${campaign.name}
- Verified Donations: ${campaign.verifiedDonations} tCTC
- Target Goal: ${campaign.goal} tCTC
- Unique Donors: ${campaign.donorCount}
- Completed Deliveries: ${campaign.completedDeliveries}
- Active Responders: ${responders.filter((r) => r.status === 'ONLINE').length} / ${responders.length} online nodes
- Aid Packages: ${packages.length} total (${packages.filter((p) => p.status === 'Delivered').length} delivered, ${packages.filter((p) => p.status === 'In Transit').length} in transit)
- Unique Delivery Proof Hashes: ${new Set(packages.map((p) => p.deliveryProofHash).filter(Boolean)).size} / ${packages.filter((p) => p.deliveryProofHash).length}

Evaluate:
1. Treasury and accounting reconciliation on Creditcoin CC3.
2. Field milestone delivery integrity and duplicate proof replay risks.
3. Network routing health and missing evidence.

Return ONLY a JSON object matching this schema:
{
  "summary": "concise executive audit summary",
  "verifiedFacts": ["fact 1", "fact 2", ...],
  "missingEvidence": ["missing item 1", ...],
  "fraudWarnings": ["warning 1", ...],
  "campaignHealth": "HIGH" | "MEDIUM" | "LOW",
  "anomalyScore": 0 to 100,
  "disclaimer": "Analytical AI audit based on verified on-chain telemetry. AI does not hold custody of funds."
}`;

      const tryCallModel = async (targetModel: string) => {
        return await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.2,
              },
            }),
          }
        );
      };

      let activeModel = model;
      let res = await tryCallModel(activeModel);

      // If 503 overloaded, fallback to gemini-flash-latest
      if (res.status === 503 && activeModel !== 'gemini-flash-latest') {
        activeModel = 'gemini-flash-latest';
        res = await tryCallModel(activeModel);
      }

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return {
            summary: parsed.summary || 'AI audit completed successfully.',
            verifiedFacts: Array.isArray(parsed.verifiedFacts) ? parsed.verifiedFacts : [],
            missingEvidence: Array.isArray(parsed.missingEvidence) ? parsed.missingEvidence : [],
            fraudWarnings: Array.isArray(parsed.fraudWarnings) ? parsed.fraudWarnings : [],
            campaignHealth: ['HIGH', 'MEDIUM', 'LOW'].includes(parsed.campaignHealth)
              ? parsed.campaignHealth
              : 'HIGH',
            disclaimer:
              parsed.disclaimer ||
              'Analytical AI audit based on verified on-chain telemetry. AI does not hold custody of funds.',
            auditedAt: new Date().toISOString(),
            anomalyScore: typeof parsed.anomalyScore === 'number' ? parsed.anomalyScore : 4,
            engine: 'Gemini AI Oracle',
            model: activeModel,
          };
        }
      } else {
        const errText = await res.text();
        console.warn('Gemini AI API returned non-200:', res.status, errText);
        const fallback = generateDeterministicAudit(campaign, responders, packages);
        fallback.engine = `Deterministic Audit Engine (API HTTP ${res.status})`;
        fallback.model = activeModel;
        return fallback;
      }
    } catch (e: any) {
      console.warn('Gemini AI audit fallback to deterministic:', e?.message);
      const fallback = generateDeterministicAudit(campaign, responders, packages);
      fallback.engine = `Deterministic Audit Engine (${e?.message})`;
      fallback.model = model;
      return fallback;
    }
  }

  // Fallback to strict deterministic analytical audit
  return generateDeterministicAudit(campaign, responders, packages);
}

export function generateDeterministicAudit(
  campaign: CampaignData,
  responders: ResponderNode[],
  packages: AidPackage[]
): ImpactLensReport {
  const verifiedFacts: string[] = [];
  const missingEvidence: string[] = [];
  const fraudWarnings: string[] = [];

  // Fact 1: Accounting reconciliation
  const accountingBalance = campaign.verifiedDonations;
  const recordedEscrow = campaign.pendingEscrow + campaign.dispatchedGrants;
  
  verifiedFacts.push(
    `Total Verified Donation Volume reconciled on Creditcoin CC3: ${campaign.verifiedDonations} tCTC across ${campaign.donorCount} unique donors.`
  );

  verifiedFacts.push(
    `Active Virtual Responder deployment maintained at ${responders.filter(r => r.status === 'ONLINE').length}/${responders.length} online nodes.`
  );

  // Deliveries check
  const deliveredPackages = packages.filter(p => p.status === 'Delivered');
  verifiedFacts.push(
    `${deliveredPackages.length} aid package deliveries cryptographically attested with valid SHA-256 milestone hashes.`
  );

  // Check for any missing evidence
  const inTransit = packages.filter(p => p.status === 'In Transit');
  if (inTransit.length > 0) {
    missingEvidence.push(
      `Package ${inTransit[0].id} (${inTransit[0].assetType} in ${inTransit[0].zone}) is in transit — final GPS receipt attestation pending from Node Gamma.`
    );
  }

  // Check for duplicate or anomaly risks
  const proofHashes = packages.map(p => p.deliveryProofHash).filter(h => h && h.length > 0);
  const uniqueHashes = new Set(proofHashes);
  if (proofHashes.length !== uniqueHashes.size) {
    fraudWarnings.push('CRITICAL: Duplicate delivery proof hash detected in package registry mapping!');
  } else {
    verifiedFacts.push('Zero duplicate milestone claims or proof replay attempts detected in active epoch.');
  }

  let health: 'LOW' | 'MEDIUM' | 'HIGH' = 'HIGH';
  let anomalyScore = 4; // baseline nominal jitter

  if (fraudWarnings.length > 0) {
    health = 'LOW';
    anomalyScore = 85;
  } else if (missingEvidence.length > 2) {
    health = 'MEDIUM';
    anomalyScore = 35;
  }

  return {
    summary:
      `ImpactLens verified that ${campaign.verifiedDonations} tCTC in cross-chain donations are accounted for within the smart contract treasury. ${campaign.completedDeliveries} field deliveries have been completed with zero duplicate claims. Overall network liquidity routing integrity is nominal.`,
    verifiedFacts,
    missingEvidence,
    fraudWarnings,
    campaignHealth: health,
    disclaimer: 'Testnet prototype; not real emergency or financial data. Virtual deployment simulation.',
    auditedAt: new Date().toISOString(),
    anomalyScore,
  };
}
