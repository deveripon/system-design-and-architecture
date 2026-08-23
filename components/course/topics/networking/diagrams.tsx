import React from 'react';

export const OSIModeDiagram = () => (
    <div className="diagram bg-card border border-border2 rounded-lg p-7 my-6 text-center font-mono text-xs overflow-x-auto shadow-sm">
        <svg width="580" height="295" viewBox="0 0 580 295" className="mx-auto max-w-full">
            {/* Layer 7 */}
            <rect x="60" y="10" width="380" height="32" rx="3" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.5)" strokeWidth="1"/>
            <text x="250" y="31" textAnchor="middle" fill="#fca5a5" fontFamily="inherit" fontSize="11" fontWeight="700">7. APPLICATION</text>
            <text x="460" y="31" fill="#64748b" fontFamily="inherit" fontSize="10">HTTP, DNS, SMTP</text>
            {/* Layer 6 */}
            <rect x="60" y="47" width="380" height="32" rx="3" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.4)" strokeWidth="1"/>
            <text x="250" y="68" textAnchor="middle" fill="#fdba74" fontFamily="inherit" fontSize="11" fontWeight="700">6. PRESENTATION</text>
            <text x="460" y="68" fill="#64748b" fontFamily="inherit" fontSize="10">TLS, SSL, JSON</text>
            {/* Layer 5 */}
            <rect x="60" y="84" width="380" height="32" rx="3" fill="rgba(234,179,8,0.08)" stroke="rgba(234,179,8,0.4)" strokeWidth="1"/>
            <text x="250" y="105" textAnchor="middle" fill="#fde047" fontFamily="inherit" fontSize="11" fontWeight="700">5. SESSION</text>
            <text x="460" y="105" fill="#64748b" fontFamily="inherit" fontSize="10">NetBIOS, PPTP</text>
            {/* Layer 4, highlighted */}
            <rect x="55" y="121" width="390" height="36" rx="3" fill="rgba(204,107,69,0.12)" stroke="#cc6b45" strokeWidth="2"/>
            <text x="250" y="144" textAnchor="middle" fill="#93c5fd" fontFamily="inherit" fontSize="12" fontWeight="700">4. TRANSPORT  ★  Key Layer</text>
            <text x="460" y="144" fill="#cc6b45" fontFamily="inherit" fontSize="10">TCP, UDP</text>
            {/* Layer 3, highlighted */}
            <rect x="55" y="162" width="390" height="36" rx="3" fill="rgba(139,92,246,0.1)" stroke="#8b5cf6" strokeWidth="1.5"/>
            <text x="250" y="185" textAnchor="middle" fill="#c4b5fd" fontFamily="inherit" fontSize="12" fontWeight="700">3. NETWORK  ★  Key Layer</text>
            <text x="460" y="185" fill="#8b5cf6" fontFamily="inherit" fontSize="10">IP, ICMP, ARP</text>
            {/* Layer 2 */}
            <rect x="60" y="203" width="380" height="32" rx="3" fill="rgba(16,185,129,0.07)" stroke="rgba(16,185,129,0.3)" strokeWidth="1"/>
            <text x="250" y="224" textAnchor="middle" fill="#6ee7b7" fontFamily="inherit" fontSize="11" fontWeight="700">2. DATA LINK</text>
            <text x="460" y="224" fill="#64748b" fontFamily="inherit" fontSize="10">Ethernet, MAC</text>
            {/* Layer 1 */}
            <rect x="60" y="240" width="380" height="32" rx="3" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1"/>
            <text x="250" y="261" textAnchor="middle" fill="#94a3b8" fontFamily="inherit" fontSize="11" fontWeight="700">1. PHYSICAL</text>
            <text x="460" y="261" fill="#64748b" fontFamily="inherit" fontSize="10">Cables, Fiber</text>
            {/* Arrow label */}
            <text x="25" y="30" fill="#cc6b45" fontFamily="inherit" fontSize="9">USER</text>
            <text x="22" y="255" fill="#64748b" fontFamily="inherit" fontSize="9">WIRE</text>
        </svg>
    </div>
);

export const TCPHandshakeDiagram = () => (
    <div className="diagram bg-card border border-border2 rounded-lg p-7 my-6 text-center font-mono text-xs overflow-x-auto shadow-sm">
        <svg width="500" height="210" viewBox="0 0 500 210" className="mx-auto max-w-full">
            <defs>
                <marker id="ar1" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#cc6b45"/></marker>
                <marker id="ar2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#10b981"/></marker>
                <marker id="ar3" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#eab308"/></marker>
            </defs>
            <rect x="20" y="15" width="80" height="28" rx="3" fill="#1a1915" stroke="#1e2d4a"/>
            <text x="60" y="33" textAnchor="middle" fill="#94a3b8" fontFamily="inherit" fontSize="10">CLIENT</text>
            <line x1="60" y1="43" x2="60" y2="200" stroke="#1e2d4a" strokeWidth="1" strokeDasharray="4,3"/>
            <rect x="400" y="15" width="80" height="28" rx="3" fill="#1a1915" stroke="#1e2d4a"/>
            <text x="440" y="33" textAnchor="middle" fill="#94a3b8" fontFamily="inherit" fontSize="10">SERVER</text>
            <line x1="440" y1="43" x2="440" y2="200" stroke="#1e2d4a" strokeWidth="1" strokeDasharray="4,3"/>
            {/* SYN */}
            <path d="M 65 70 L 435 85" stroke="#cc6b45" strokeWidth="1.5" markerEnd="url(#ar1)"/>
            <text x="250" y="67" textAnchor="middle" fill="#93c5fd" fontFamily="inherit" fontSize="10">① SYN  (seq=100)  &quot;আমি connect করতে চাই&quot;</text>
            {/* SYN-ACK */}
            <path d="M 435 105 L 65 120" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#ar2)"/>
            <text x="250" y="103" textAnchor="middle" fill="#6ee7b7" fontFamily="inherit" fontSize="10">② SYN-ACK  (ack=101)  &quot;ঠিক আছে, আমি ready&quot;</text>
            {/* ACK */}
            <path d="M 65 138 L 435 150" stroke="#cc6b45" strokeWidth="1.5" markerEnd="url(#ar1)"/>
            <text x="250" y="136" textAnchor="middle" fill="#93c5fd" fontFamily="inherit" fontSize="10">③ ACK  (ack=201)  &quot;Connection confirmed!&quot;</text>
            {/* Data */}
            <path d="M 65 168 L 435 178" stroke="#eab308" strokeWidth="2" strokeDasharray="6,2" markerEnd="url(#ar3)"/>
            <text x="250" y="165" textAnchor="middle" fill="#fde047" fontFamily="inherit" fontSize="10">DATA TRANSFER শুরু</text>
            <text x="250" y="200" textAnchor="middle" fill="#475569" fontFamily="inherit" fontSize="9">Connection Established, এর পরেই data যায়</text>
        </svg>
    </div>
);

export const DNSLookupDiagram = () => (
    <div className="diagram bg-card border border-border2 rounded-lg p-7 my-6 text-center font-mono text-xs overflow-x-auto shadow-sm">
        <svg width="600" height="155" viewBox="0 0 600 155" className="mx-auto max-w-full">
            <defs>
                <marker id="dns-a" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#cc6b45"/></marker>
            </defs>
            <rect x="5" y="58" width="74" height="28" rx="3" fill="#1a1915" stroke="#1e2d4a"/>
            <text x="42" y="76" textAnchor="middle" fill="#94a3b8" fontFamily="inherit" fontSize="9">BROWSER</text>
            <path d="M 81 72 L 125 72" stroke="#cc6b45" strokeWidth="1.5" markerEnd="url(#dns-a)"/>
            <text x="103" y="65" textAnchor="middle" fill="#64748b" fontFamily="inherit" fontSize="8">① cache?</text>
            <rect x="127" y="58" width="68" height="28" rx="3" fill="#1a1915" stroke="#1e2d4a"/>
            <text x="161" y="76" textAnchor="middle" fill="#94a3b8" fontFamily="inherit" fontSize="9">OS CACHE</text>
            <path d="M 197 72 L 245 72" stroke="#cc6b45" strokeWidth="1.5" markerEnd="url(#dns-a)"/>
            <text x="221" y="65" textAnchor="middle" fill="#64748b" fontFamily="inherit" fontSize="8">② miss!</text>
            <rect x="247" y="55" width="76" height="36" rx="3" fill="#1a1915" stroke="#cc6b45" strokeWidth="1.5"/>
            <text x="285" y="69" textAnchor="middle" fill="#93c5fd" fontFamily="inherit" fontSize="8">RECURSIVE</text>
            <text x="285" y="82" textAnchor="middle" fill="#93c5fd" fontFamily="inherit" fontSize="8">RESOLVER</text>
            {/* Root */}
            <rect x="365" y="10" width="72" height="28" rx="3" fill="#1a1915" stroke="#8b5cf6"/>
            <text x="401" y="28" textAnchor="middle" fill="#c4b5fd" fontFamily="inherit" fontSize="9">ROOT NS</text>
            <path d="M 325 65 L 398 38" stroke="#8b5cf6" strokeWidth="1" markerEnd="url(#dns-a)"/>
            <text x="352" y="47" fill="#475569" fontFamily="inherit" fontSize="7">③</text>
            {/* TLD */}
            <rect x="365" y="55" width="72" height="28" rx="3" fill="#1a1915" stroke="#10b981"/>
            <text x="401" y="73" textAnchor="middle" fill="#6ee7b7" fontFamily="inherit" fontSize="9">TLD NS</text>
            <path d="M 325 73 L 363 73" stroke="#10b981" strokeWidth="1" markerEnd="url(#dns-a)"/>
            <text x="345" y="68" fill="#475569" fontFamily="inherit" fontSize="7">④</text>
            {/* Auth */}
            <rect x="365" y="100" width="72" height="28" rx="3" fill="#1a1915" stroke="#f97316"/>
            <text x="401" y="118" textAnchor="middle" fill="#fdba74" fontFamily="inherit" fontSize="9">AUTH NS</text>
            <path d="M 325 78 L 398 100" stroke="#f97316" strokeWidth="1" markerEnd="url(#dns-a)"/>
            <text x="352" y="96" fill="#475569" fontFamily="inherit" fontSize="7">⑤</text>
            {/* Return IP */}
            <path d="M 365 114 L 295 80" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4,2" markerEnd="url(#dns-a)"/>
            <text x="460" y="118" fill="#fde047" fontFamily="inherit" fontSize="9">IP ফিরে আসে!</text>
            <text x="285" y="148" textAnchor="middle" fill="#475569" fontFamily="inherit" fontSize="8">⑥ IP → Browser → TCP Connect → HTTP Request</text>
        </svg>
    </div>
);

export const LoadBalancingDiagram = () => (
    <div className="diagram bg-card border border-border2 rounded-lg p-7 my-6 text-center font-mono text-xs overflow-x-auto shadow-sm">
        <svg width="560" height="160" viewBox="0 0 560 160" className="mx-auto max-w-full">
            <defs>
                <marker id="lb-a" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#cc6b45"/></marker>
                <marker id="lb-b" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#6b7280"/></marker>
            </defs>
            <text x="30" y="82" textAnchor="middle" fontSize="28">👥</text>
            <text x="30" y="100" textAnchor="middle" fill="#64748b" fontFamily="inherit" fontSize="8">USERS</text>
            <path d="M 55 80 L 95 80" stroke="#cc6b45" strokeWidth="1.5" markerEnd="url(#lb-a)"/>
            <rect x="97" y="60" width="96" height="40" rx="4" fill="#1a1915" stroke="#cc6b45" strokeWidth="1.5"/>
            <text x="145" y="78" textAnchor="middle" fill="#cc6b45" fontFamily="inherit" fontSize="9">LOAD</text>
            <text x="145" y="91" textAnchor="middle" fill="#cc6b45" fontFamily="inherit" fontSize="9">BALANCER</text>
            <path d="M 195 68 L 285 30" stroke="#6b7280" strokeWidth="1" markerEnd="url(#lb-b)"/>
            <path d="M 195 80 L 285 80" stroke="#6b7280" strokeWidth="1" markerEnd="url(#lb-b)"/>
            <path d="M 195 92 L 285 130" stroke="#6b7280" strokeWidth="1" markerEnd="url(#lb-b)"/>
            <rect x="287" y="14" width="90" height="30" rx="3" fill="#1a1915" stroke="#10b981" strokeWidth="1"/>
            <text x="332" y="33" textAnchor="middle" fill="#6ee7b7" fontFamily="inherit" fontSize="9">Server 1</text>
            <rect x="287" y="64" width="90" height="30" rx="3" fill="#1a1915" stroke="#10b981" strokeWidth="1"/>
            <text x="332" y="83" textAnchor="middle" fill="#6ee7b7" fontFamily="inherit" fontSize="9">Server 2</text>
            <rect x="287" y="114" width="90" height="30" rx="3" fill="#1a1915" stroke="#10b981" strokeWidth="1"/>
            <text x="332" y="133" textAnchor="middle" fill="#6ee7b7" fontFamily="inherit" fontSize="9">Server 3</text>
            <path d="M 379 29 L 430 70" stroke="#475569" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#lb-b)"/>
            <path d="M 379 79 L 430 79" stroke="#475569" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#lb-b)"/>
            <path d="M 379 129 L 430 90" stroke="#475569" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#lb-b)"/>
            <rect x="432" y="60" width="80" height="38" rx="3" fill="#1a1915" stroke="#8b5cf6" strokeWidth="1"/>
            <text x="472" y="77" textAnchor="middle" fill="#c4b5fd" fontFamily="inherit" fontSize="8">DATABASE</text>
            <text x="472" y="90" textAnchor="middle" fill="#64748b" fontFamily="inherit" fontSize="8">(Shared)</text>
        </svg>
    </div>
);
