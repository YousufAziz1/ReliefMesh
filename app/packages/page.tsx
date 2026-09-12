'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { INITIAL_PACKAGES } from '@/lib/demo/data';

export default function PackagesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              <span className="text-xs uppercase tracking-wider text-teal-800 font-bold">
                RWA DIGITAL INVENTORY
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Aid Package Registry
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated relief packages mapped to field zones and verified via milestone proof hashes.
            </p>
          </div>

          <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-center">
            REPRESENTATION ONLY — NOT A CLAIM ON PHYSICAL GOODS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_PACKAGES.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-mono text-xs font-bold text-slate-800">{pkg.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      pkg.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {pkg.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-bold text-slate-900">{pkg.assetType}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{pkg.zone}</p>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Dispatched:</span>
                    <strong className="text-slate-800">{pkg.dispatchedAt}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Attested By:</span>
                    <strong className="text-teal-700">{pkg.verifiedBy}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                  Delivery Proof Hash
                </span>
                <p className="font-mono text-[10px] text-slate-700 truncate bg-slate-50 p-2 rounded border border-slate-200">
                  {pkg.deliveryProofHash}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
