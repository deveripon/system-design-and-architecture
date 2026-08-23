'use client';

import { TopicData } from '../../types/content';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { Assignment } from './assignment';
import { BorderCross } from './border-cross';
import { CodeBlock } from './code-block';
import { InfoBox } from './info-box';
import { MCQ } from './mcq';
import { StepFlow } from './step-flow';
import { Collapse } from '@/components/motion/collapse';
import { SubHeader } from './sub-header';

export const KnowledgeCheckSection = React.memo(
    ({
        questions,
        index,
    }: {
        questions: NonNullable<TopicData['knowledgeCheck']>['questions'];
        index: string;
    }) => {
        const [isExpanded, setIsExpanded] = React.useState(false);

        return (
            <BorderCross className='p-4 md:p-10'>
                <section id='mcq' className='scroll-mt-20'>
                    <div
                        className='flex flex-wrap items-center justify-between gap-3 cursor-pointer group'
                        onClick={() => setIsExpanded(!isExpanded)}>
                        <SubHeader index={index} title='Knowledge Check' />
                        <button className='flex items-center gap-2 px-4 py-2 border border-border bg-muted/5 group-hover:bg-muted/20 group-hover:border-primary/50 transition-all font-mono text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap'>
                            {isExpanded ? 'Hide Quiz' : 'Take Quiz'}
                            <ChevronDown
                                className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                        </button>
                    </div>

                    <Collapse open={isExpanded}>
                        <div>
                            <MCQ questions={questions} />
                        </div>
                    </Collapse>
                </section>
            </BorderCross>
        );
    }
);

export const AssignmentSection = React.memo(
    ({ data, index }: { data: NonNullable<TopicData['assignment']>; index: string }) => {
        const [isExpanded, setIsExpanded] = React.useState(false);

        return (
            <BorderCross className='p-4 md:p-10'>
                <section id='assignment' className='scroll-mt-20'>
                    <div
                        className='flex flex-wrap items-center justify-between gap-3 cursor-pointer group'
                        onClick={() => setIsExpanded(!isExpanded)}>
                        <SubHeader index={index} title='Assignments' />
                        <button className='flex items-center gap-2 px-4 py-2 border border-border bg-muted/5 group-hover:bg-muted/20 group-hover:border-primary/50 transition-all font-mono text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap'>
                            {isExpanded ? 'Hide Details' : 'View Details'}
                            <ChevronDown
                                className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                        </button>
                    </div>

                    <Collapse open={isExpanded}>
                        <div className='mt-12'>
                            <Assignment
                                title={data.title}
                                time={data.time}
                                difficulty={data.difficulty}
                                tasks={data.tasks}
                                deliverables={data.deliverables}
                            />
                        </div>
                    </Collapse>
                </section>
            </BorderCross>
        );
    }
);

export const PracticalLabSection = React.memo(
    ({ data, index }: { data: NonNullable<TopicData['practicalLab']>; index: string }) => {
        const [isExpanded, setIsExpanded] = React.useState(false);

        return (
            <BorderCross className='p-4 md:p-10'>
                <section id='project' className='scroll-mt-20'>
                    <div
                        className='flex flex-wrap items-center justify-between gap-3 cursor-pointer group'
                        onClick={() => setIsExpanded(!isExpanded)}>
                        <SubHeader index={index} title='Practical Lab' />
                        <button className='flex items-center gap-2 px-4 py-2 border border-border bg-muted/5 group-hover:bg-muted/20 group-hover:border-primary/50 transition-all font-mono text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap'>
                            {isExpanded ? 'Hide Lab' : 'Start Lab'}
                            <ChevronDown
                                className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                        </button>
                    </div>

                    <Collapse open={isExpanded}>
                        <div className='mt-12'>
                            <div className='border border-border bg-card overflow-hidden'>
                                <div className='p-6 md:p-10 border-b border-border bg-accent/10 flex items-center gap-4'>
                                    <span className='text-3xl'>🚀</span>
                                    <h2 className='text-xl md:text-2xl font-black uppercase tracking-tighter text-accent leading-none'>
                                        {data.title}
                                    </h2>
                                </div>
                                <div className='p-6 md:p-10'>
                                    <p className='text-muted-foreground mb-8 text-sm font-mono uppercase tracking-widest'>
                                        {data.subtitle}
                                    </p>

                                    <StepFlow steps={data.steps} stepName={data.stepName} />

                                    {data.codeBlock && (
                                        <div className='mt-8'>
                                            <CodeBlock
                                                language={data.codeBlock.language}
                                                filename={data.codeBlock.filename}
                                                code={data.codeBlock.code}
                                            />
                                        </div>
                                    )}

                                    {data.codeBlocks && data.codeBlocks.map((block, idx) => (
                                        <div key={idx} className='mt-8'>
                                            <CodeBlock
                                                language={block.language}
                                                filename={block.filename}
                                                code={block.code}
                                            />
                                        </div>
                                    ))}

                                    {data.tip && (
                                        <div className='mt-8'>
                                            <InfoBox variant='tip' title='Pro Tip'>
                                                {data.tip}
                                            </InfoBox>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </section>
            </BorderCross>
        );
    }
);

KnowledgeCheckSection.displayName = 'KnowledgeCheckSection';
AssignmentSection.displayName = 'AssignmentSection';
PracticalLabSection.displayName = 'PracticalLabSection';
