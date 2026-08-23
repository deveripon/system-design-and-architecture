import { cn } from '@/lib/utils';
import { INFO_BOX_VARIANTS } from '@/types/content';
import { AlertTriangle, Book, Info, Lightbulb } from 'lucide-react';
import React from 'react';

type InfoBoxVariant =
    (typeof INFO_BOX_VARIANTS)[keyof typeof INFO_BOX_VARIANTS];

interface InfoBoxProps {
    variant: InfoBoxVariant;
    title?: string;
    children: React.ReactNode;
}

export function InfoBox({ variant, title, children }: InfoBoxProps) {
    const icons = {
        [INFO_BOX_VARIANTS.CONCEPT]: <Book className='w-5 h-5 text-primary' />,
        [INFO_BOX_VARIANTS.TIP]: (
            <Lightbulb className='w-5 h-5 text-accent' />
        ),
        [INFO_BOX_VARIANTS.WARNING]: (
            <AlertTriangle className='w-5 h-5 text-amber-600 dark:text-amber-400' />
        ),
        [INFO_BOX_VARIANTS.IMPORTANT]: (
            <Info className='w-5 h-5 text-teal-700 dark:text-teal-300' />
        ),
    };

    return (
        <div
            className={cn(
                'my-8 md:my-12 p-6 md:p-8 border border-border bg-card relative group',
                'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1',
                variant === INFO_BOX_VARIANTS.CONCEPT
                    ? 'before:bg-primary'
                    : variant === INFO_BOX_VARIANTS.TIP
                      ? 'before:bg-accent'
                      : variant === INFO_BOX_VARIANTS.WARNING
                        ? 'before:bg-amber-500'
                        : 'before:bg-teal-600'
            )}>
            <div className='flex items-center gap-3 md:gap-4 mb-4 md:mb-6'>
                <div className='w-8 h-8 md:w-10 md:h-10 border border-border flex items-center justify-center bg-background shrink-0'>
                    {icons[variant]}
                </div>
                <h4 className='text-[10px] md:text-[11px] font-mono font-black uppercase  opacity-80'>
                    {title}
                </h4>
            </div>
            <div className='text-sm md:text-base leading-relaxed font-medium'>
                {children}
            </div>
        </div>
    );
}

