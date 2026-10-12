import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { extractKeywords, nodeToText, normalize, tidy } from '../text.ts';

describe('normalize', () => {
    it('lowercases and turns punctuation into single spaces', () => {
        assert.equal(normalize('  TCP/IP: The  Model! '), 'tcp ip the model');
    });

    it('writes Bengali digits as Latin digits', () => {
        assert.equal(normalize('মডিউল ০৪'), 'মডিউল 04');
    });

    it('keeps Bengali vowel signs attached to their word', () => {
        assert.equal(normalize('কীভাবে কাজ করে?'), 'কীভাবে কাজ করে');
    });

    it('drops zero width joiners instead of splitting the word', () => {
        assert.equal(normalize('র‍্যাম'), 'র্যাম');
    });

    it('returns an empty string for punctuation only', () => {
        assert.equal(normalize(' -- / '), '');
    });
});

describe('nodeToText', () => {
    it('reads strings and numbers', () => {
        assert.equal(nodeToText('DNS'), 'DNS');
        assert.equal(nodeToText(443), '443');
    });

    it('walks nested elements through props.children', () => {
        const node = {
            props: {
                children: ['TCP ', { props: { children: 'handshake' } }, 3],
            },
        };
        assert.equal(nodeToText(node), 'TCP handshake3');
    });

    it('joins siblings with the separator when one is given', () => {
        const node = { props: { children: ['TTL', { props: { children: 'এর' } }] } };
        assert.equal(nodeToText(node, ' '), 'TTL এর');
    });

    it('gives nothing for a childless component, null or a boolean', () => {
        assert.equal(nodeToText({ props: {} }), '');
        assert.equal(nodeToText(null), '');
        assert.equal(nodeToText(false), '');
        assert.equal(nodeToText([null, undefined, true]), '');
    });
});

describe('tidy', () => {
    it('collapses whitespace runs and trims', () => {
        assert.equal(tidy('  a \n  b\t c '), 'a b c');
    });
});

describe('extractKeywords', () => {
    it('keeps the Latin terms of a Bengali sentence, unique and in order', () => {
        assert.deepEqual(
            extractKeywords('TCP একটা SYN পাঠায়, তারপর SYN-ACK আসে। TCP অপেক্ষা করে।'),
            ['tcp', 'syn', 'ack']
        );
    });

    it('drops stop words, single letters and bare numbers', () => {
        assert.deepEqual(
            extractKeywords('the Port 443 and a x for HTTP2'),
            ['port', 'http2']
        );
    });

    it('returns an empty list when there is no Latin word', () => {
        assert.deepEqual(extractKeywords('শুধু বাংলা ১২৩'), []);
    });
});
