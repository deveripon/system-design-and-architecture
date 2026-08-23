import { DevopsMobileNav, DevopsSidebar } from '@/components/course/devops-nav';

export default function DevopsTopicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='min-h-screen flex overflow-hidden'>
            {/* Desktop sidebar, hidden on mobile */}
            <DevopsSidebar />

            {/* Mobile top bar + drawer */}
            <DevopsMobileNav />

            {/* Main Content */}
            <main className='flex-1 lg:ml-84 bg-background pt-14 lg:pt-0'>
                <div className='w-full mx-auto max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-[80rem] 2xl:max-w-[90rem] px-4 py-8 md:px-8 md:py-14 lg:px-12 xl:px-16 2xl:px-20'>
                    {children}
                </div>
            </main>
        </div>
    );
}
