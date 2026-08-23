import { courseData } from '@/lib/course-data';
import { devopsCourseData, devopsLessons } from '@/lib/devops-course-data';
import { ArrowRight, Network, Workflow } from 'lucide-react';
import Link from 'next/link';

const TRACKS = [
    {
        id: 'system-design',
        icon: Workflow,
        eyebrow: 'Track 01',
        title: 'System Design Mastery',
        description:
            'Scalability, Databases, Distributed Systems আর Real-world Case Study — Interview আর Architecture দুটোর জন্যই।',
        href: '#roadmap',
        cta: 'View Roadmap',
        sections: courseData.length,
        sectionLabel: 'Phases',
        lessons: courseData.flatMap(phase => phase.topics).length,
    },
    {
        id: 'devops',
        icon: Network,
        eyebrow: 'Track 02',
        title: 'DevOps & Internet From Scratch',
        description:
            'Browser থেকে Production Infrastructure — Internet, DNS, TCP/IP, Linux, Docker, Reverse Proxy, CI/CD আর Cloud।',
        href: '/devops',
        cta: 'Open Track',
        sections: devopsCourseData.length,
        sectionLabel: 'Modules',
        lessons: devopsLessons.length,
    },
];

export function TrackGrid() {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 border-t border-l border-border'>
            {TRACKS.map(track => (
                <Link
                    key={track.id}
                    href={track.href}
                    className='group flex flex-col gap-6 p-6 md:p-10 border-r border-b border-border bg-card hover:bg-primary/5 dark:hover:bg-white/2 transition-colors'>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='w-12 h-12 border border-border flex items-center justify-center bg-background shrink-0'>
                            <track.icon className='w-6 h-6 text-primary' />
                        </div>
                        <span className='font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground'>
                            {track.eyebrow}
                        </span>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors'>
                            {track.title}
                        </h3>
                        <p className='text-sm text-muted-foreground leading-relaxed font-medium'>
                            {track.description}
                        </p>
                    </div>

                    <div className='flex flex-wrap gap-px bg-border border border-border w-fit'>
                        <Stat label={track.sectionLabel} value={track.sections} />
                        <Stat label='Lessons' value={track.lessons} />
                    </div>

                    <div className='mt-auto pt-2 inline-flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.25em] text-foreground/70 group-hover:text-foreground transition-colors'>
                        {track.cta}
                        <ArrowRight className='w-3 h-3 text-primary group-hover:translate-x-0.5 transition-transform' />
                    </div>
                </Link>
            ))}
        </div>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className='flex flex-col gap-1 px-4 py-2 bg-card min-w-[96px]'>
            <span className='text-[8px] font-mono font-bold uppercase tracking-widest text-muted-foreground'>
                {label}
            </span>
            <span className='text-sm font-black tabular-nums'>{value}</span>
        </div>
    );
}
