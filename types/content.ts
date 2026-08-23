/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';

export const CONTENT_TYPES = {
    HTML: 'html',
    INFO_BOX: 'info-box',
    COMPARE_TABLE: 'compare-table',
    CODE_BLOCK: 'code-block',
    STEP_FLOW: 'step-flow',
    CUSTOM: 'custom',
} as const;

export const INFO_BOX_VARIANTS = {
    CONCEPT: 'concept',
    WARNING: 'warning',
    TIP: 'tip',
    IMPORTANT: 'important',
} as const;

/** One step of a StepFlow. `number` is optional — some content pre-labels its steps. */
export interface FlowStep {
    title: ReactNode;
    description: ReactNode;
    number?: string;
}

export type ContentBlock =
    | { type: typeof CONTENT_TYPES.HTML; content: ReactNode }
    | {
          type: typeof CONTENT_TYPES.INFO_BOX;
          variant: (typeof INFO_BOX_VARIANTS)[keyof typeof INFO_BOX_VARIANTS];
          title: string;
          content: ReactNode;
      }
    | {
          type: typeof CONTENT_TYPES.COMPARE_TABLE;
          headers: ReactNode[];
          rows: ReactNode[][];
      }
    | {
          type: typeof CONTENT_TYPES.CODE_BLOCK;
          language: string;
          filename?: string;
          code: string;
      }
    | {
          type: typeof CONTENT_TYPES.STEP_FLOW;
          stepName?: string;
          steps: FlowStep[];
      }
    | { type: typeof CONTENT_TYPES.CUSTOM; component: ReactNode };

export interface TopicSection {
    id: string;
    subHeader: { index: string; title: string };
    title: ReactNode;
    blocks: ContentBlock[];
}

export interface TopicData {
    id: string;
    introduction?: {
        badge: string;
        title: ReactNode;
        description: ReactNode;
        quote: { text: ReactNode; author: string; role: string };
    };
    sections: TopicSection[];
    summary?: {
        headers: ReactNode[];
        rows: ReactNode[][];
    };
    knowledgeCheck?: {
        questions: {
            id: number;
            text: string;
            options: {
                key: string;
                text: string;
                isCorrect: boolean;
                explanation?: string;
            }[];
        }[];
    };
    assignment?: {
        title: string;
        time: string;
        difficulty: string;
        tasks: ReactNode[];
        deliverables: ReactNode[];
    };
    practicalLab?: {
        title: string;
        subtitle: string;
        steps: FlowStep[];
        stepName?: string;
        codeBlock?: { language: string; filename: string; code: string };
        codeBlocks?: { language: string; filename: string; code: string }[];
        tip?: ReactNode;
    };
    phaseComplete?: {
        title: string;
        description: string;
        topics: { title: string; id: string }[];
        nextPhase?: {
            title: string;
            topics: string[];
        };
    };
}
