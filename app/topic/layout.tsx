import { MobileNav } from '@/components/course/mobile-nav';
import { Sidebar } from '@/components/course/sidebar';

import { ScrollProgressBar } from '@/components/scroll-progress-bar';

export default function TopicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='min-h-screen flex overflow-hidden'>
            <ScrollProgressBar />
            {/* Desktop sidebar, hidden on mobile */}
            <Sidebar />

            {/* Mobile top bar + drawer */}
            <MobileNav />

            {/* Main content. min-w-0 matters: as a flex item it defaults to
                min-width: auto, so one wide diagram would stretch it past the
                viewport and the wrapper would clip the whole column. */}
            <main className='flex-1 min-w-0 lg:ml-84 bg-background pt-14 lg:pt-0'>
                <div className='w-full mx-auto max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-[80rem] 2xl:max-w-[90rem] px-4 py-8 md:px-8 md:py-14 lg:px-12 xl:px-16 2xl:px-20'>
                    {children}
                </div>
            </main>
        </div>
    );
}

