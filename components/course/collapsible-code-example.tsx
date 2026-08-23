'use client';

import { cn } from '@/lib/utils';
import { BookOpen, ChevronDown, Code2 } from 'lucide-react';
import { useState } from 'react';
import { Collapse } from '@/components/motion/collapse';
import { CodeBlock } from './code-block';

interface CodeExample {
    filename: string;
    code: string;
    language: string;
    description?: string;
}

interface CollapsibleCodeExampleProps {
    title: string;
    subtitle?: string;
    examples: CodeExample[];
    initialExpanded?: boolean;
}

export function CollapsibleCodeExample({
    title,
    subtitle,
    examples,
    initialExpanded = false,
}: CollapsibleCodeExampleProps) {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);

    return (
        <div className='my-8 border border-border bg-card/30 overflow-hidden rounded-sm transition-all duration-300'>
            <div
                className='flex items-center justify-between p-5 cursor-pointer hover:bg-muted/10 transition-colors'
                onClick={() => setIsExpanded(!isExpanded)}>
                <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                        <Code2 size={20} />
                    </div>
                    <div>
                        <h3 className='font-bold uppercase tracking-tighter text-lg leading-none'>
                            {title}
                        </h3>
                        {subtitle && (
                            <p className='text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1.5'>
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                <button className='flex items-center gap-2 px-3 py-1.5 border border-border bg-muted/5 hover:bg-muted/20 transition-all font-mono text-[10px] uppercase tracking-widest text-muted-foreground'>
                    {isExpanded ? 'Collapse' : 'Expand'}
                    <ChevronDown
                        className={cn(
                            'w-4 h-4 transition-transform duration-300',
                            isExpanded ? 'rotate-180' : ''
                        )}
                    />
                </button>
            </div>

            <Collapse open={isExpanded}>
                <div className='p-6 md:p-8 border-t border-border'>
                    <div className='space-y-10'>
                        {examples.map((example, index) => (
                            <div key={index} className='space-y-4'>
                                {example.description && (
                                    <div className='flex items-start gap-3 text-muted-foreground'>
                                        <BookOpen
                                            size={18}
                                            className='mt-1 text-accent shrink-0'
                                        />
                                        <p className='text-base leading-relaxed'>
                                            {example.description}
                                        </p>
                                    </div>
                                )}
                                <CodeBlock
                                    filename={example.filename}
                                    code={example.code}
                                    language={example.language}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Collapse>
        </div>
    );
}

