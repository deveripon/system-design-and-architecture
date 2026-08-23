'use client';

import React from "react";

export const VerticalScalingDiagram = React.memo(() => (
  <div className="my-12 p-12 border border-dashed border-border bg-muted/5 flex items-center justify-center overflow-hidden w-full">
    <svg width="500" height="160" viewBox="0 0 500 160" className="w-full max-w-full h-auto">
      <rect x="60" y="40" width="100" height="80" rx="0" fill="#1a1915" stroke="#1e2d4a" strokeWidth="1.5"/>
      <text x="110" y="65" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono" fontSize="10">BEFORE</text>
      <rect x="75" y="72" width="70" height="8" rx="0" fill="#1e3a5f"/>
      <text x="110" y="80" textAnchor="middle" fill="#cc6b45" fontFamily="JetBrains Mono" fontSize="9">4GB RAM</text>
      <rect x="75" y="84" width="70" height="8" rx="0" fill="#1e3a5f"/>
      <text x="110" y="92" textAnchor="middle" fill="#cc6b45" fontFamily="JetBrains Mono" fontSize="9">2 CPU</text>
      <text x="110" y="140" textAnchor="middle" fill="#475569" fontFamily="JetBrains Mono" fontSize="10">Server</text>

      <path d="M 180 80 L 240 80" stroke="#cc6b45" strokeWidth="2" markerEnd="url(#arrow)"/>
      <text x="210" y="72" textAnchor="middle" fill="#cc6b45" fontFamily="JetBrains Mono" fontSize="9">UPGRADE</text>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#cc6b45"/>
        </marker>
      </defs>

      <rect x="250" y="20" width="130" height="120" rx="0" fill="#1a1915" stroke="#cc6b45" strokeWidth="1.5"/>
      <text x="315" y="48" textAnchor="middle" fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="10">AFTER</text>
      <rect x="268" y="55" width="94" height="10" rx="0" fill="#1e3a5f"/>
      <text x="315" y="64" textAnchor="middle" fill="#10b981" fontFamily="JetBrains Mono" fontSize="9">64GB RAM</text>
      <rect x="268" y="70" width="94" height="10" rx="0" fill="#1e3a5f"/>
      <text x="315" y="79" textAnchor="middle" fill="#10b981" fontFamily="JetBrains Mono" fontSize="9">32 CPU</text>
      <rect x="268" y="85" width="94" height="10" rx="0" fill="#1e3a5f"/>
      <text x="315" y="94" textAnchor="middle" fill="#10b981" fontFamily="JetBrains Mono" fontSize="9">NVMe SSD</text>
      <text x="315" y="158" textAnchor="middle" fill="#cc6b45" fontFamily="JetBrains Mono" fontSize="10">Bigger Server</text>

      <text x="430" y="75" textAnchor="middle" fill="#f97316" fontFamily="JetBrains Mono" fontSize="11">💸 $$$</text>
      <text x="430" y="90" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono" fontSize="9">Expensive</text>
    </svg>
  </div>
));

export const HorizontalScalingDiagram = React.memo(() => (
  <div className="my-12 p-12 border border-dashed border-border bg-muted/5 flex items-center justify-center overflow-hidden w-full">
    <svg width="560" height="180" viewBox="0 0 560 180" className="w-full max-w-full h-auto">
      <text x="30" y="90" textAnchor="middle" fill="#94a3b8" fontSize="24">👥</text>
      <text x="30" y="110" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono" fontSize="9">USERS</text>
      <path d="M 55 88 L 100 88" stroke="#cc6b45" strokeWidth="1.5" markerEnd="url(#arr2)"/>
      <defs>
        <marker id="arr2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#cc6b45"/>
        </marker>
        <marker id="arr3" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#6b7280"/>
        </marker>
      </defs>
      <rect x="100" y="65" width="90" height="46" rx="0" fill="#1a1915" stroke="#cc6b45" strokeWidth="1.5"/>
      <text x="145" y="86" textAnchor="middle" fill="#cc6b45" fontFamily="JetBrains Mono" fontSize="9">LOAD</text>
      <text x="145" y="98" textAnchor="middle" fill="#cc6b45" fontFamily="JetBrains Mono" fontSize="9">BALANCER</text>
      <text x="145" y="128" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono" fontSize="9">Nginx/HAProxy</text>
      <path d="M 190 80 L 250 40" stroke="#6b7280" strokeWidth="1.2" markerEnd="url(#arr3)"/>
      <path d="M 190 88 L 250 88" stroke="#6b7280" strokeWidth="1.2" markerEnd="url(#arr3)"/>
      <path d="M 190 96 L 250 136" stroke="#6b7280" strokeWidth="1.2" markerEnd="url(#arr3)"/>
      <rect x="250" y="18" width="80" height="44" rx="0" fill="#1a1915" stroke="#10b981" strokeWidth="1.2"/>
      <text x="290" y="38" textAnchor="middle" fill="#10b981" fontFamily="JetBrains Mono" fontSize="9">SERVER 1</text>
      <text x="290" y="51" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono" fontSize="8">4GB / 2CPU</text>
      <rect x="250" y="68" width="80" height="44" rx="0" fill="#1a1915" stroke="#10b981" strokeWidth="1.2"/>
      <text x="290" y="88" textAnchor="middle" fill="#10b981" fontFamily="JetBrains Mono" fontSize="9">SERVER 2</text>
      <text x="290" y="101" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono" fontSize="8">4GB / 2CPU</text>
      <rect x="250" y="118" width="80" height="44" rx="0" fill="#1a1915" stroke="#10b981" strokeWidth="1.2"/>
      <text x="290" y="138" textAnchor="middle" fill="#10b981" fontFamily="JetBrains Mono" fontSize="9">SERVER 3</text>
      <text x="290" y="151" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono" fontSize="8">4GB / 2CPU</text>
      <path d="M 330 40 L 400 88" stroke="#6b7280" strokeWidth="1" strokeDasharray="4"/>
      <path d="M 330 90 L 400 90" stroke="#6b7280" strokeWidth="1" strokeDasharray="4"/>
      <path d="M 330 140 L 400 92" stroke="#6b7280" strokeWidth="1" strokeDasharray="4"/>
      <rect x="400" y="65" width="80" height="50" rx="0" fill="#1a1915" stroke="#8b5cf6" strokeWidth="1.5"/>
      <text x="440" y="88" textAnchor="middle" fill="#8b5cf6" fontFamily="JetBrains Mono" fontSize="9">DATABASE</text>
      <text x="440" y="101" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono" fontSize="8">Shared</text>
      <text x="290" y="175" textAnchor="middle" fill="#f97316" fontFamily="JetBrains Mono" fontSize="9">+ easily add SERVER 4, 5, 6...</text>
    </svg>
  </div>
));

VerticalScalingDiagram.displayName = "VerticalScalingDiagram";
HorizontalScalingDiagram.displayName = "HorizontalScalingDiagram";
