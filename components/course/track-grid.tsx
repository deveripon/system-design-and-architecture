import { courseData } from '@/lib/course-data';
import { devopsCourseData, devopsLessons } from '@/lib/devops-course-data';
import { sqlCourseData, sqlLessons } from '@/lib/sql-course-data';
import { TRACKS, type TrackId } from '@/lib/tracks';
import { ArrowRight, Database, Network, Workflow, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

/** Copy for each track's card. The order and the links come from lib/tracks. */
const CARDS: Record<TrackId, Omit<Card, 'id' | 'href' | 'eyebrow'>> = {
    devops: {
        icon: Network,
        title: 'DevOps & Internet From Scratch',
        description:
            'Browser থেকে Production Infrastructure পর্যন্ত। Internet, DNS, TCP/IP, Linux, Docker, Reverse Proxy, CI/CD আর Cloud।',
        sections: devopsCourseData.length,
        sectionLabel: 'Modules',
        lessons: devopsLessons.length,
    },
    sql: {
        icon: Database,
        title: 'SQL & Database Mastery',
        description:
            'প্রথম SELECT থেকে Production Database পর্যন্ত। Join, Design, Transaction, Index, Security আর Scaling, PostgreSQL দিয়ে।',
        sections: sqlCourseData.length,
        sectionLabel: 'Modules',
        lessons: sqlLessons.length,
    },
    'system-design': {
        icon: Workflow,
        title: 'System Design Mastery',
        description:
            'Scalability, Databases, Distributed Systems আর Real-world Case Study। Interview আর Architecture দুটোর জন্যই।',
        sections: courseData.length,
        sectionLabel: 'Phases',
        lessons: courseData.flatMap(phase => phase.topics).length,
    },
};

interface Card {
    id: TrackId;
    icon: LucideIcon;
    eyebrow: string;
    title: string;
    description: string;
    href: string;
    sections: number;
    sectionLabel: string;
    lessons: number;
}

const TRACK_CARDS: Card[] = TRACKS.map((track, index) => ({
    ...CARDS[track.id],
    id: track.id,
    eyebrow: `Track ${String(index + 1).padStart(2, '0')}`,
    href: track.href,
}));

/**
 * One card per track. The card of the track whose landing page shows the grid
 * scrolls to that page's roadmap instead of linking to the page itself.
 */
export function TrackGrid({ current }: { current?: TrackId }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border'>
            {TRACK_CARDS.map(track => (
                <Link
                    key={track.id}
                    href={track.id === current ? '#roadmap' : track.href}
                    className='group flex flex-col gap-6 p-6 md:p-10 border-r border-b border-border bg-card hover:bg-primary/5 dark:hover:bg-white/2 transition-colors'>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='w-12 h-12 border border-border flex items-center justify-center bg-background shrink-0'>
                            <track.icon className='w-6 h-6 text-primary' />
                        </div>
                        <span className='font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-muted-foreground'>
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

                    <div className='mt-auto pt-2 inline-flex items-center gap-3 font-mono text-[0.625rem] font-black uppercase tracking-[0.25em] text-foreground/70 group-hover:text-foreground transition-colors'>
                        {track.id === current ? 'View Roadmap' : 'Open Track'}
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
            <span className='text-[0.5rem] font-mono font-bold uppercase tracking-widest text-muted-foreground'>
                {label}
            </span>
            <span className='text-sm font-black tabular-nums'>{value}</span>
        </div>
    );
}
