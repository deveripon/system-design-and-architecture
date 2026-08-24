import { TopicData } from '../../types/content';

/**
 * Lesson content for the DevOps & Internet track.
 *
 * Every lesson page already exists and renders its header, metadata and
 * prev/next navigation from `lib/devops-course-data.ts`. A lesson shows the
 * "Content Coming Soon" placeholder until it gets an entry here.
 *
 * To write a lesson:
 *   1. create `content/devops/<module-folder>/<nn>-<lesson-id>.tsx`
 *      exporting a `TopicData` object (see `content/foundations/topics` for the
 *      house style: 8 sections, Theory, Visual, Real Example, Project Example,
 *      Hands-on, Quiz, Assignment, Recap),
 *   2. import it below and map it to the lesson id used in
 *      `lib/devops-course-data.ts`.
 */
import { binaryAndDataContent } from './01-computer-fundamentals/01-binary-and-data';
import { cpuBasicsContent } from './01-computer-fundamentals/02-cpu-basics';
import { memoryAndRamContent } from './01-computer-fundamentals/03-memory-and-ram';
import { operatingSystemBasicsContent } from './01-computer-fundamentals/05-operating-system-basics';
import { storageBasicsContent } from './01-computer-fundamentals/04-storage-basics';

export const devopsContentMap: Record<string, TopicData> = {
    // Module 01, Computer Fundamentals
    'binary-and-data': binaryAndDataContent,
    'cpu-basics': cpuBasicsContent,
    'memory-and-ram': memoryAndRamContent,
    'storage-basics': storageBasicsContent,
    'operating-system-basics': operatingSystemBasicsContent,
};
