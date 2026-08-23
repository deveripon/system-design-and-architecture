import React from 'react';
/* eslint-disable react/jsx-key */
import {
    SectionTitle,
    ContentParagraph,
    FeatureGrid,
    FeatureCard,
    GradientText,
} from '../../../components/course/content-components';
import {
    CONTENT_TYPES,
    INFO_BOX_VARIANTS,
    TopicData,
} from '../../../types/content';

export const serviceDiscoveryContent: TopicData = {
    id: 'service-discovery',
    sections: [
        {
            id: 'intro-concept',
            subHeader: { index: '001', title: 'Why It Matters' },
            title: (
                <SectionTitle>
                    Service Discovery কেন শিখতে হবে?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                আপনার microservices system এ Order Service কে
                                Payment Service কে call করতে হবে। কিন্তু Payment
                                Service এর IP কী? Kubernetes এ pods dynamically
                                scale হয় — IP বদলায়। Hardcode করা impossible।
                            </ContentParagraph>
                            <ContentParagraph>
                                এই সমস্যার সমাধান হলো{' '}
                                <strong className='text-foreground'>
                                    Service Discovery
                                </strong>{' '}
                                — services নিজেদের register করে, অন্যরা সেই
                                registry থেকে খুঁজে নেয়।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'DEFINITION',
                    content: (
                        <p>
                            <strong>Service Discovery</strong> হলো একটা
                            mechanism যেখানে services automatically তাদের
                            network location (IP, port) একটা registry তে
                            register করে। অন্য services ওই registry থেকে তাদের
                            খুঁজে নেয়। Dynamic scaling এ IP hardcode করার দরকার
                            নেই।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-10 mt-20'>
                                Without vs With Service Discovery
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-red-500' />
                                        <span className='text-red-700 dark:text-red-400'>
                                            ❌ Without Discovery
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Order Service:{' '}
                                        <code>
                                            http://192.168.1.45:8001/charge
                                        </code>{' '}
                                        — hardcoded। Payment pod restart হলে IP
                                        বদলায় → app broken।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        <span className='text-emerald-700 dark:text-emerald-400'>
                                            ✅ With Discovery
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Order Service:{' '}
                                        <code>
                                            http://payment-service/charge
                                        </code>{' '}
                                        — DNS name। Kubernetes DNS automatically
                                        resolve করে। Pod যেকোনো IP তে থাকুক।
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
            ],
        },
        {
            id: 'patterns',
            subHeader: { index: '002', title: 'Discovery Patterns' },
            title: (
                <SectionTitle>
                    দুটো Pattern — Client-side vs Server-side
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xl font-bold mb-6'>
                                1. Client-Side Discovery
                            </h3>
                            <p className='text-muted-foreground leading-relaxed mb-8 text-lg'>
                                Client নিজেই Service Registry থেকে service এর
                                location বের করে এবং directly call করে। Netflix
                                Eureka এই pattern follow করে।
                            </p>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='border border-border bg-card/30 rounded p-6 my-4'>
                            <p className='font-mono text-xs text-muted-foreground text-center mb-6 uppercase tracking-widest'>
                                CLIENT-SIDE DISCOVERY FLOW
                            </p>
                            <div className='space-y-4 text-sm text-muted-foreground'>
                                <div className='flex items-center gap-3'>
                                    <span className='font-mono text-yellow-700 dark:text-yellow-400 font-bold shrink-0'>
                                        1.
                                    </span>
                                    <span>
                                        Order Service → Service Registry:{' '}
                                        <em>
                                            &quot;Where is Payment
                                            Service?&quot;
                                        </em>
                                    </span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <span className='font-mono text-yellow-700 dark:text-yellow-400 font-bold shrink-0'>
                                        2.
                                    </span>
                                    <span>
                                        Registry → Order Service:{' '}
                                        <em>
                                            &quot;It&apos;s at
                                            10.0.1.5:8001&quot;
                                        </em>
                                    </span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <span className='font-mono text-purple-700 dark:text-purple-400 font-bold shrink-0'>
                                        3.
                                    </span>
                                    <span>
                                        Order Service → Payment Service
                                        (direct call to 10.0.1.5:8001)
                                    </span>
                                </div>
                                <div className='flex items-center gap-3 mt-2 pt-3 border-t border-border'>
                                    <span className='font-mono text-emerald-700 dark:text-emerald-400 font-bold shrink-0'>
                                        Note:
                                    </span>
                                    <span>
                                        Payment Service instances register on
                                        start → Registry (Consul/Eureka)
                                    </span>
                                </div>
                                <div className='flex items-center gap-3 pt-1'>
                                    <span className='font-mono text-blue-700 dark:text-blue-400 font-bold shrink-0'>
                                        LB:
                                    </span>
                                    <span>
                                        Client has load balancing logic
                                        (Netflix Ribbon)
                                    </span>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xl font-bold mt-16 mb-6'>
                                2. Server-Side Discovery
                            </h3>
                            <p className='text-muted-foreground leading-relaxed mb-8 text-lg'>
                                Client একটা fixed endpoint এ request পাঠায়।
                                Load Balancer / API Gateway নিজে Registry থেকে
                                service location বের করে forward করে। Client
                                কিছু জানে না। Kubernetes Service এই pattern।
                            </p>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='border border-border bg-card/30 rounded p-6 my-4'>
                            <p className='font-mono text-xs text-muted-foreground text-center mb-6 uppercase tracking-widest'>
                                SERVER-SIDE DISCOVERY (Kubernetes Style)
                            </p>
                            <div className='space-y-4 text-sm text-muted-foreground'>
                                <div className='flex items-center gap-3'>
                                    <span className='font-mono text-blue-700 dark:text-blue-400 font-bold shrink-0'>
                                        Client →
                                    </span>
                                    <span>
                                        <code>payment-svc</code> (stable DNS)
                                    </span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <span className='font-mono text-yellow-700 dark:text-yellow-400 font-bold shrink-0'>
                                        K8s Service:
                                    </span>
                                    <span>
                                        Stable DNS + VIP। kube-proxy load
                                        balances pods
                                    </span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <span className='font-mono text-purple-700 dark:text-purple-400 font-bold shrink-0'>
                                        etcd:
                                    </span>
                                    <span>Pod registry (internal)</span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <span className='font-mono text-emerald-700 dark:text-emerald-400 font-bold shrink-0'>
                                        Pods:
                                    </span>
                                    <span>
                                        Pod 10.0.1.5, 10.0.1.6, 10.0.1.7 — K8s
                                        Service routes to all
                                    </span>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Pattern', 'Load Balancing', 'Complexity', 'Example'],
                    rows: [
                        [
                            'Client-side',
                            'Client handles',
                            <span className='text-red-700 dark:text-red-400'>Higher</span>,
                            'Netflix Eureka + Ribbon',
                        ],
                        [
                            'Server-side',
                            'LB/Infra handles',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Lower
                            </span>,
                            'Kubernetes Service, AWS ALB',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'service-mesh',
            subHeader: { index: '003', title: 'Service Mesh' },
            title: (
                <SectionTitle>
                    Service Mesh — Infrastructure Layer
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                Service Discovery solve করার পরও বাকি থাকে:
                                load balancing, circuit breaking, retry, mTLS,
                                observability। প্রতিটা service এ আলাদাভাবে
                                এগুলো implement করা tedious।
                            </ContentParagraph>
                            <ContentParagraph>
                                <strong className='text-foreground'>
                                    Service Mesh
                                </strong>{' '}
                                এই সমস্যা solve করে — প্রতিটা service এর পাশে
                                একটা{' '}
                                <strong className='text-foreground'>
                                    sidecar proxy
                                </strong>{' '}
                                বসায় (যেমন Envoy)। সব network traffic এই proxy
                                দিয়ে যায়। Service কোড change করতে হয় না।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='border border-border bg-card/30 rounded p-6 my-4'>
                            <p className='font-mono text-xs text-muted-foreground text-center mb-6 uppercase tracking-widest'>
                                SERVICE MESH — SIDECAR PATTERN
                            </p>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border mb-4'>
                                <div className='p-6 border-r border-border'>
                                    <p className='font-mono text-[10px] text-purple-700 dark:text-purple-400 uppercase tracking-widest mb-3'>
                                        POD A
                                    </p>
                                    <div className='flex gap-2'>
                                        <div className='flex-1 border border-blue-500/40 rounded p-3 text-center'>
                                            <p className='font-mono text-xs text-blue-700 dark:text-blue-400'>
                                                Order
                                            </p>
                                            <p className='font-mono text-xs text-blue-700 dark:text-blue-400'>
                                                Service
                                            </p>
                                        </div>
                                        <div className='flex-1 border border-purple-400/60 rounded p-3 text-center bg-purple-500/5'>
                                            <p className='font-mono text-xs text-purple-700 dark:text-purple-300 font-bold'>
                                                Envoy
                                            </p>
                                            <p className='font-mono text-[9px] text-purple-700 dark:text-purple-400'>
                                                Sidecar
                                            </p>
                                            <p className='font-mono text-[8px] text-muted-foreground'>
                                                mTLS, LB
                                            </p>
                                            <p className='font-mono text-[8px] text-muted-foreground'>
                                                Circuit Breaker
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-6'>
                                    <p className='font-mono text-[10px] text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-3'>
                                        POD B
                                    </p>
                                    <div className='flex gap-2'>
                                        <div className='flex-1 border border-purple-400/60 rounded p-3 text-center bg-purple-500/5'>
                                            <p className='font-mono text-xs text-purple-700 dark:text-purple-300 font-bold'>
                                                Envoy
                                            </p>
                                            <p className='font-mono text-[9px] text-purple-700 dark:text-purple-400'>
                                                Sidecar
                                            </p>
                                        </div>
                                        <div className='flex-1 border border-blue-500/40 rounded p-3 text-center'>
                                            <p className='font-mono text-xs text-blue-700 dark:text-blue-400'>
                                                Payment
                                            </p>
                                            <p className='font-mono text-xs text-blue-700 dark:text-blue-400'>
                                                Service
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='border border-yellow-500/30 rounded p-3 text-center bg-yellow-500/5 mx-auto max-w-xs'>
                                <p className='font-mono text-xs text-yellow-700 dark:text-yellow-400 font-bold'>
                                    mTLS Encrypted Channel
                                </p>
                                <p className='font-mono text-[9px] text-muted-foreground'>
                                    Mutual TLS · Auto cert rotation
                                </p>
                            </div>
                            <div className='mt-3 border border-purple-500/30 rounded p-2 text-center bg-purple-500/5 mx-auto max-w-xs'>
                                <p className='font-mono text-[9px] text-purple-700 dark:text-purple-400'>
                                    Istio Control Plane
                                </p>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-10 mt-20'>
                                Service Mesh কী কী করে?
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border border-b bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-blue-500' />
                                        🔐 mTLS
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Service-to-service communication
                                        automatically encrypted। Certificate
                                        management automatic। Zero-trust
                                        network।
                                    </p>
                                </div>
                                <div className='p-8 border-b bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        ⚖️ Load Balancing
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Advanced algorithms: round-robin, least
                                        connections, consistent hashing।
                                        Health-aware routing।
                                    </p>
                                </div>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-yellow-500' />
                                        ⚡ Circuit Breaking
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Code change ছাড়াই circuit breaker।
                                        YAML config এ define করুন।
                                        Language-agnostic।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-purple-500' />
                                        📊 Observability
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Automatic distributed tracing, metrics,
                                        logs। প্রতিটা service এ code লেখা লাগে
                                        না। Jaeger integration।
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Tool', 'Type', 'Proxy', 'Best For'],
                    rows: [
                        [
                            'Istio',
                            'Service Mesh',
                            'Envoy',
                            'Kubernetes — full featured, complex',
                        ],
                        [
                            'Linkerd',
                            'Service Mesh',
                            'linkerd-proxy',
                            'Lightweight K8s mesh',
                        ],
                        [
                            'Consul Connect',
                            'Mesh + Discovery',
                            'Envoy/built-in',
                            'Multi-platform, non-K8s too',
                        ],
                        [
                            'AWS App Mesh',
                            'Managed Mesh',
                            'Envoy',
                            'AWS ECS/EKS',
                        ],
                        [
                            'Consul',
                            'Discovery only',
                            '—',
                            'Multi-DC service registry',
                        ],
                        [
                            'K8s DNS',
                            'Discovery only',
                            '—',
                            'Simple K8s service discovery',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'code-examples',
            subHeader: { index: '004', title: 'Code Examples' },
            title: (
                <SectionTitle>Practical Code</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mb-6'>
                            Python: Consul Service Registration
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'service_registry.py',
                    code: `# pip install python-consul
import consul
import socket
from fastapi import FastAPI
import uvicorn
import atexit

app = FastAPI()
c = consul.Consul(host='localhost', port=8500)

SERVICE_NAME = "payment-service"
SERVICE_PORT = 8001
SERVICE_ID = f"payment-service-{socket.gethostname()}"

def register_service():
    """Consul এ service register করুন"""
    c.agent.service.register(
        name=SERVICE_NAME,
        service_id=SERVICE_ID,
        address=socket.gethostbyname(socket.gethostname()),
        port=SERVICE_PORT,
        check={
            "http": f"http://localhost:{SERVICE_PORT}/health",
            "interval": "10s",   # Every 10s health check
            "timeout": "5s"
        },
        tags=["payment", "api", "v1"]
    )
    print(f"✅ Registered: {SERVICE_ID}")

def deregister_service():
    """Shutdown এ deregister করুন"""
    c.agent.service.deregister(SERVICE_ID)
    print(f"❌ Deregistered: {SERVICE_ID}")

def discover_service(service_name: str) -> str:
    """Service এর URL বের করুন"""
    _, services = c.health.service(service_name, passing=True)
    if not services:
        raise Exception(f"No healthy instances of {service_name}")
    # Simple round-robin (real এ load balancer করবেন)
    service = services[0]['Service']
    return f"http://{service['Address']}:{service['Port']}"

@app.on_event("startup")
async def startup():
    register_service()
    atexit.register(deregister_service)

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/orders")
async def create_order():
    # Discover payment service dynamically
    payment_url = discover_service("payment-service")
    return {"payment_url": payment_url, "status": "processing"}`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            Kubernetes: Service Discovery YAML
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'yaml',
                    filename: 'payment-service.yaml',
                    code: `# Kubernetes Service — stable DNS endpoint
apiVersion: v1
kind: Service
metadata:
  name: payment-service   # DNS name হবে: payment-service.default.svc.cluster.local
  namespace: default
spec:
  selector:
    app: payment          # এই label এর pods কে route করবেন
  ports:
    - port: 80            # Service port
      targetPort: 8001     # Pod এর actual port
  type: ClusterIP        # Internal only
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-deployment
spec:
  replicas: 3            # 3 pods — K8s Service load balances
  selector:
    matchLabels:
      app: payment
  template:
    metadata:
      labels:
        app: payment
    spec:
      containers:
      - name: payment
        image: payment-service:latest
        ports:
        - containerPort: 8001
        # Order service এখন শুধু "payment-service" use করে
        # কোনো IP hardcode না!`,
                },
            ],
        },
        {
            id: 'realworld',
            subHeader: { index: '005', title: 'Real World' },
            title: (
                <SectionTitle>
                    Real World <span className='italic'>Use Cases</span>
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border border-b bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-blue-500' />
                                        ☸️ Kubernetes DNS
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        সবচেয়ে common। K8s Service create করলেনই
                                        DNS entry হয়।{' '}
                                        <code>
                                            payment-service.default.svc.cluster.local
                                        </code>{' '}
                                        — automatic। কোনো external tool লাগে
                                        না।
                                    </p>
                                </div>
                                <div className='p-8 border-b bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-red-500' />
                                        🎬 Netflix Eureka
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Client-side discovery। প্রতিটা service
                                        Eureka তে register করে। Ribbon load
                                        balancer client-side। Java Spring Cloud
                                        ecosystem।
                                    </p>
                                </div>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        🌐 Istio (Google)
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        K8s তে সবচেয়ে popular service mesh।
                                        Envoy sidecar। Traffic management,
                                        security, observability। Google, Lyft,
                                        IBM এর product।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-purple-500' />
                                        🔗 Consul (HashiCorp)
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        K8s ছাড়াও কাজ করে। Multi-DC। VM এবং
                                        container উভয়ে। Health checking
                                        built-in। Terraform ecosystem এর সাথে
                                        ভালো।
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
            ],
        },
        {
            id: 'interview',
            subHeader: { index: '006', title: 'Interview Preparation' },
            title: (
                <SectionTitle>Common Interview Questions</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Q1: Service Discovery ছাড়া microservices কেন কাজ করে না?',
                    content: (
                        <p>
                            Dynamic environment এ (K8s, auto-scaling) services
                            এর IP constantly বদলায়। Hardcoded IP = broken
                            system। Service Discovery: register on start,
                            deregister on stop, discover by name। এটাই dynamic
                            infrastructure এর foundation।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Q2: Service Mesh কি সবসময় দরকার?',
                    content: (
                        <p>
                            না। Small microservices (৫-১০ services), simple
                            communication — Service Mesh overkill। K8s DNS
                            যথেষ্ট। ৫০+ services, complex traffic policies,
                            zero-trust security, observability দরকার হলে Service
                            Mesh consider করুন।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Q3: Sidecar Pattern কীভাবে কাজ করে?',
                    content: (
                        <p>
                            প্রতিটা service pod এ দুটো container: (1) actual
                            service, (2) Envoy proxy sidecar। সব
                            inbound/outbound traffic proxy দিয়ে যায়। Service
                            কোড change ছাড়াই mTLS, retry, circuit breaking
                            পানয়া যায়। Control Plane (Istiod) সব sidecars কে
                            configure করে।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: 'Interview এ এটা বলুন',
                    content: (
                        <>
                            &quot;Service Discovery এর জন্য আমি Kubernetes এ
                            প্রথমে built-in DNS use করবো — এটা simplest।
                            Complex traffic management, mTLS, observability
                            দরকার হলে Istio বা Linkerd add করবো। ৫-১০ services
                            এ Service Mesh overkill।&quot; — এটাই সঠিক industry
                            approach।
                        </>
                    ),
                },
            ],
        },
        {
            id: 'health-checks',
            subHeader: { index: '007', title: 'Health Checks' },
            title: (
                <SectionTitle>
                    Health Check — কেন গুরুত্বপূর্ণ?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                Service crash হলে registry থেকে remove হওয়া
                                দরকার। Regular health checks (HTTP /health
                                endpoint, TCP check) দিয়ে Consul/K8s
                                automatically unhealthy pods কে deregister করে।
                                Traffic only healthy instances এ যায়।
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: 'Health Check ছাড়া Service Discovery অসম্পূর্ণ',
                    content: (
                        <p className='text-lg leading-relaxed'>
                            Service crash হলে যদি registry তে এখনও registered
                            থাকে, অন্য services সেই dead instance এ traffic
                            পাঠাবে — errors হবে। Health Check ছাড়া Service
                            Discovery কাজ করে না properly।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            Proper Health Check Endpoint Design
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'health_check.py',
                    code: `from fastapi import FastAPI, Response
import httpx
import asyncpg

app = FastAPI()

@app.get("/health")
async def health_check(response: Response):
    """
    Proper health check — সব dependencies check করুন
    """
    checks = {
        "status": "healthy",
        "database": "unknown",
        "external_api": "unknown"
    }

    # Database connection check
    try:
        conn = await asyncpg.connect("postgresql://localhost/mydb")
        await conn.execute("SELECT 1")
        await conn.close()
        checks["database"] = "healthy"
    except Exception as e:
        checks["database"] = f"unhealthy: {str(e)}"
        checks["status"] = "unhealthy"

    # External service check
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.get("https://external-api/ping")
            if resp.status_code == 200:
                checks["external_api"] = "healthy"
            else:
                checks["external_api"] = "degraded"
    except Exception:
        checks["external_api"] = "unhealthy"
        # External service unhealthy কিন্তু আমরা still serve করতে পারবো
        # তাই status "degraded" — critical না হলে

    if checks["status"] == "unhealthy":
        response.status_code = 503  # Service Unavailable

    return checks

# Consul এ register করার সময় এই endpoint দিন:
# "http": "http://localhost:8001/health"
# Consul 503 response দেখলে automatically deregister করবেন`,
                },
            ],
        },
        {
            id: 'comparison',
            subHeader: { index: '008', title: 'Tool Comparison' },
            title: (
                <SectionTitle>
                    কোন Tool কখন ব্যবহার করবো?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <p className='text-muted-foreground leading-relaxed mb-10 text-lg'>
                            Service Discovery এর জন্য অনেক tool আছে। কোনটা
                            কখন ব্যবহার করবেন সেটা জানা important।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Scenario', 'Recommended Tool', 'কারণ'],
                    rows: [
                        [
                            'Kubernetes only environment',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                K8s DNS (built-in)
                            </span>,
                            'No extra setup, automatic, free',
                        ],
                        [
                            'K8s + complex traffic management',
                            <span className='text-blue-700 dark:text-blue-400 font-bold'>
                                Istio
                            </span>,
                            'mTLS, circuit breaking, observability',
                        ],
                        [
                            'K8s + lightweight mesh',
                            <span className='text-purple-700 dark:text-purple-400 font-bold'>
                                Linkerd
                            </span>,
                            'Simpler than Istio, less overhead',
                        ],
                        [
                            'Mixed (VMs + containers)',
                            <span className='text-yellow-700 dark:text-yellow-400 font-bold'>
                                Consul
                            </span>,
                            'Works everywhere, multi-DC support',
                        ],
                        [
                            'AWS managed environment',
                            <span className='text-blue-700 dark:text-blue-400 font-bold'>
                                AWS App Mesh
                            </span>,
                            'Managed, ECS/EKS integration',
                        ],
                        [
                            'Java Spring Cloud apps',
                            <span className='text-red-700 dark:text-red-400 font-bold'>
                                Netflix Eureka + Ribbon
                            </span>,
                            'Spring ecosystem integration',
                        ],
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Decision Framework',
                    content: (
                        <>
                            শুরুতে সবসময় simplest option নাও।{' '}
                            <strong>K8s এ আছো?</strong> → K8s DNS যথেষ্ট।{' '}
                            <strong>mTLS/observability দরকার?</strong> → Istio
                            বা Linkerd যোগ করুন।{' '}
                            <strong>K8s ছাড়া VM আছে?</strong> → Consul। Over-engineer
                            করুন না।
                        </>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: ['Concept', 'এক লাইনে'],
        rows: [
            [
                <span className='font-bold text-primary'>
                    Service Discovery
                </span>,
                'Services নিজেদের register করে, অন্যরা name দিয়ে খোঁজে',
            ],
            [
                <span className='font-bold text-primary'>Client-Side</span>,
                'Client নিজে LB করে — Netflix Eureka+Ribbon',
            ],
            [
                <span className='font-bold text-primary'>Server-Side</span>,
                'LB/Infra করে — K8s Service, AWS ALB',
            ],
            [
                <span className='font-bold text-primary'>K8s DNS</span>,
                'Simplest — Service create করলেনই DNS auto',
            ],
            [
                <span className='font-bold text-primary'>Service Mesh</span>,
                'Sidecar proxy — mTLS, LB, CB, tracing auto',
            ],
            [
                <span className='font-bold text-primary'>Envoy</span>,
                'Industry standard proxy — Istio, Consul, AWS এ',
            ],
            [
                <span className='font-bold text-primary'>Health Check</span>,
                'Unhealthy service automatically deregister হয়',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Service Discovery কেন দরকার?',
                options: [
                    {
                        key: 'A',
                        text: 'Database fast করতে',
                        isCorrect: false,
                        explanation:
                            'Database performance এর সাথে Service Discovery এর কোনো সম্পর্ক নেই।',
                    },
                    {
                        key: 'B',
                        text: 'Dynamic environment এ services এর IP hardcode না করে dynamically discover করতে',
                        isCorrect: true,
                        explanation:
                            'Kubernetes এ pods dynamically scale হয়, IP বদলায়। Hardcoded IP = broken app। Service Discovery: services register করে, অন্যরা name দিয়ে discover করে। IP বদলালেও name same থাকে।',
                    },
                    {
                        key: 'C',
                        text: 'UI render করতে',
                        isCorrect: false,
                        explanation:
                            'UI rendering এর সাথে Service Discovery এর কোনো সম্পর্ক নেই।',
                    },
                    {
                        key: 'D',
                        text: 'Code compile করতে',
                        isCorrect: false,
                        explanation:
                            'Code compilation runtime Service Discovery থেকে আলাদা।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Client-Side Discovery এ load balancing কে করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Server করে',
                        isCorrect: false,
                        explanation:
                            'Server-side discovery তে server করে — client-side এ না।',
                    },
                    {
                        key: 'B',
                        text: 'DNS করে',
                        isCorrect: false,
                        explanation:
                            'DNS name resolution করে কিন্তু load balancing করে না।',
                    },
                    {
                        key: 'C',
                        text: 'Client নিজেই — Registry থেকে instances list নিয়ে choose করে',
                        isCorrect: true,
                        explanation:
                            'Client-Side Discovery তে client Registry থেকে সব available instances এর list নেয় এবং নিজেই load balancing করে (Netflix Ribbon এর মতো)। Server-Side তে LB/Infrastructure এই কাজ করে।',
                    },
                    {
                        key: 'D',
                        text: 'Database করে',
                        isCorrect: false,
                        explanation:
                            'Database load balancing করে না — data store করে।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Kubernetes এ Service Discovery কীভাবে কাজ করে?',
                options: [
                    {
                        key: 'A',
                        text: 'K8s Service create করলেন DNS entry হয় — service name দিয়ে call করা যায়',
                        isCorrect: true,
                        explanation:
                            'K8s Service object create করলেন automatically DNS entry হয়: service-name.namespace.svc.cluster.local। kube-dns / CoreDNS এটা handle করে। কোনো external tool লাগে না।',
                    },
                    {
                        key: 'B',
                        text: 'IP hardcode করতে হয়',
                        isCorrect: false,
                        explanation:
                            'Kubernetes এর পুরো উদ্দেশ্যই IP hardcode করা avoid করা।',
                    },
                    {
                        key: 'C',
                        text: 'Consul manually configure করতে হয়',
                        isCorrect: false,
                        explanation:
                            'K8s এর নিজস্ব built-in service discovery আছে — Consul optional।',
                    },
                    {
                        key: 'D',
                        text: 'External DNS provider লাগে',
                        isCorrect: false,
                        explanation:
                            'K8s cluster internal DNS (CoreDNS) automatically handle করে।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Service Mesh এর Sidecar Proxy কী?',
                options: [
                    {
                        key: 'A',
                        text: 'একটা database',
                        isCorrect: false,
                        explanation:
                            'Sidecar Proxy একটা database নয় — একটা lightweight network proxy।',
                    },
                    {
                        key: 'B',
                        text: 'একটা load balancer',
                        isCorrect: false,
                        explanation:
                            'Load balancing Sidecar Proxy এর একটা feature মাত্র — এটাই সম্পূর্ণ definition নয়।',
                    },
                    {
                        key: 'C',
                        text: 'একটা monitoring tool',
                        isCorrect: false,
                        explanation:
                            'Observability একটা feature কিন্তু Sidecar Proxy এর মূল পরিচয় নয়।',
                    },
                    {
                        key: 'D',
                        text: 'প্রতিটা service এর পাশে থাকা lightweight proxy — সব network traffic intercept করে',
                        isCorrect: true,
                        explanation:
                            'Sidecar = প্রতিটা service pod এ একটা extra proxy container (Envoy)। সব inbound/outbound traffic এই proxy দিয়ে যায়। Service code change ছাড়াই mTLS, circuit breaking, observability পানয়া যায়।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Istio কোন proxy ব্যবহার করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Nginx',
                        isCorrect: false,
                        explanation:
                            'Nginx একটা web server/load balancer — Istio এর sidecar proxy নয়।',
                    },
                    {
                        key: 'B',
                        text: 'Envoy',
                        isCorrect: true,
                        explanation:
                            'Istio Envoy proxy ব্যবহার করে sidecar হিসেবে। Envoy হলো Lyft এর তৈরি high-performance proxy, C++ এ লেখা। Istio ছাড়াও AWS App Mesh এবং Consul Connect Envoy ব্যবহার করে।',
                    },
                    {
                        key: 'C',
                        text: 'HAProxy',
                        isCorrect: false,
                        explanation:
                            'HAProxy একটা load balancer — Istio এর sidecar না।',
                    },
                    {
                        key: 'D',
                        text: 'Traefik',
                        isCorrect: false,
                        explanation:
                            'Traefik একটা reverse proxy/load balancer — Istio এর sidecar না।',
                    },
                ],
            },
            {
                id: 6,
                text: 'mTLS (Mutual TLS) Service Mesh এ কী করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Database encrypt করে',
                        isCorrect: false,
                        explanation:
                            'mTLS database encryption এর জন্য নয় — service-to-service communication এর জন্য।',
                    },
                    {
                        key: 'B',
                        text: 'User password hash করে',
                        isCorrect: false,
                        explanation:
                            'Password hashing application layer এর কাজ — mTLS network layer এ।',
                    },
                    {
                        key: 'C',
                        text: 'Service-to-service communication automatically encrypt করে, উভয় side authenticate করে',
                        isCorrect: true,
                        explanation:
                            'mTLS = Mutual TLS — শুধু server নয়, client ও certificate দিয়ে authenticate করে। Service Mesh এ automatically হয়। Code change লাগে না। Zero-trust network: প্রতিটা service অন্য সব service কে verify করে।',
                    },
                    {
                        key: 'D',
                        text: 'Log compress করে',
                        isCorrect: false,
                        explanation:
                            'Log compression আলাদা feature — mTLS এর কাজ নয়।',
                    },
                ],
            },
            {
                id: 7,
                text: 'কখন Service Mesh use করবেন না?',
                options: [
                    {
                        key: 'A',
                        text: '৫-১০ টা simple microservices এ — complexity worth না',
                        isCorrect: true,
                        explanation:
                            'Service Mesh complex — additional latency (sidecar overhead), steep learning curve, operational complexity। Small systems এ K8s DNS + basic service communication যথেষ্ট। ৫০+ services, complex policies, zero-trust দরকার হলে consider করুন।',
                    },
                    {
                        key: 'B',
                        text: 'Production এ কখনো না',
                        isCorrect: false,
                        explanation:
                            'Service Mesh production এ ব্যবহার হয় — Google, Netflix, Lyft সবাই use করে।',
                    },
                    {
                        key: 'C',
                        text: 'Kubernetes ব্যবহার করলেন সবসময়',
                        isCorrect: false,
                        explanation:
                            'K8s এ Service Mesh optional — K8s এর নিজস্ব DNS আছে।',
                    },
                    {
                        key: 'D',
                        text: 'Java apps এ',
                        isCorrect: false,
                        explanation:
                            'Service Mesh language-agnostic — Java, Python, Go সব language এ কাজ করে।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Netflix এর Client-Side Discovery তে কোন library load balancing করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Zuul',
                        isCorrect: false,
                        explanation:
                            'Zuul হলো Netflix এর API Gateway — client-side load balancer নয়।',
                    },
                    {
                        key: 'B',
                        text: 'Hystrix',
                        isCorrect: false,
                        explanation:
                            'Hystrix হলো Netflix এর circuit breaker library — load balancer নয়।',
                    },
                    {
                        key: 'C',
                        text: 'Feign',
                        isCorrect: false,
                        explanation:
                            'Feign হলো declarative HTTP client — load balancer নয়।',
                    },
                    {
                        key: 'D',
                        text: 'Ribbon',
                        isCorrect: true,
                        explanation:
                            'Netflix OSS Stack: Eureka (discovery) + Ribbon (client-side load balancing) + Hystrix (circuit breaker) + Feign (declarative HTTP client)। Spring Cloud এ এগুলো integrate করা আছে।',
                    },
                ],
            },
            {
                id: 9,
                text: 'Health Check কেন Service Discovery তে গুরুত্বপূর্ণ?',
                options: [
                    {
                        key: 'A',
                        text: 'Performance বাড়াতে',
                        isCorrect: false,
                        explanation:
                            'Health Check directly performance বাড়ায় না — availability নিশ্চিত করে।',
                    },
                    {
                        key: 'B',
                        text: 'Unhealthy instances কে automatically registry থেকে remove করতে — traffic না পাঠাতে',
                        isCorrect: true,
                        explanation:
                            'Service crash হলে registry থেকে remove হওয়া দরকার। Regular health checks (HTTP /health endpoint, TCP check) দিয়ে Consul/K8s automatically unhealthy pods কে deregister করে। Traffic only healthy instances এ যায়।',
                    },
                    {
                        key: 'C',
                        text: 'Database backup করতে',
                        isCorrect: false,
                        explanation:
                            'Database backup Health Check এর কাজ নয়।',
                    },
                    {
                        key: 'D',
                        text: 'SSL certificate renew করতে',
                        isCorrect: false,
                        explanation:
                            'SSL certificate renewal Service Mesh এর mTLS এর অংশ — Health Check এর নয়।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Kubernetes এ payment-service.default.svc.cluster.local এর মানে কী?',
                options: [
                    {
                        key: 'A',
                        text: 'External domain',
                        isCorrect: false,
                        explanation:
                            '.svc.cluster.local suffix দেখেই বোঝা যায় এটা cluster internal — external নয়।',
                    },
                    {
                        key: 'B',
                        text: 'IP address',
                        isCorrect: false,
                        explanation:
                            'এটা একটা DNS name — IP address নয়। CoreDNS এটাকে VIP তে resolve করে।',
                    },
                    {
                        key: 'C',
                        text: 'payment-service নামের K8s Service, default namespace এ, cluster internal DNS',
                        isCorrect: true,
                        explanation:
                            'K8s DNS pattern: [service-name].[namespace].svc.cluster.local। Same namespace এ শুধু service name ব্যবহার করা যায়: payment-service। CoreDNS automatically resolve করে সঠিক Service IP তে।',
                    },
                    {
                        key: 'D',
                        text: 'AWS endpoint',
                        isCorrect: false,
                        explanation:
                            'AWS endpoints এর pattern আলাদা — এটা K8s cluster internal DNS।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Service Discovery & Mesh Analysis',
        time: '২-৩ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>Pattern Comparison:</strong> Client-Side vs Server-Side
                discovery — ৩টা করে pros এবং cons লিখুন। একটা ride-sharing app
                (Pathao/Uber) এ কোনটা use করবেন এবং কেন?
            </span>,
            <span key='2'>
                <strong>K8s YAML:</strong> দেওয়া payment-service.yaml পড়ো। যদি
                payment service এর ৩টা replica চলে এবং একটা crash করে, কী হবে?
                K8s কীভাবে handle করবেন?
            </span>,
            <span key='3'>
                <strong>Consul Exploration:</strong> Consul website (consul.io)
                এ গিয়ে &quot;What is Consul&quot; পড়ো। ZooKeeper এর সাথে ৩টা
                মূল পার্থক্য লিখুন।
            </span>,
            <span key='4'>
                <strong>Service Mesh Decision:</strong> আপনি ১৫টা microservices
                system design করছো। Service Mesh use করবেন কি? কোনটা
                (Istio/Linkerd/Consul Connect) এবং কেন? Justify করুন।
            </span>,
            <span key='5'>
                <strong>Health Check Design:</strong> একটা FastAPI service এর
                জন্য proper /health endpoint design করুন — database connection,
                external service dependency সব check করে।
            </span>,
        ],
        deliverables: [
            <span key='1'>
                Client-Side vs Server-Side comparison table
            </span>,
            <span key='2'>K8s crash scenario analysis</span>,
            <span key='3'>Consul vs ZooKeeper comparison</span>,
            <span key='4'>
                Service Mesh decision with justification
            </span>,
            <span key='5'>Health check endpoint code</span>,
        ],
    },
    practicalLab: {
        title: 'Hands-On Project Task',
        subtitle: 'Consul Service Registry Demo',
        steps: [
            {
                title: 'Consul চালাও',
                description: (
                    <>
                        <code>
                            docker run -d -p 8500:8500 consul:latest
                        </code>{' '}
                        — UI: localhost:8500
                    </>
                ),
            },
            {
                title: 'Order Service বানান',
                description:
                    'FastAPI app যেটা startup এ Consul তে register করে এবং /health endpoint আছে।',
            },
            {
                title: 'Payment Service বানান',
                description:
                    'একইভাবে Consul তে register করে। Order Service Consul থেকে Payment discover করে call করে।',
            },
            {
                title: 'Consul UI দেখুন',
                description:
                    'localhost:8500 এ দুটো service registered দেখবেন। Health check passing।',
            },
            {
                title: 'Payment service kill করুন',
                description:
                    'Payment service stop করুন। Consul automatically unhealthy mark করবেন। Order service graceful error দেবে।',
            },
        ],
        codeBlock: {
            language: 'python',
            filename: 'order_service.py',
            code: `import consul
import socket
import httpx
from fastapi import FastAPI
import atexit

app = FastAPI()
c = consul.Consul(host='localhost', port=8500)

SERVICE_NAME = "order-service"
SERVICE_PORT = 8000
SERVICE_ID = f"order-service-{socket.gethostname()}"

@app.on_event("startup")
async def startup():
    c.agent.service.register(
        name=SERVICE_NAME,
        service_id=SERVICE_ID,
        port=SERVICE_PORT,
        check={
            "http": f"http://localhost:{SERVICE_PORT}/health",
            "interval": "10s",
            "timeout": "5s"
        }
    )
    atexit.register(lambda: c.agent.service.deregister(SERVICE_ID))

@app.get("/health")
async def health():
    return {"status": "healthy", "service": SERVICE_NAME}

@app.post("/orders")
async def create_order(amount: float):
    # Consul থেকে payment service discover করুন
    _, services = c.health.service("payment-service", passing=True)
    if not services:
        return {"error": "Payment service unavailable"}

    svc = services[0]['Service']
    payment_url = f"http://{svc['Address']}:{svc['Port']}"

    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{payment_url}/charge", json={"amount": amount})
        return {"order": "created", "payment": resp.json()}`,
        },
        tip: 'Service Discovery practically দেখবেন — service register হয়, health check fail করে deregister হয়, client discover করে। Kubernetes এর ভেতরে ঠিক এটাই হয়, শুধু automatically।',
    },
};
