'use client';

import { Reveal } from '@/components/motion/reveal';
import { ContentBlock, TopicData, CONTENT_TYPES } from '../../types/content';
import {
    AssignmentSection,
    KnowledgeCheckSection,
    PracticalLabSection,
} from './assessment-sections';
import { BorderCross } from './border-cross';
import { CodeBlock } from './code-block';
import { CompareTable } from './compare-table';
import { InfoBox } from './info-box';
import { StepFlow } from './step-flow';
import { SubHeader } from './sub-header';

export function DynamicTopicContent({ data }: { data: TopicData }) {
    return (
        <div className='space-y-16'>
            {/* Introduction section */}
            {data.introduction && (
                <BorderCross className='p-4 md:p-10 border-b-0'>
                    <div className='mb-12'>
                        <span className='px-3 py-1 bg-accent/10 text-accent font-mono text-[10px] uppercase tracking-widest border border-accent/20'>
                            {data.introduction.badge}
                        </span>
                    </div>
                    <h1 className='text-[1.75rem] sm:text-4xl md:text-5xl xl:text-6xl font-black uppercase tracking-tighter mb-6 md:mb-8 leading-[1.05] break-words'>
                        {data.introduction.title}
                    </h1>
                    <div className='text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 md:mb-12'>
                        {data.introduction.description}
                    </div>

                    <div className='p-6 md:p-8 border border-border bg-card/50 relative overflow-hidden group'>
                        <div className='absolute top-0 left-0 w-1 h-full bg-primary/50' />
                        <div className='text-base md:text-lg font-medium leading-relaxed relative z-10 italic'>
                            &quot;{data.introduction.quote.text}&quot;
                        </div>
                        <div className='mt-4 text-xs md:text-sm font-mono text-muted-foreground'>
                            {data.introduction.quote.author},{' '}
                            <span className='text-accent'>
                                {data.introduction.quote.role}
                            </span>
                        </div>
                    </div>
                </BorderCross>
            )}

            {/* Dynamic Sections */}
            {data.sections.map(section => (
                <Reveal key={section.id}>
                <BorderCross className='p-4 md:p-10'>
                    <section id={section.id} className='scroll-mt-20'>
                        <SubHeader
                            index={section.subHeader.index}
                            title={section.subHeader.title}
                            className='mb-8'
                        />
                        <h2 className='text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6 md:mb-8 leading-[1.1] break-words'>
                            {section.title}
                        </h2>

                        {section.blocks.map((block, idx) => (
                            <BlockRenderer key={idx} block={block} />
                        ))}
                    </section>
                </BorderCross>
                </Reveal>
            ))}

            {/* Summary */}
            {data.summary && (
                <BorderCross className='p-4 md:p-10'>
                    <section id='summary' className='scroll-mt-20'>
                        <SubHeader
                            index={(data.sections.length + 1)
                                .toString()
                                .padStart(3, '0')}
                            title='Lesson Summary'
                            className='mb-8'
                        />
                        <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter mb-6 md:mb-8 leading-none'>
                            SUMMARY: আজকে যা শিখলাম
                        </h2>
                        <CompareTable
                            headers={data.summary.headers}
                            rows={data.summary.rows}
                        />
                    </section>
                </BorderCross>
            )}

            {/* Assessments */}
            {data.knowledgeCheck && (
                <KnowledgeCheckSection
                    index={(data.sections.length + (data.summary ? 2 : 1))
                        .toString()
                        .padStart(3, '0')}
                    questions={data.knowledgeCheck.questions}
                />
            )}

            {data.assignment && (
                <AssignmentSection
                    index={(
                        data.sections.length +
                        (data.summary ? 1 : 0) +
                        (data.knowledgeCheck ? 1 : 0) +
                        1
                    )
                        .toString()
                        .padStart(3, '0')}
                    data={data.assignment}
                />
            )}

            {data.practicalLab && (
                <PracticalLabSection
                    index={(
                        data.sections.length +
                        (data.summary ? 1 : 0) +
                        (data.knowledgeCheck ? 1 : 0) +
                        (data.assignment ? 1 : 0) +
                        1
                    )
                        .toString()
                        .padStart(3, '0')}
                    data={data.practicalLab}
                />
            )}

            {data.phaseComplete && (
                <BorderCross className='p-4 md:p-10'>
                    <div className='flex flex-col items-center text-center py-8 md:py-12'>
                        <div className='text-5xl md:text-6xl mb-6 md:mb-8'>🎉</div>
                        <h2 className='text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-heading mb-4 md:mb-6 tracking-tight break-words'>
                            {data.phaseComplete.title}
                        </h2>
                        <p className='text-base md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8 md:mb-12'>
                            {data.phaseComplete.description}
                        </p>

                        <div className='flex flex-wrap justify-center gap-3 mb-10 md:mb-16'>
                            {data.phaseComplete.topics.map(topic => (
                                <div
                                    key={topic.id}
                                    className='px-4 md:px-6 py-2 md:py-3 border border-accent/30 bg-accent/10 text-accent font-mono text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 md:gap-3'
                                >
                                    <span className='text-accent font-bold'>
                                        ✓
                                    </span>
                                    {topic.title}
                                </div>
                            ))}
                        </div>

                        {data.phaseComplete.nextPhase && (
                            <div className='w-full max-w-3xl p-6 md:p-10 border border-primary/20 bg-primary/5 relative overflow-hidden group'>
                                <div className='absolute top-0 left-0 w-full h-1 bg-primary/20' />
                                <h4 className='font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 md:mb-6'>
                                    {data.phaseComplete.nextPhase.title}
                                </h4>
                                <p className='text-muted-foreground leading-relaxed font-sans text-lg'>
                                    {data.phaseComplete.nextPhase.topics.join(' · ')}
                                </p>
                            </div>
                        )}
                    </div>
                </BorderCross>
            )}
        </div>
    );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
    switch (block.type) {
        case CONTENT_TYPES.HTML:
            return <div className='mb-8'>{block.content}</div>;
        case CONTENT_TYPES.INFO_BOX:
            return (
                <div className='mb-8'>
                    <InfoBox variant={block.variant} title={block.title}>
                        {block.content}
                    </InfoBox>
                </div>
            );
        case CONTENT_TYPES.COMPARE_TABLE:
            return (
                <div className='mb-8'>
                    <CompareTable headers={block.headers} rows={block.rows} />
                </div>
            );
        case CONTENT_TYPES.CODE_BLOCK:
            return (
                <div className='mb-8'>
                    <CodeBlock
                        language={block.language}
                        filename={block.filename}
                        code={block.code}
                    />
                </div>
            );
        case CONTENT_TYPES.STEP_FLOW:
            return (
                <div className='mb-8'>
                    <StepFlow steps={block.steps} stepName={block.stepName} />
                </div>
            );
        case CONTENT_TYPES.CUSTOM:
            return <div className='mb-8'>{block.component}</div>;
        default:
            return null;
    }
}

