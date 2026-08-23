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

export const sagaPatternContent: TopicData = {
    id: 'saga-pattern',
    sections: [
        {
            id: 'intro-concept',
            subHeader: { index: '001', title: 'Why It Matters' },
            title: (
                <SectionTitle>
                    Distributed Transaction কেন কঠিন?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='space-y-6'>
                            <ContentParagraph>
                                Single database এ transaction সহজ — ACID
                                guarantee আছে। কিন্তু microservices এ Order
                                service, Payment service, Inventory service —
                                তিনটা আলাদা database। একটা order place করতে
                                তিনটাতেই write করতে হবে।
                            </ContentParagraph>
                            <ContentParagraph>
                                Payment succeed করলো, কিন্তু Inventory update
                                করতে গিয়ে crash। এখন payment deducted কিন্তু
                                product deliver হবে না।{' '}
                                <strong className='text-foreground'>
                                    Inconsistent state!
                                </strong>
                            </ContentParagraph>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.WARNING,
                    title: '⚠️ 2-Phase Commit (2PC) — পুরনো সমাধান কেন কাজ করে না',
                    content: (
                        <p>
                            2PC একটা coordinator দিয়ে সব services কে lock করে।
                            কিন্তু distributed system এ: coordinator fail করলেন
                            সব services locked। High latency। Microservices এ
                            impractical। এজন্যই <strong>Saga Pattern</strong> এর
                            জন্ম।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: 'DEFINITION',
                    content: (
                        <p>
                            <strong>Saga Pattern</strong> হলো একটা sequence of
                            local transactions। প্রতিটা local transaction তার
                            নিজের database update করে এবং একটা event/message
                            publish করে। কোনো step fail করলেন পূর্ববর্তী steps এর
                            effects undo করার জন্য{' '}
                            <strong>compensating transactions</strong> চালানো
                            হয়।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'problem',
            subHeader: { index: '002', title: 'The Core Problem' },
            title: (
                <SectionTitle>
                    Order Placement — ৩টা Service, ১টা Business Operation
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            একটা e-commerce order flow দেখুন। সব ঠিক চললে easy।
                            কিন্তু মাঝপথে fail করলেন কী হয়?
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='border border-border rounded bg-card/50 p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                ORDER SAGA — Happy Path vs Failure
                            </p>
                            <div className='space-y-6'>
                                <div>
                                    <p className='text-xs font-mono text-emerald-700 dark:text-emerald-400 mb-3 font-bold'>
                                        ✅ HAPPY PATH
                                    </p>
                                    <div className='flex flex-wrap items-center gap-2'>
                                        {[
                                            '1. Order Created ✓',
                                            '2. Payment Charged ✓',
                                            '3. Inventory Reserved ✓',
                                            '4. Notification Sent ✓',
                                        ].map((step, i) => (
                                            <div
                                                key={i}
                                                className='flex items-center gap-2'>
                                                <div className='px-3 py-2 border border-emerald-500 bg-card rounded text-xs font-mono text-emerald-700 dark:text-emerald-400'>
                                                    {step}
                                                </div>
                                                {i < 3 && (
                                                    <span className='text-emerald-700 dark:text-emerald-400 font-mono'>
                                                        →
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                        <div className='ml-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500 rounded text-xs font-mono text-emerald-700 dark:text-emerald-400'>
                                            🎉 Order Complete!
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className='text-xs font-mono text-red-700 dark:text-red-400 mb-3 font-bold'>
                                        ❌ FAILURE PATH
                                    </p>
                                    <div className='flex flex-wrap items-center gap-2 mb-4'>
                                        <div className='px-3 py-2 border border-emerald-500 bg-card rounded text-xs font-mono text-emerald-700 dark:text-emerald-400'>
                                            1. Order Created ✓
                                        </div>
                                        <span className='text-emerald-700 dark:text-emerald-400 font-mono'>
                                            →
                                        </span>
                                        <div className='px-3 py-2 border border-emerald-500 bg-card rounded text-xs font-mono text-emerald-700 dark:text-emerald-400'>
                                            2. Payment Charged ✓
                                        </div>
                                        <span className='text-emerald-700 dark:text-emerald-400 font-mono'>
                                            →
                                        </span>
                                        <div className='px-3 py-2 border-2 border-red-500 bg-card rounded text-xs font-mono text-red-700 dark:text-red-400'>
                                            3. Inventory FAIL! ❌
                                        </div>
                                    </div>
                                    <div className='flex flex-wrap gap-2 ml-8'>
                                        <div className='px-3 py-2 bg-yellow-500/8 border border-yellow-500 rounded text-xs font-mono text-yellow-700 dark:text-yellow-400'>
                                            ↩️ Refund Payment
                                        </div>
                                        <span className='text-yellow-700 dark:text-yellow-400 font-mono'>
                                            →
                                        </span>
                                        <div className='px-3 py-2 bg-yellow-500/8 border border-yellow-500 rounded text-xs font-mono text-yellow-700 dark:text-yellow-400'>
                                            ↩️ Cancel Order
                                        </div>
                                        <span className='text-yellow-700 dark:text-yellow-400 font-mono text-xs self-center'>
                                            ← Compensating Transactions!
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.TIP,
                    title: 'Key Insight',
                    content: (
                        <p>
                            Saga তে <strong>Eventual Consistency</strong> use
                            করা হয়। মানে সব steps complete হওয়ার পর system
                            consistent হবে। Immediate consistency নেই। এটা ACID
                            এর alternative — distributed এ ACID possible না।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'choreography',
            subHeader: { index: '003', title: 'Saga Type 1' },
            title: (
                <SectionTitle>Choreography-based Saga</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            কোনো central coordinator নেই। প্রতিটা service নিজের
                            কাজ করে এবং event publish করে। অন্য services সেই
                            event listen করে নিজের কাজ করে।{' '}
                            <strong className='text-foreground'>
                                Decentralized
                            </strong>{' '}
                            approach।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='border border-border rounded bg-card/50 p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                CHOREOGRAPHY — Event-Driven, No Central Control
                            </p>
                            <div className='flex flex-col gap-4'>
                                <div className='self-center px-6 py-3 border-2 border-orange-400 bg-card rounded text-xs font-mono text-orange-700 dark:text-orange-300 font-bold'>
                                    Event Bus (Kafka / RabbitMQ)
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
                                    <div className='p-4 border border-pink-500 bg-card rounded'>
                                        <p className='text-xs font-mono text-pink-700 dark:text-pink-400 font-bold mb-2'>
                                            Order Service
                                        </p>
                                        <p className='text-[11px] text-muted-foreground'>
                                            1. Create order
                                        </p>
                                        <p className='text-[11px] text-muted-foreground'>
                                            2. Publish:
                                        </p>
                                        <p className='text-[11px] text-orange-700 dark:text-orange-400 font-mono'>
                                            OrderPlaced →
                                        </p>
                                    </div>
                                    <div className='p-4 border border-emerald-500 bg-card rounded'>
                                        <p className='text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold mb-2'>
                                            Payment Service
                                        </p>
                                        <p className='text-[11px] text-muted-foreground'>
                                            Listens: OrderPlaced
                                        </p>
                                        <p className='text-[11px] text-orange-700 dark:text-orange-400 font-mono'>
                                            Publish: PaymentDone →
                                        </p>
                                    </div>
                                    <div className='p-4 border border-purple-500 bg-card rounded'>
                                        <p className='text-xs font-mono text-purple-700 dark:text-purple-400 font-bold mb-2'>
                                            Inventory Service
                                        </p>
                                        <p className='text-[11px] text-muted-foreground'>
                                            Listens: PaymentDone
                                        </p>
                                        <p className='text-[11px] text-orange-700 dark:text-orange-400 font-mono'>
                                            Publish: StockReserved →
                                        </p>
                                    </div>
                                    <div className='p-4 border border-blue-500 bg-card rounded'>
                                        <p className='text-xs font-mono text-blue-700 dark:text-blue-400 font-bold mb-2'>
                                            Notification Svc
                                        </p>
                                        <p className='text-[11px] text-muted-foreground'>
                                            Listens: multiple events
                                        </p>
                                        <p className='text-[11px] text-emerald-700 dark:text-emerald-400'>
                                            ✓ Sends email/SMS
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <h3 className='text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-400 mb-10 mt-16'>
                                Choreography — Pros &amp; Cons
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border'>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        <span className='text-emerald-700 dark:text-emerald-400'>
                                            ✅ Pros
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Simple — কোনো extra orchestrator নেই।
                                        Loose coupling। Services independent।
                                        Scale করা সহজ। Event-driven natural fit।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-red-500' />
                                        <span className='text-red-700 dark:text-red-400'>
                                            ❌ Cons
                                        </span>
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Complex flow বোঝা কঠিন। Debugging কষ্টকর
                                        — event কোথায় গেল? Cyclic dependencies
                                        হতে পারে।
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
            ],
        },
        {
            id: 'orchestration',
            subHeader: { index: '004', title: 'Saga Type 2' },
            title: (
                <SectionTitle>Orchestration-based Saga</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            একটা central{' '}
                            <strong className='text-foreground'>
                                Saga Orchestrator
                            </strong>{' '}
                            পুরো flow control করে। Orchestrator জানে কোন step
                            কখন run করতে হবে এবং কোনো failure তে কোন
                            compensation করতে হবে।{' '}
                            <strong className='text-foreground'>
                                Centralized
                            </strong>{' '}
                            approach।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <div className='border border-border rounded bg-card/50 p-6 overflow-x-auto'>
                            <p className='text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center'>
                                ORCHESTRATION — Central Saga Orchestrator
                            </p>
                            <div className='flex flex-col items-center gap-6'>
                                <div className='px-8 py-4 border-2 border-pink-500 bg-card rounded text-center'>
                                    <p className='text-xs font-mono text-pink-700 dark:text-pink-400 font-bold'>
                                        Saga Orchestrator
                                    </p>
                                    <p className='text-[11px] text-muted-foreground mt-1'>
                                        Knows entire flow + compensations
                                    </p>
                                    <p className='text-[11px] text-muted-foreground'>
                                        State machine — tracks progress
                                    </p>
                                </div>
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 w-full'>
                                    {[
                                        {
                                            color: 'border-emerald-500 text-emerald-700 dark:text-emerald-400',
                                            step: '1. CreateOrder',
                                            label: 'Order Service',
                                        },
                                        {
                                            color: 'border-orange-400 text-orange-700 dark:text-orange-300',
                                            step: '2. ChargePayment',
                                            label: 'Payment Service',
                                        },
                                        {
                                            color: 'border-purple-500 text-purple-700 dark:text-purple-400',
                                            step: '3. ReserveInventory',
                                            label: 'Inventory Service',
                                        },
                                        {
                                            color: 'border-blue-500 text-blue-700 dark:text-blue-400',
                                            step: '4. SendNotification',
                                            label: 'Notification Svc',
                                        },
                                    ].map((s, i) => (
                                        <div
                                            key={i}
                                            className={`p-3 border bg-card rounded text-center ${s.color}`}>
                                            <p className='text-[11px] font-mono font-bold mb-1'>
                                                {s.label}
                                            </p>
                                            <p className='text-[10px] text-muted-foreground'>
                                                {s.step}
                                            </p>
                                            <p className='text-[10px] text-muted-foreground'>
                                                Just executes commands
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Aspect', 'Choreography', 'Orchestration'],
                    rows: [
                        [
                            'Control',
                            'Decentralized (events)',
                            'Centralized (orchestrator)',
                        ],
                        [
                            'Coupling',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Loose
                            </span>,
                            <span className='text-yellow-700 dark:text-yellow-400'>Moderate</span>,
                        ],
                        [
                            'Visibility',
                            <span className='text-red-700 dark:text-red-400'>Hard to track</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Easy to visualize
                            </span>,
                        ],
                        [
                            'Debugging',
                            <span className='text-red-700 dark:text-red-400'>Difficult</span>,
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Centralized logs
                            </span>,
                        ],
                        [
                            'Simple flows',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Better
                            </span>,
                            'Overkill',
                        ],
                        [
                            'Complex flows',
                            'Gets messy',
                            <span className='text-emerald-700 dark:text-emerald-400 font-bold'>
                                Better
                            </span>,
                        ],
                        [
                            'Tools',
                            'Kafka, RabbitMQ',
                            'Temporal, AWS Step Functions',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'compensation',
            subHeader: { index: '005', title: 'Compensating Transactions' },
            title: (
                <SectionTitle>
                    Failure হলে কীভাবে Rollback করবেন?
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <ContentParagraph>
                            Traditional database rollback Saga তে কাজ করে না।
                            কারণ প্রতিটা step আলাদা service এ committed হয়ে
                            গেছে। তাই প্রতিটা step এর জন্য একটা{' '}
                            <strong className='text-foreground'>
                                compensating transaction
                            </strong>{' '}
                            define করতে হয়।
                        </ContentParagraph>
                    ),
                },
                {
                    type: CONTENT_TYPES.STEP_FLOW,
                    steps: [
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    T1 — Order Service: Order Create করুন
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Compensation:{' '}
                                    <span className='text-yellow-700 dark:text-yellow-400'>
                                        Order Cancel করুন (order status =
                                        CANCELLED)
                                    </span>
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-emerald-700 dark:text-emerald-400'>
                                    T2 — Payment Service: Payment Charge করুন
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Compensation:{' '}
                                    <span className='text-yellow-700 dark:text-yellow-400'>
                                        Refund করুন (full amount return)
                                    </span>
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-red-700 dark:text-red-400'>
                                    T3 — Inventory Service: Stock Reserve করতে
                                    গিয়ে FAIL! ❌
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Stock নেই! এখন backward compensation চলবে…
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-yellow-700 dark:text-yellow-400'>
                                    C2 — Payment Service: Refund চালাও
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Payment reversed। Customer কে money ফেরত।{' '}
                                    <span className='text-emerald-700 dark:text-emerald-400'>
                                        Done ✓
                                    </span>
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className='font-mono text-yellow-700 dark:text-yellow-400'>
                                    C1 — Order Service: Order Cancel করুন
                                </span>
                            ),
                            description: (
                                <span className='text-muted-foreground'>
                                    Order status = CANCELLED।{' '}
                                    <span className='text-emerald-700 dark:text-emerald-400'>
                                        Done ✓
                                    </span>{' '}
                                    System eventually consistent।
                                </span>
                            ),
                        },
                    ],
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.IMPORTANT,
                    title: '⚠️ Idempotency — Critical Requirement',
                    content: (
                        <p>
                            Compensating transactions{' '}
                            <strong>idempotent</strong> হতে হবে। মানে একই
                            operation বারবার চালালেও same result। Network
                            failure তে retry করলেন double refund হওয়া চলবে না।
                            Unique transaction ID ব্যবহার করুন।
                        </p>
                    ),
                },
            ],
        },
        {
            id: 'code',
            subHeader: { index: '006', title: 'Code Examples' },
            title: <SectionTitle>Practical Code</SectionTitle>,
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mb-6'>
                            Python: Orchestration-based Saga State Machine
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'python',
                    filename: 'order_saga_orchestrator.py',
                    code: `from enum import Enum
from dataclasses import dataclass, field
from typing import List
import uuid

class SagaState(Enum):
    STARTED = "started"
    ORDER_CREATED = "order_created"
    PAYMENT_CHARGED = "payment_charged"
    INVENTORY_RESERVED = "inventory_reserved"
    COMPLETED = "completed"
    # Compensating states
    COMPENSATING = "compensating"
    COMPENSATED = "compensated"
    FAILED = "failed"

@dataclass
class OrderSaga:
    saga_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    state: SagaState = SagaState.STARTED
    order_id: str = None
    payment_id: str = None
    inventory_reserved: bool = False
    compensations_done: List[str] = field(default_factory=list)

class OrderSagaOrchestrator:
    """Central orchestrator — entire saga flow এবং compensations manage করে"""

    def execute(self, user_id: str, product_id: str, amount: float) -> dict:
        saga = OrderSaga()
        print(f"\\n🚀 Starting Saga: {saga.saga_id}")

        # Step 1: Create Order
        try:
            saga.order_id = self._create_order(user_id, product_id, amount)
            saga.state = SagaState.ORDER_CREATED
            print(f"✅ T1: Order created: {saga.order_id}")
        except Exception as e:
            saga.state = SagaState.FAILED
            return {"status": "failed", "reason": f"Order creation failed: {e}"}

        # Step 2: Charge Payment
        try:
            saga.payment_id = self._charge_payment(user_id, amount)
            saga.state = SagaState.PAYMENT_CHARGED
            print(f"✅ T2: Payment charged: {saga.payment_id}")
        except Exception as e:
            print(f"❌ T2 failed: {e} — Compensating T1...")
            self._compensate_order(saga.order_id)
            saga.compensations_done.append("order_cancelled")
            saga.state = SagaState.COMPENSATED
            return {"status": "failed", "reason": "Payment failed", "compensated": True}

        # Step 3: Reserve Inventory
        try:
            self._reserve_inventory(product_id)
            saga.inventory_reserved = True
            saga.state = SagaState.INVENTORY_RESERVED
            print(f"✅ T3: Inventory reserved for {product_id}")
        except Exception as e:
            print(f"❌ T3 failed: {e} — Compensating T2, T1...")
            self._refund_payment(saga.payment_id, amount)     # C2
            self._compensate_order(saga.order_id)             # C1
            saga.compensations_done.extend(["payment_refunded", "order_cancelled"])
            saga.state = SagaState.COMPENSATED
            return {"status": "failed", "reason": "Out of stock",
                    "compensated": True, "refunded": amount}

        saga.state = SagaState.COMPLETED
        print(f"🎉 Saga COMPLETED: order={saga.order_id}")
        return {"status": "success", "order_id": saga.order_id}

    def _create_order(self, user_id, product_id, amount) -> str:
        return f"order_{uuid.uuid4().hex[:8]}"

    def _charge_payment(self, user_id, amount) -> str:
        if amount > 10000: raise Exception("Insufficient funds")
        return f"pay_{uuid.uuid4().hex[:8]}"

    def _reserve_inventory(self, product_id):
        if product_id == "OUT_OF_STOCK": raise Exception("No stock!")

    def _compensate_order(self, order_id):
        print(f"  ↩️ C1: Order {order_id} cancelled")

    def _refund_payment(self, payment_id, amount):
        print(f"  ↩️ C2: Payment {payment_id} refunded ৳{amount}")

# Test
orchestrator = OrderSagaOrchestrator()
print("=== Happy Path ===")
orchestrator.execute("user1", "product1", 500)
print("\\n=== Out of Stock ===")
orchestrator.execute("user2", "OUT_OF_STOCK", 500)`,
                },
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <h3 className='text-xl font-bold mt-16 mb-6'>
                            Node.js: Choreography with Event Bus
                        </h3>
                    ),
                },
                {
                    type: CONTENT_TYPES.CODE_BLOCK,
                    language: 'javascript',
                    filename: 'choreography_saga.js',
                    code: `const EventEmitter = require('events');
const bus = new EventEmitter(); // In production: Kafka/RabbitMQ

// ===== ORDER SERVICE =====
bus.on('order.start', ({ orderId, userId, productId, amount }) => {
    console.log(\`📦 OrderService: Creating order \${orderId}\`);
    // Save to DB, then publish next event
    bus.emit('order.created', { orderId, userId, productId, amount });
});

bus.on('order.cancel', ({ orderId, reason }) => {
    console.log(\`↩️  OrderService: Cancelling order \${orderId} — \${reason}\`);
});

// ===== PAYMENT SERVICE =====
bus.on('order.created', ({ orderId, userId, amount }) => {
    console.log(\`💳 PaymentService: Charging ৳\${amount} for \${orderId}\`);
    try {
        if (amount > 10000) throw new Error('Insufficient funds');
        const paymentId = \`pay_\${Date.now()}\`;
        bus.emit('payment.charged', { orderId, paymentId, amount });
    } catch (err) {
        // Compensation: cancel the order
        bus.emit('order.cancel', { orderId, reason: err.message });
    }
});

bus.on('payment.refund', ({ paymentId, amount }) => {
    console.log(\`↩️  PaymentService: Refunding ৳\${amount} for \${paymentId}\`);
});

// ===== INVENTORY SERVICE =====
bus.on('payment.charged', ({ orderId, paymentId, amount }) => {
    console.log(\`📦 InventoryService: Reserving stock for \${orderId}\`);
    try {
        if (orderId.includes('nostock')) throw new Error('Out of stock');
        bus.emit('inventory.reserved', { orderId });
    } catch (err) {
        // Compensations: refund + cancel order
        bus.emit('payment.refund', { paymentId, amount });
        bus.emit('order.cancel', { orderId, reason: err.message });
    }
});

bus.on('inventory.reserved', ({ orderId }) => {
    console.log(\`🎉 SAGA COMPLETE: Order \${orderId} fulfilled!\`);
});

// Test happy path
bus.emit('order.start', { orderId: 'ord-001', userId: 'u1', productId: 'p1', amount: 500 });
// Test failure path
bus.emit('order.start', { orderId: 'nostock-002', userId: 'u2', productId: 'p2', amount: 200 });`,
                },
            ],
        },
        {
            id: 'realworld',
            subHeader: { index: '007', title: 'Real World' },
            title: (
                <SectionTitle>
                    Real World Use Cases &amp; Tools
                </SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.HTML,
                    content: (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 border border-border mb-10'>
                                <div className='p-8 border-r border-border bg-card/30 border-b border-border'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-blue-500' />
                                        🛒 Amazon / Flipkart
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Order placement saga: order → payment →
                                        inventory → shipping → notification।
                                        প্রতিটা step আলাদা service। Failure তে
                                        automatic compensation।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30 border-b border-border'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-emerald-500' />
                                        🚗 Uber
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Ride request saga: request → driver
                                        matching → payment pre-auth → GPS
                                        tracking। Cancel করলেন compensation —
                                        pre-auth release।
                                    </p>
                                </div>
                                <div className='p-8 border-r border-border bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-purple-500' />
                                        ✈️ Booking.com
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Travel booking: flight + hotel + car
                                        rental। একটা fail করলেন অন্যগুলো
                                        compensate। Complex multi-service saga।
                                    </p>
                                </div>
                                <div className='p-8 bg-card/30'>
                                    <h4 className='font-bold text-foreground mb-4 flex items-center gap-3 font-mono uppercase tracking-widest text-[10px]'>
                                        <span className='w-1.5 h-1.5 bg-yellow-500' />
                                        💳 Fintech Apps
                                    </h4>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        Money transfer saga: debit source →
                                        credit destination → notify both।
                                        Failure তে reverse debit। Idempotency
                                        critical।
                                    </p>
                                </div>
                            </div>
                        </>
                    ),
                },
                {
                    type: CONTENT_TYPES.COMPARE_TABLE,
                    headers: ['Tool', 'Type', 'Best For'],
                    rows: [
                        [
                            'AWS Step Functions',
                            'Orchestration',
                            'AWS ecosystem saga orchestration',
                        ],
                        [
                            'Temporal.io',
                            'Orchestration',
                            'Complex durable workflows, code-first',
                        ],
                        [
                            'Apache Kafka',
                            'Choreography',
                            'Event-driven saga, high throughput',
                        ],
                        ['Axon Framework', 'Both', 'Java/Spring CQRS + Saga'],
                        [
                            'Conductor (Netflix)',
                            'Orchestration',
                            'Microservices workflow engine',
                        ],
                    ],
                },
            ],
        },
        {
            id: 'interview',
            subHeader: { index: '008', title: 'Interview Preparation' },
            title: (
                <SectionTitle>Common Interview Questions</SectionTitle>
            ),
            blocks: [
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Q1: 2PC এবং Saga এর পার্থক্য কী?',
                    content: (
                        <p>
                            <strong>2PC:</strong> Distributed ACID transaction।
                            Coordinator সব services lock করে। Strong consistency
                            কিন্তু blocking, failure prone।
                            <br />
                            <strong>Saga:</strong> Sequence of local
                            transactions + compensations। Eventual consistency।
                            Non-blocking। Microservices এ suitable।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Q2: Choreography vs Orchestration কখন কোনটা?',
                    content: (
                        <p>
                            <strong>Choreography:</strong> Simple flows, ৩-৪টা
                            steps, loose coupling priority। Event-driven system
                            এ natural।
                            <br />
                            <strong>Orchestration:</strong> Complex flows, many
                            steps, visibility দরকার, compensation logic complex।
                            AWS Step Functions, Temporal।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Q3: Saga তে Idempotency কেন critical?',
                    content: (
                        <p>
                            Network failure তে messages retry হয়। একই
                            compensation দুইবার execute হতে পারে। Payment refund
                            দুইবার হলে double refund। প্রতিটা operation এ unique
                            ID track করুন — already processed হলে skip করুন।
                        </p>
                    ),
                },
                {
                    type: CONTENT_TYPES.INFO_BOX,
                    variant: INFO_BOX_VARIANTS.CONCEPT,
                    title: '🎯 Q4: Saga এর limitations কী?',
                    content: (
                        <p>
                            <strong>1)</strong> No immediate consistency —
                            eventual। <strong>2)</strong> Compensating
                            transactions complex লেখা। <strong>3)</strong>{' '}
                            Partial state visible to users (e.g., order created
                            কিন্তু payment pending)। <strong>4)</strong>{' '}
                            Debugging difficult in choreography। এগুলো
                            trade-offs।
                        </p>
                    ),
                },
            ],
        },
    ],
    summary: {
        headers: ['Concept', 'এক লাইনে'],
        rows: [
            [
                <span className='font-bold text-primary'>Saga Pattern</span>,
                'Local transactions + compensations = distributed transaction',
            ],
            [
                <span className='font-bold text-primary'>Compensating TX</span>,
                'Failed step এর আগের steps undo করে',
            ],
            [
                <span className='font-bold text-primary'>Choreography</span>,
                'Events দিয়ে decentralized flow — loose coupling',
            ],
            [
                <span className='font-bold text-primary'>Orchestration</span>,
                'Central orchestrator — visibility ভালো, complex flow',
            ],
            [
                <span className='font-bold text-primary'>
                    Eventual Consistency
                </span>,
                'ACID না — সব steps complete হলে consistent',
            ],
            [
                <span className='font-bold text-primary'>Idempotency</span>,
                'Same operation দুইবার — same result, no double effect',
            ],
            [
                <span className='font-bold text-primary'>
                    Temporal / Step Fn
                </span>,
                'Production saga orchestration tools',
            ],
        ],
    },
    knowledgeCheck: {
        questions: [
            {
                id: 1,
                text: 'Saga Pattern কেন দরকার হয়?',
                options: [
                    {
                        key: 'A',
                        text: 'Database query fast করতে',
                        isCorrect: false,
                        explanation:
                            'Saga Pattern query optimization এর জন্য নয়।',
                    },
                    {
                        key: 'B',
                        text: 'UI design করতে',
                        isCorrect: false,
                        explanation:
                            'Saga Pattern frontend এর সাথে সম্পর্কিত নয়।',
                    },
                    {
                        key: 'C',
                        text: 'Multiple microservices এ spanning transactions manage করতে — 2PC distributed system এ practical না',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Single database এ ACID আছে। কিন্তু microservices এ আলাদা databases — distributed transaction দরকার। 2PC blocking, failure prone। Saga: local transactions + compensations = eventual consistency।',
                    },
                    {
                        key: 'D',
                        text: 'API rate limit করতে',
                        isCorrect: false,
                        explanation:
                            'Rate limiting আলাদা pattern — Saga এর কাজ নয়।',
                    },
                ],
            },
            {
                id: 2,
                text: 'Compensating Transaction কী?',
                options: [
                    {
                        key: 'A',
                        text: 'Saga step fail করলেন পূর্ববর্তী steps এর effects undo করার transaction',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Payment charge হয়েছে কিন্তু inventory নেই? Compensating transaction: refund করুন। Order created কিন্তু payment failed? Cancel order করুন। Compensations backward চলে — latest first।',
                    },
                    {
                        key: 'B',
                        text: 'Database backup নেওয়া',
                        isCorrect: false,
                        explanation:
                            'Database backup compensating transaction নয়।',
                    },
                    {
                        key: 'C',
                        text: 'New user create করা',
                        isCorrect: false,
                        explanation: 'User creation saga compensation নয়।',
                    },
                    {
                        key: 'D',
                        text: 'Cache clear করা',
                        isCorrect: false,
                        explanation: 'Cache management Saga compensation নয়।',
                    },
                ],
            },
            {
                id: 3,
                text: 'Choreography-based Saga তে কে flow control করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Central orchestrator',
                        isCorrect: false,
                        explanation:
                            'Central orchestrator — এটা Orchestration-based Saga এর বৈশিষ্ট্য।',
                    },
                    {
                        key: 'B',
                        text: 'Database',
                        isCorrect: false,
                        explanation:
                            'Database flow control করে না Choreography তে।',
                    },
                    {
                        key: 'C',
                        text: 'API Gateway',
                        isCorrect: false,
                        explanation: 'API Gateway Saga flow control করে না।',
                    },
                    {
                        key: 'D',
                        text: 'কেউ না — services নিজেরাই events publish করে এবং others listen করে react করে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Choreography decentralized। Order service event publish করে, Payment service শুনে, আবার event publish করে, Inventory service শুনে — কোনো central coordinator নেই। Loose coupling।',
                    },
                ],
            },
            {
                id: 4,
                text: 'Orchestration-based Saga এর সুবিধা কী?',
                options: [
                    {
                        key: 'A',
                        text: 'No single point of failure',
                        isCorrect: false,
                        explanation:
                            'Orchestration এ orchestrator একটি single point of failure হতে পারে।',
                    },
                    {
                        key: 'B',
                        text: 'Flow centralized — visibility ভালো, debugging সহজ, complex compensation manage করা যায়',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Orchestration এ Saga Orchestrator পুরো flow জানে। Dashboard এ দেখা যায় কোন step এ আছে। Complex compensations orchestrator manage করে। AWS Step Functions, Temporal এই approach use করে।',
                    },
                    {
                        key: 'C',
                        text: 'সবচেয়ে loose coupling',
                        isCorrect: false,
                        explanation:
                            'Loose coupling Choreography এর বৈশিষ্ট্য, Orchestration এর নয়।',
                    },
                    {
                        key: 'D',
                        text: 'No message queue দরকার',
                        isCorrect: false,
                        explanation:
                            'Orchestration এও message queue প্রয়োজন হতে পারে।',
                    },
                ],
            },
            {
                id: 5,
                text: 'Saga কোন consistency model follow করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Strong consistency (ACID)',
                        isCorrect: false,
                        explanation:
                            'Saga ACID নয় — distributed এ ACID possible না।',
                    },
                    {
                        key: 'B',
                        text: 'Linearizability',
                        isCorrect: false,
                        explanation:
                            'Linearizability Saga এর consistency model নয়।',
                    },
                    {
                        key: 'C',
                        text: 'Eventual consistency — সব steps complete হলে system consistent হয়',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Saga Eventual Consistency use করে। মাঝপথে intermediate state দেখা যেতে পারে (order created কিন্তু payment pending)। এটা accepted trade-off। All steps complete হলে system consistent।',
                    },
                    {
                        key: 'D',
                        text: 'No consistency',
                        isCorrect: false,
                        explanation:
                            'Saga eventual consistency নিশ্চিত করে — no consistency নয়।',
                    },
                ],
            },
            {
                id: 6,
                text: 'Compensating Transaction Idempotent হতে হবে কেন?',
                options: [
                    {
                        key: 'A',
                        text: 'Fast হতে',
                        isCorrect: false,
                        explanation: 'Speed idempotency এর কারণ নয়।',
                    },
                    {
                        key: 'B',
                        text: 'Cache করতে',
                        isCorrect: false,
                        explanation: 'Caching idempotency এর উদ্দেশ্য নয়।',
                    },
                    {
                        key: 'C',
                        text: 'Security বাড়াতে',
                        isCorrect: false,
                        explanation:
                            'Security idempotency এর primary concern নয়।',
                    },
                    {
                        key: 'D',
                        text: 'Network failure তে retry করলেন same compensation দুইবার execute হতে পারে — double refund রোধ করতে',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Message retry হলে compensation দুইবার চলতে পারে। Refund দুইবার → double money। Idempotency: unique transaction ID check করুন — already refunded? Skip। এটাই Saga এর critical requirement।',
                    },
                ],
            },
            {
                id: 7,
                text: '2PC (Two-Phase Commit) distributed system এ কেন problematic?',
                options: [
                    {
                        key: 'A',
                        text: 'Coordinator fail করলেন সব services indefinitely locked থাকে — availability নষ্ট হয়',
                        isCorrect: true,
                        explanation:
                            'সঠিক। 2PC: Phase 1 = coordinator সব participants কে prepare বলে (lock)। Phase 2 = commit/rollback। Coordinator crash করলেন participants locked — কেউ আগাতে পারে না। Microservices এ high latency, blocking — impractical।',
                    },
                    {
                        key: 'B',
                        text: '2PC শুধু SQL database এ কাজ করে',
                        isCorrect: false,
                        explanation: 'এটা 2PC এর প্রধান সমস্যা নয়।',
                    },
                    {
                        key: 'C',
                        text: '2PC শুধু monolith এ কাজ করে',
                        isCorrect: false,
                        explanation:
                            '2PC distributed system এ exist করে কিন্তু impractical।',
                    },
                    {
                        key: 'D',
                        text: '2PC কোনো consistency দেয় না',
                        isCorrect: false,
                        explanation:
                            '2PC strong consistency দেয় — কিন্তু availability sacrifice করে।',
                    },
                ],
            },
            {
                id: 8,
                text: 'Temporal.io কী কাজ করে?',
                options: [
                    {
                        key: 'A',
                        text: 'Database migration tool',
                        isCorrect: false,
                        explanation: 'Temporal database migration tool নয়।',
                    },
                    {
                        key: 'B',
                        text: 'Durable workflow orchestration — Saga orchestration code হিসেবে লেখা যায়, automatic state persistence',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Temporal durable workflow engine। Saga টা regular code হিসেবে লিখুন — Temporal automatically state persist করে। Crash হলেও resume করে যেখানে ছিল। Uber, Netflix, Hashicorp use করে।',
                    },
                    {
                        key: 'C',
                        text: 'Load balancer',
                        isCorrect: false,
                        explanation: 'Temporal load balancer নয়।',
                    },
                    {
                        key: 'D',
                        text: 'Rate limiter',
                        isCorrect: false,
                        explanation: 'Temporal rate limiting এর জন্য নয়।',
                    },
                ],
            },
            {
                id: 9,
                text: 'একটা ride-sharing app এ user ride cancel করলেন কোন compensation হবে?',
                options: [
                    {
                        key: 'A',
                        text: 'শুধু notification পাঠানো',
                        isCorrect: false,
                        explanation:
                            'Notification পাঠানো যথেষ্ট নয় — payment এবং matching undo করতে হবে।',
                    },
                    {
                        key: 'B',
                        text: 'Driver কে নতুন ride দেওয়া',
                        isCorrect: false,
                        explanation: 'নতুন ride assignment compensation নয়।',
                    },
                    {
                        key: 'C',
                        text: 'Pre-authorized payment release করা + driver কে notify করা + matching undo করা',
                        isCorrect: true,
                        explanation:
                            'সঠিক। Ride saga: match driver → pre-auth payment → start ride। Cancel compensation: release payment pre-auth (C1), notify driver free (C2), matching undo (C3)। Backward compensation in order।',
                    },
                    {
                        key: 'D',
                        text: 'User account block করা',
                        isCorrect: false,
                        explanation: 'User block করা compensation নয়।',
                    },
                ],
            },
            {
                id: 10,
                text: 'Complex order management system (১০+ steps) এর জন্য কোনটা better?',
                options: [
                    {
                        key: 'A',
                        text: 'Choreography — সবসময় better',
                        isCorrect: false,
                        explanation:
                            'Choreography সবসময় better নয় — complex flow এ messy হয়ে যায়।',
                    },
                    {
                        key: 'B',
                        text: '2PC — strong consistency দরকার',
                        isCorrect: false,
                        explanation: '2PC distributed system এ impractical।',
                    },
                    {
                        key: 'C',
                        text: 'No saga — monolith use করুন',
                        isCorrect: false,
                        explanation:
                            'Complex microservices এ monolith ফিরে যানয়া সমাধান নয়।',
                    },
                    {
                        key: 'D',
                        text: 'Orchestration — complex flow, visibility, compensation management সহজ। Temporal বা AWS Step Functions use করুন',
                        isCorrect: true,
                        explanation:
                            'সঠিক। ১০+ steps, complex compensation logic — Orchestration best। Choreography তে event spaghetti হয়ে যাবেন কে কোথায় listen করছে বোঝা মুশকিল। Orchestration এ central orchestrator পুরো flow জানে।',
                    },
                ],
            },
        ],
    },
    assignment: {
        title: 'Saga Pattern — Design & Implementation',
        time: '৩-৪ ঘণ্টা',
        difficulty: 'Junior Level',
        tasks: [
            <span key='1'>
                <strong>Saga Design:</strong> একটা travel booking app design করুন
                (flight + hotel + car)। প্রতিটা booking step এর জন্য transaction
                এবং compensating transaction লিখুন। কোন approach নেবে —
                Choreography নাকি Orchestration? কেন?
            </span>,
            <span key='2'>
                <strong>Failure Scenarios:</strong> আপনার travel booking saga তে
                ৩টা failure scenario নিয়ে কাজ করুন। প্রতিটায় কোন compensations
                চলবে এবং কোন order এ — সেটা step-by-step লিখুন।
            </span>,
            <span key='3'>
                <strong>Code Analysis:</strong> দেওয়া Python Orchestrator code
                পড়ো। যদি <code>_refund_payment()</code> নিজেই fail করে তাহলে কী
                হবে? এই problem টা কীভাবে handle করবেন?
            </span>,
            <span key='4'>
                <strong>Idempotency Implementation:</strong> দেওয়া Node.js
                choreography code তে payment refund handler টা idempotent করুন —
                same paymentId তে দুইবার call হলে দ্বিতীয়বার skip করবেন।
            </span>,
            <span key='5'>
                <strong>Tool Comparison:</strong> AWS Step Functions এবং
                Temporal.io — দুটোর documentation পড়ো। কোনটা কোন use case এ
                better? ৫-৭ লাইনে comparison লিখুন।
            </span>,
        ],
        deliverables: [
            <span key='1'>Travel booking Saga design document</span>,
            <span key='2'>Failure scenarios + compensation flows</span>,
            <span key='3'>Analysis of nested failure handling</span>,
            <span key='4'>Idempotent payment refund implementation</span>,
            <span key='5'>AWS Step Functions vs Temporal comparison</span>,
        ],
    },
    practicalLab: {
        title: 'Hands-On Project Task',
        subtitle: 'Complete Order Saga — Python FastAPI',
        steps: [
            {
                title: '৩টা Mock Service বানান',
                description:
                    'Order Service (:8000), Payment Service (:8001), Inventory Service (:8002) — প্রতিটায় success/fail endpoints।',
            },
            {
                title: 'Saga Orchestrator লিখুন',
                description:
                    'Python class যেটা HTTP calls করে steps execute করে এবং failure তে compensations চালায়।',
            },
            {
                title: 'State Tracking যোগ করুন',
                description:
                    'Saga state (STARTED → STEP1 → STEP2 → COMPLETED / COMPENSATED) SQLite বা in-memory dict এ track করুন।',
            },
            {
                title: 'Happy Path Test করুন',
                description:
                    'সব services সফলভাবে কাজ করলেন COMPLETED state দেখুন।',
            },
            {
                title: 'Failure Test করুন',
                description:
                    'Inventory service fail করাও। Automatic compensation দেখুন — payment refund, order cancel।',
            },
            {
                title: 'Bonus: Idempotency',
                description:
                    'Same saga_id দুইবার submit করুন — দ্বিতীয়বার same result return করে কিনা দেখুন।',
            },
        ],
        codeBlock: {
            language: 'python',
            filename: 'order_saga_orchestrator.py',
            code: `from fastapi import FastAPI
import httpx, uuid, asyncio

app = FastAPI()
saga_store = {}  # In-memory saga state tracking

@app.post("/saga/order")
async def start_order_saga(user_id: str, product_id: str, amount: float):
    saga_id = str(uuid.uuid4())
    saga_store[saga_id] = {"state": "STARTED", "steps": []}

    async with httpx.AsyncClient() as client:
        # T1: Create Order
        r1 = await client.post("http://localhost:8000/order", json={"user_id": user_id})
        if r1.status_code != 200:
            saga_store[saga_id]["state"] = "FAILED"
            return {"saga_id": saga_id, "status": "FAILED", "reason": "Order creation failed"}
        order_id = r1.json()["order_id"]
        saga_store[saga_id]["steps"].append("ORDER_CREATED")

        # T2: Charge Payment
        r2 = await client.post("http://localhost:8001/payment", json={"amount": amount})
        if r2.status_code != 200:
            # C1: Cancel Order
            await client.delete(f"http://localhost:8000/order/{order_id}")
            saga_store[saga_id]["state"] = "COMPENSATED"
            return {"saga_id": saga_id, "status": "FAILED", "reason": "Payment failed"}
        payment_id = r2.json()["payment_id"]
        saga_store[saga_id]["steps"].append("PAYMENT_CHARGED")

        # T3: Reserve Inventory
        r3 = await client.post("http://localhost:8002/inventory", json={"product_id": product_id})
        if r3.status_code != 200:
            # C2: Refund Payment, C1: Cancel Order
            await client.delete(f"http://localhost:8001/payment/{payment_id}")
            await client.delete(f"http://localhost:8000/order/{order_id}")
            saga_store[saga_id]["state"] = "COMPENSATED"
            return {"saga_id": saga_id, "status": "FAILED", "reason": "Out of stock", "refunded": amount}

        saga_store[saga_id]["state"] = "COMPLETED"
        return {"saga_id": saga_id, "status": "COMPLETED", "order_id": order_id}`,
        },
        tip: 'Saga theory নয় — practically দেখবেন distributed transaction কীভাবে works করে, compensation কীভাবে চলে, এবং partial failure কীভাবে handle হয়। এটাই senior engineer level system design।',
    },
    phaseComplete: {
        title: 'Phase 3 — Distributed Systems Complete!',
        description:
            'আপনি System Design Mastery Course এর Phase 3 সম্পূর্ণ করেছেনো। Distributed Systems এর ৬টি core topic এ solid foundation তৈরি হয়েছে।',
        topics: [
            { title: 'Topic 1: Microservices', id: 'microservices' },
            {
                title: 'Topic 2: Distributed Consensus',
                id: 'distributed-consensus',
            },
            { title: 'Topic 3: Circuit Breaker', id: 'circuit-breaker' },
            { title: 'Topic 4: Rate Limiting', id: 'rate-limiting' },
            { title: 'Topic 5: Service Discovery', id: 'service-discovery' },
            { title: 'Topic 6: Saga Pattern', id: 'saga-pattern' },
        ],
        nextPhase: {
            title: 'PHASE 4 — Real-World Systems:',
            topics: [
                'URL Shortener Design',
                'Chat System Design',
                'Video Streaming Architecture',
                'Search Engine Design',
                'Payment System Design',
                'Social Media Feed',
            ],
        },
    },
};

