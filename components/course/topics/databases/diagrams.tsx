import React from 'react';

/**
 * ACID Properties Diagram
 */
export const ACIDDiagram = () => (
    <div className="bg-card/50 border border-border p-8 my-8 rounded-lg overflow-x-auto">
        <svg width="560" height="170" viewBox="0 0 560 170" className="mx-auto">
            {/* Atomicity */}
            <rect x="5" y="15" width="128" height="138" rx="5" fill="rgba(204,107,69,0.08)" stroke="#cc6b45" strokeWidth="1.5" />
            <text x="69" y="52" textAnchor="middle" fill="#cc6b45" className="font-heading text-4xl font-black">A</text>
            <text x="69" y="72" textAnchor="middle" fill="#93c5fd" className="font-mono text-[9px] font-bold">ATOMICITY</text>
            <text x="69" y="92" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[10px]">All or Nothing</text>
            <text x="69" y="110" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[10px]">সব হবে না হয়</text>
            <text x="69" y="128" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[10px]">কিছুই না</text>

            {/* Consistency */}
            <rect x="143" y="15" width="128" height="138" rx="5" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="1.5" />
            <text x="207" y="52" textAnchor="middle" fill="#10b981" className="font-heading text-4xl font-black">C</text>
            <text x="207" y="72" textAnchor="middle" fill="#6ee7b7" className="font-mono text-[9px] font-bold">CONSISTENCY</text>
            <text x="207" y="92" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[10px]">Business rules</text>
            <text x="207" y="110" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[10px]">সবসময় valid</text>
            <text x="207" y="128" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[10px]">state maintain</text>

            {/* Isolation */}
            <rect x="281" y="15" width="128" height="138" rx="5" fill="rgba(139,92,246,0.08)" stroke="#8b5cf6" strokeWidth="1.5" />
            <text x="345" y="52" textAnchor="middle" fill="#8b5cf6" className="font-heading text-4xl font-black">I</text>
            <text x="345" y="72" textAnchor="middle" fill="#c4b5fd" className="font-mono text-[9px] font-bold">ISOLATION</text>
            <text x="345" y="92" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[10px]">Concurrent txn</text>
            <text x="345" y="110" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[10px]">একে অন্যকে</text>
            <text x="345" y="128" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[10px]">affect করে না</text>

            {/* Durability */}
            <rect x="419" y="15" width="128" height="138" rx="5" fill="rgba(249,115,22,0.08)" stroke="#f97316" strokeWidth="1.5" />
            <text x="483" y="52" textAnchor="middle" fill="#f97316" className="font-heading text-4xl font-black">D</text>
            <text x="483" y="72" textAnchor="middle" fill="#fdba74" className="font-mono text-[9px] font-bold">DURABILITY</text>
            <text x="483" y="92" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[10px]">Committed data</text>
            <text x="483" y="110" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[10px]">crash এ হারাবে না</text>
            <text x="483" y="128" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[10px]">(WAL log দিয়ে)</text>
        </svg>
    </div>
);

/**
 * Indexing Comparison Diagram (B-Tree vs Table Scan)
 */
export const IndexingDiagram = () => (
    <div className="bg-card/50 border border-border p-8 my-8 rounded-lg overflow-x-auto">
        <svg width="540" height="185" viewBox="0 0 540 185" className="mx-auto">
            <defs>
                <marker id="ga" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L7,3 z" fill="#10b981" />
                </marker>
            </defs>
            {/* Without index left panel */}
            <text x="120" y="18" textAnchor="middle" fill="#ef4444" className="font-mono text-[11px] font-bold">❌ WITHOUT INDEX</text>
            <text x="120" y="33" textAnchor="middle" fill="#64748b" className="font-mono text-[9px]">O(n): Full Table Scan</text>
            <rect x="20" y="40" width="200" height="16" rx="2" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.2)" />
            <text x="120" y="52" textAnchor="middle" fill="#94a3b8" className="font-mono text-[9px]">Row 1: a@x.com, check... ✗</text>
            <rect x="20" y="60" width="200" height="16" rx="2" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.2)" />
            <text x="120" y="72" textAnchor="middle" fill="#94a3b8" className="font-mono text-[9px]">Row 2: b@x.com, check... ✗</text>
            <rect x="20" y="80" width="200" height="16" rx="2" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.2)" />
            <text x="120" y="92" textAnchor="middle" fill="#94a3b8" className="font-mono text-[9px]">Row 3: c@x.com, check... ✗</text>
            <text x="120" y="114" textAnchor="middle" fill="#475569" className="font-mono text-[10px]">· · · 1,000,000 rows · · ·</text>
            <text x="120" y="140" textAnchor="middle" fill="#ef4444" className="font-mono text-sm font-bold">~1 second 😱</text>

            {/* divider */}
            <line x1="265" y1="10" x2="265" y2="175" stroke="currentColor" strokeWidth="1" strokeDasharray="4,3" className="text-border" />

            {/* With index right panel */}
            <text x="400" y="18" textAnchor="middle" fill="#10b981" className="font-mono text-[11px] font-bold">✅ WITH B-TREE INDEX</text>
            <text x="400" y="33" textAnchor="middle" fill="#64748b" className="font-mono text-[9px]">O(log n): Binary Search</text>
            <rect x="348" y="40" width="104" height="24" rx="3" fill="rgba(16,185,129,0.1)" stroke="#10b981" />
            <text x="400" y="56" textAnchor="middle" fill="#6ee7b7" className="font-mono text-[9px]">B-Tree Root</text>
            <path d="M 375 64 L 348 88" stroke="#10b981" strokeWidth="1" markerEnd="url(#ga)" />
            <path d="M 425 64 L 452 88" stroke="#10b981" strokeWidth="1" markerEnd="url(#ga)" />
            <rect x="316" y="88" width="64" height="20" rx="2" fill="rgba(16,185,129,0.07)" stroke="rgba(16,185,129,0.3)" />
            <text x="348" y="102" textAnchor="middle" fill="#94a3b8" className="font-mono text-[8px]">a-m branch</text>
            <rect x="424" y="88" width="64" height="20" rx="2" fill="rgba(16,185,129,0.07)" stroke="rgba(16,185,129,0.3)" />
            <text x="456" y="102" textAnchor="middle" fill="#94a3b8" className="font-mono text-[8px]">n-z branch</text>
            <path d="M 348 108 L 348 128" stroke="#10b981" strokeWidth="1" markerEnd="url(#ga)" />
            <rect x="306" y="128" width="84" height="22" rx="3" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="2" />
            <text x="348" y="143" textAnchor="middle" fill="#6ee7b7" className="font-mono text-[9px]">abc@mail ✓ FOUND</text>
            <text x="400" y="174" textAnchor="middle" fill="#10b981" className="font-mono text-sm font-bold">~1ms ⚡ (1000x faster!)</text>
        </svg>
    </div>
);

/**
 * Database Scaling Diagram (Read Replicas)
 */
export const DBReplicationDiagram = () => (
    <div className="bg-card/50 border border-border p-8 my-8 rounded-lg overflow-x-auto">
        <svg width="480" height="145" viewBox="0 0 480 145" className="mx-auto">
            <defs>
                <marker id="ra" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#cc6b45" /></marker>
                <marker id="rb" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#f97316" /></marker>
                <marker id="rc" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#10b981" /></marker>
            </defs>
            <rect x="10" y="52" width="90" height="34" rx="3" fill="currentColor" stroke="currentColor" className="text-card stroke-border" />
            <text x="55" y="68" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono text-[9px]">App</text>
            <text x="55" y="80" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono text-[9px]">Server</text>
            <path d="M 102 58 L 162 38" stroke="#f97316" strokeWidth="1.5" markerEnd="url(#rb)" />
            <text x="127" y="40" fill="#f97316" className="font-mono text-[8px]">WRITE</text>
            <path d="M 102 75 L 162 95" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#rc)" />
            <text x="112" y="94" fill="#10b981" className="font-mono text-[8px]">READ</text>
            <rect x="164" y="22" width="100" height="34" rx="3" fill="currentColor" stroke="#f97316" strokeWidth="1.5" className="text-card" />
            <text x="214" y="37" textAnchor="middle" fill="#fdba74" className="font-mono text-[9px]">PRIMARY</text>
            <text x="214" y="50" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono text-[8px]">Write here</text>
            <rect x="164" y="78" width="100" height="32" rx="3" fill="currentColor" stroke="#10b981" className="text-card" />
            <text x="214" y="93" textAnchor="middle" fill="#6ee7b7" className="font-mono text-[9px]">REPLICA 1</text>
            <text x="214" y="104" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono text-[8px]">Read only</text>
            <rect x="164" y="117" width="100" height="24" rx="3" fill="currentColor" stroke="#10b981" strokeWidth="0.8" className="text-card" />
            <text x="214" y="133" textAnchor="middle" fill="#6ee7b7" className="font-mono text-[8px]">REPLICA 2 (Read)</text>
            <path d="M 266 39 L 340 50" stroke="#cc6b45" strokeWidth="1" strokeDasharray="4,2" markerEnd="url(#ra)" />
            <path d="M 266 39 L 340 125" stroke="#cc6b45" strokeWidth="1" strokeDasharray="4,2" markerEnd="url(#ra)" />
            <text x="350" y="45" fill="#cc6b45" className="font-mono text-[8px]">async replication</text>
            <text x="350" y="60" fill="currentColor" className="text-muted-foreground font-mono text-[8px]">→ Replica 1 synced</text>
            <text x="350" y="128" fill="currentColor" className="text-muted-foreground font-mono text-[8px]">→ Replica 2 synced</text>
        </svg>
    </div>
);
