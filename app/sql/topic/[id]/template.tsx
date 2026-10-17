import { PageFade } from '@/components/motion/page-fade';

export default function Template({ children }: { children: React.ReactNode }) {
    return <PageFade>{children}</PageFade>;
}
