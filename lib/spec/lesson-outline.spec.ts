import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { TopicData } from '../../types/content.ts';
import { lessonOutline } from '../lesson-outline.ts';

const section = (id: string, index: string, label: string, title: unknown) =>
    ({ id, subHeader: { index, title: label }, title, blocks: [] }) as TopicData['sections'][number];

describe('lessonOutline', () => {
    it('lists the sections in order with their number, label and headline text', () => {
        const data: TopicData = {
            id: 'x',
            sections: [
                section('why', '001', 'Theory', { props: { children: ['IP  কোনো ', { props: { children: 'কথা' } }] } }),
                section('how', '002', 'The Flow', 'ধাপে ধাপে'),
            ],
        };
        assert.deepEqual(lessonOutline(data), [
            { id: 'why', index: '001', label: 'Theory', title: 'IP কোনো কথা' },
            { id: 'how', index: '002', label: 'The Flow', title: 'ধাপে ধাপে' },
        ]);
    });

    it('appends only the closing sections the lesson has, numbered on from the sections', () => {
        const data: TopicData = {
            id: 'x',
            sections: [section('a', '001', 'A', 'a'), section('b', '002', 'B', 'b')],
            summary: { headers: [], rows: [] },
            practicalLab: { title: 't', subtitle: 's', steps: [] },
        };
        assert.deepEqual(lessonOutline(data).slice(2), [
            { id: 'summary', index: '003', label: 'Lesson Summary', title: '' },
            { id: 'practical-lab', index: '004', label: 'Practical Lab', title: '' },
        ]);
    });

    it('orders summary, quiz, assignment, lab the way the page renders them', () => {
        const data: TopicData = {
            id: 'x',
            sections: [],
            practicalLab: { title: 't', subtitle: 's', steps: [] },
            assignment: { title: 't', time: '', difficulty: '', tasks: [], deliverables: [] },
            knowledgeCheck: { questions: [] },
            summary: { headers: [], rows: [] },
        };
        assert.deepEqual(
            lessonOutline(data).map(item => [item.id, item.index]),
            [
                ['summary', '001'],
                ['mcq', '002'],
                ['assignment', '003'],
                ['practical-lab', '004'],
            ]
        );
    });

    it('keeps the first of two sections that share an id', () => {
        const data: TopicData = {
            id: 'x',
            sections: [section('dup', '001', 'First', 'one'), section('dup', '002', 'Second', 'two')],
        };
        assert.deepEqual(lessonOutline(data).map(item => item.label), ['First']);
    });

    it('drops a closing section whose anchor a lesson section already uses, keeping the numbering', () => {
        const data: TopicData = {
            id: 'x',
            sections: [section('summary', '001', 'Own Summary', 'নিজের')],
            summary: { headers: [], rows: [] },
            knowledgeCheck: { questions: [] },
        };
        assert.deepEqual(
            lessonOutline(data).map(item => [item.id, item.index, item.label]),
            [
                ['summary', '001', 'Own Summary'],
                ['mcq', '003', 'Knowledge Check'],
            ]
        );
    });

    it('returns an empty outline for a lesson with nothing in it', () => {
        assert.deepEqual(lessonOutline({ id: 'x', sections: [] }), []);
    });
});
