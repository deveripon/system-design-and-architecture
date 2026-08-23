import React from 'react';

/**
 * CAP Theorem Triangle Diagram
 */
export const CAPTriangleDiagram = () => (
    <div className="bg-card/50 border border-border p-8 my-8 rounded-lg overflow-x-auto">
        <svg width="500" height="240" viewBox="0 0 500 240" className="mx-auto">
            {/* Triangle */}
            <polygon points="250,20 60,200 440,200" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
            
            {/* C node top */}
            <circle cx="250" cy="20" r="40" fill="rgba(204,107,69,0.12)" stroke="#cc6b45" strokeWidth="2" />
            <text x="250" y="14" textAnchor="middle" fill="#cc6b45" className="font-heading text-xl font-black">C</text>
            <text x="250" y="28" textAnchor="middle" fill="#93c5fd" className="font-mono text-[8px] font-bold">CONSISTENCY</text>
            
            {/* A node left */}
            <circle cx="60" cy="200" r="40" fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="2" />
            <text x="60" y="194" textAnchor="middle" fill="#10b981" className="font-heading text-xl font-black">A</text>
            <text x="60" y="208" textAnchor="middle" fill="#6ee7b7" className="font-mono text-[8px] font-bold">AVAILABILITY</text>
            
            {/* P node right */}
            <circle cx="440" cy="200" r="40" fill="rgba(139,92,246,0.1)" stroke="#8b5cf6" strokeWidth="2" />
            <text x="440" y="194" textAnchor="middle" fill="#8b5cf6" className="font-heading text-xl font-black">P</text>
            <text x="440" y="208" textAnchor="middle" fill="#c4b5fd" className="font-mono text-[8px] font-bold">PARTITION TOL.</text>
            
            {/* Labels on sides */}
            <text x="145" y="100" textAnchor="middle" fill="#cc6b45" className="font-mono text-[10px] font-bold">CP</text>
            <text x="145" y="114" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono text-[9px]">HBase, Zookeeper</text>
            
            <text x="355" y="100" textAnchor="middle" fill="#8b5cf6" className="font-mono text-[10px] font-bold">CA</text>
            <text x="355" y="114" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono text-[9px]">Single-node RDBMS</text>
            
            <text x="250" y="228" textAnchor="middle" fill="#10b981" className="font-mono text-[10px] font-bold">AP</text>
            <text x="250" y="240" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono text-[9px]">Cassandra, DynamoDB</text>
        </svg>
    </div>
);

/**
 * Network Partition Simulation Diagram (CP vs AP)
 */
export const PartitionSimulationDiagram = () => (
    <div className="bg-card/50 border border-border p-8 my-8 rounded-lg overflow-x-auto">
        <svg width="560" height="220" viewBox="0 0 560 220" className="mx-auto">
            <defs>
                <marker id="pa" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#cc6b45" /></marker>
            </defs>
            {/* Normal */}
            <text x="130" y="15" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono text-[9px]">NORMAL STATE</text>
            <rect x="30" y="22" width="70" height="28" rx="3" fill="currentColor" stroke="#10b981" className="text-card" />
            <text x="65" y="40" textAnchor="middle" fill="#6ee7b7" className="font-mono text-[8px]">Node A</text>
            <text x="65" y="52" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono text-[7px]">bal=1000</text>
            <path d="M 102 36 L 155 36" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#pa)" />
            <text x="128" y="30" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono text-[7px]">sync</text>
            <rect x="157" y="22" width="70" height="28" rx="3" fill="currentColor" stroke="#10b981" className="text-card" />
            <text x="192" y="40" textAnchor="middle" fill="#6ee7b7" className="font-mono text-[8px]">Node B</text>
            <text x="192" y="52" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono text-[7px]">bal=1000</text>
            
            {/* Divider */}
            <line x1="270" y1="10" x2="270" y2="215" stroke="currentColor" strokeWidth="1" strokeDasharray="4,3" className="text-border" />
            
            {/* Partition */}
            <text x="420" y="15" textAnchor="middle" fill="#ef4444" className="font-mono text-[9px]">AFTER PARTITION + WRITE</text>
            <rect x="290" y="22" width="70" height="28" rx="3" fill="currentColor" stroke="#cc6b45" strokeWidth="1.5" className="text-card" />
            <text x="325" y="37" textAnchor="middle" fill="#93c5fd" className="font-mono text-[8px]">Node A</text>
            <text x="325" y="49" textAnchor="middle" fill="#cc6b45" className="font-mono text-[7px]">bal=500 ✍</text>
            <text x="380" y="36" textAnchor="middle" fill="#ef4444" className="font-mono text-[10px]">✂✂✂</text>
            <text x="380" y="50" textAnchor="middle" fill="currentColor" className="text-muted-foreground font-mono text-[7px]">no network</text>
            <rect x="420" y="22" width="70" height="28" rx="3" fill="currentColor" stroke="#ef4444" strokeWidth="1" className="text-card" />
            <text x="455" y="37" textAnchor="middle" fill="#fca5a5" className="font-mono text-[8px]">Node B</text>
            <text x="455" y="49" textAnchor="middle" fill="#ef4444" className="font-mono text-[7px]">bal=1000 ← stale!</text>
            
            {/* CP choice */}
            <rect x="286" y="80" width="200" height="55" rx="4" fill="rgba(204,107,69,0.07)" stroke="#cc6b45" strokeWidth="1" />
            <text x="386" y="98" textAnchor="middle" fill="#cc6b45" className="font-mono text-[9px] font-bold">CP CHOICE</text>
            <text x="386" y="112" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[9px]">Node B reads → Error দেয়</text>
            <text x="386" y="126" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[9px]">&quot;Service unavailable&quot;</text>
            
            {/* AP choice */}
            <rect x="286" y="150" width="200" height="55" rx="4" fill="rgba(16,185,129,0.07)" stroke="#10b981" strokeWidth="1" />
            <text x="386" y="168" textAnchor="middle" fill="#10b981" className="font-mono text-[9px] font-bold">AP CHOICE</text>
            <text x="386" y="182" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[9px]">Node B reads → 1000 দেয়</text>
            <text x="386" y="196" textAnchor="middle" fill="currentColor" className="text-muted-foreground text-[9px]">(stale but available!)</text>
        </svg>
    </div>
);
