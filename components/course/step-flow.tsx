import { ReactNode } from 'react';
import { SubHeader } from './sub-header';
import { cn } from '@/lib/utils';

interface Step {
    title: ReactNode;
    description: ReactNode;
}

interface StepFlowProps {
    steps: Step[];
    stepName?: string;
}

export function StepFlow({ steps = [],stepName="STEP" }: StepFlowProps) {
    const stepCount = steps.length;
    const gridCols = 
        stepCount === 1 ? 'grid-cols-1' :
        stepCount === 2 ? 'grid-cols-1 md:grid-cols-2' :
        stepCount === 4 || stepCount === 8 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return (
        <div className={cn('my-10 md:my-16 border-t border-l border-border grid', gridCols)}>
            {steps.map((step, idx) => (
                <div
                    key={idx}
                    className='p-6 md:p-10 border-r border-b border-border bg-card hover:bg-primary/5 dark:hover:bg-white/2 transition-colors group'>
                    <div className='flex flex-col gap-6 md:gap-8'>
                        <SubHeader
                            index={`${stepName} 0${idx + 1}`}
                            title={`${step.title || 'System Task'}`}
                        />
                        <div className='space-y-3 md:space-y-4'>
                            <h4 className='text-sm md:text-base font-black uppercase tracking-tight leading-snug md:leading-none group-hover:text-primary transition-colors'>
                                {step.title}
                            </h4>
                            <p className='text-xs md:text-sm text-muted-foreground leading-relaxed font-medium'>
                                {step.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

