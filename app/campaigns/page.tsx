'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { INITIAL_CAMPAIGN, INITIAL_RESPONDERS, INITIAL_PACKAGES, ResponderNode } from '@/lib/demo/data';

export default function CampaignsPage() {
  const [campaign] = useState(INITIAL_CAMPAIGN);
  const [responders] = useState(INITIAL_RESPONDERS);
  const [packages] = useState(INITIAL_PACKAGES);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'WATER' | 'MEDICAL' | 'PROOFS'>('ALL');
  const [selectedNode, setSelectedNode] = useState<ResponderNode | null>(responders[0]);

  const filteredResponders = responders.filter((r) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'WATER') return r.role.includes('Water') || r.role.includes('Hydration');
    if (activeFilter === 'MEDICAL') return r.role.includes('Medical') || r.role.includes('Triage');
    return true;
  });

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Campaign Header Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                <span className="text-xs uppercase tracking-wider text-teal-800 font-bold">
                  ACTIVE DEPLOYMENT CAMPAIGN
                </span>
                <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                  TESTNET SIMULATION
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                {campaign.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Zone: {campaign.region} • On-chain accounting verified on Creditcoin CC3 Testnet.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://creditcoin-testnet.subscan.io"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                <span>CC3 Explorer</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 text-xs">
            <div>
              <span className="text-slate-500">Target Goal</span>
              <div className="font-mono font-bold text-slate-900 text-sm">{campaign.goal} tCTC</div>
            </div>
            <div>
              <span className="text-slate-500">Verified Raised</span>
              <div className="font-mono font-bold text-teal-700 text-sm">{campaign.verifiedDonations} tCTC</div>
            </div>
            <div>
              <span className="text-slate-500">Unique Donors</span>
              <div className="font-mono font-bold text-slate-900 text-sm">{campaign.donorCount}</div>
            </div>
            <div>
              <span className="text-slate-500">Virtual Nodes</span>
              <div className="font-mono font-bold text-slate-900 text-sm">{campaign.responderCount} Active</div>
            </div>
            <div>
              <span className="text-slate-500">Deliveries</span>
              <div className="font-mono font-bold text-slate-900 text-sm">{campaign.completedDeliveries} Inscribed</div>
            </div>
            <div>
              <span className="text-slate-500">Dispatched Rewards</span>
              <div className="font-mono font-bold text-emerald-700 text-sm">{campaign.rewardsDispatched} tCTC</div>
            </div>
          </div>
        </div>

        {/* Coordination Map & Node Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Column (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Simulated Coordination Map</h2>
                  <p className="text-xs text-slate-500">Telemetry topology of virtual aid distribution nodes.</p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setActiveFilter('ALL')}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      activeFilter === 'ALL' ? 'bg-white shadow-xs text-teal-800 font-semibold' : 'text-slate-600'
                    }`}
                  >
                    All Nodes (3)
                  </button>
                  <button
                    onClick={() => setActiveFilter('WATER')}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      activeFilter === 'WATER' ? 'bg-white shadow-xs text-teal-800 font-semibold' : 'text-slate-600'
                    }`}
                  >
                    Water Kits
                  </button>
                  <button
                    onClick={() => setActiveFilter('MEDICAL')}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      activeFilter === 'MEDICAL' ? 'bg-white shadow-xs text-teal-800 font-semibold' : 'text-slate-600'
                    }`}
                  >
                    Medical Units
                  </button>
                </div>
              </div>

              {/* Interactive SVG Radar / Terrain Map */}
              <div className="relative w-full h-80 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-4">
                {/* SVG Grid and Radar Rings */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Terrain Rivers simulation */}
                  <path
                    d="M 0 160 Q 150 120 300 180 T 600 140 T 900 200"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="8"
                    strokeDasharray="4 2"
                  />
                  <path
                    d="M 0 160 Q 150 120 300 180 T 600 140 T 900 200"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="2"
                  />

                  {/* Connection lines between nodes */}
                  <line x1="38%" y1="42%" x2="62%" y2="35%" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="62%" y1="35%" x2="50%" y2="68%" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="38%" y1="42%" x2="50%" y2="68%" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>

                {/* Node Markers */}
                {filteredResponders.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    >
                      <div className="relative flex items-center justify-center">
                        <span
                          className={`absolute w-8 h-8 rounded-full animate-ping opacity-40 ${
                            isSelected ? 'bg-teal-500' : 'bg-slate-400'
                          }`}
                        ></span>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all ${
                            isSelected
                              ? 'bg-teal-700 text-white ring-4 ring-teal-200'
                              : 'bg-white text-slate-700 border border-slate-300 hover:border-teal-500'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {node.role.includes('Water') ? 'water_drop' : node.role.includes('Medical') ? 'medical_services' : 'lunch_dining'}
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200 text-[10px] font-bold text-slate-800">
                        {node.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map Telemetry Footer */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-4 mt-4 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                Brahmaputra Basin Virtual Sensor Grid Active
              </span>
              <span className="font-mono text-[11px]">Mesh Latency: 18ms • Packet Loss: 0.0%</span>
            </div>
          </div>

          {/* Selected Node Details Column (1/3 width) */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            {selectedNode ? (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {selectedNode.id}
                  </span>
                  <span className="text-[11px] font-bold text-teal-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                    {selectedNode.status}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-bold text-slate-900">{selectedNode.name}</h3>
                  <p className="text-xs text-slate-500">{selectedNode.role}</p>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Service Sector:</span>
                    <strong className="text-slate-800 text-right">{selectedNode.zone}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Battery Level:</span>
                    <strong className="text-teal-700">{selectedNode.battery}% Operational</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Reputation Score:</span>
                    <strong className="text-slate-900 font-mono">{selectedNode.reputation}/100</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Completed Drops:</span>
                    <strong className="text-slate-900 font-mono">{selectedNode.deliveries} Verified</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Total Rewards Dispatched:</span>
                    <strong className="text-emerald-700 font-mono">{selectedNode.rewardsEarned} tCTC</strong>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Latest Signed Proof Hash
                  </span>
                  <p className="font-mono text-[10px] text-slate-800 break-all bg-white p-2 rounded border border-slate-200">
                    {selectedNode.latestProofHash}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">Select a node on the map to inspect</div>
            )}

            <div className="text-[10px] text-slate-400 italic pt-4 text-center">
              VIRTUAL DEPLOYMENT NODE — TESTNET SIMULATION ONLY
            </div>
          </div>
        </div>

        {/* Cryptographic Evidence Stream Table */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Cryptographic Evidence Stream</h2>
              <p className="text-xs text-slate-500">
                Audited milestone records and proof certificates inscribed on Creditcoin CC3.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">Epoch #42 • 5 Inscriptions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Package ID</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Target Zone</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Proof Hash</th>
                  <th className="py-2.5 px-3">Attested By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{pkg.id}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">{pkg.assetType}</td>
                    <td className="py-3 px-3 text-slate-600">{pkg.zone}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          pkg.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 truncate max-w-xs">
                      {pkg.deliveryProofHash.slice(0, 16)}...{pkg.deliveryProofHash.slice(-8)}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{pkg.verifiedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
