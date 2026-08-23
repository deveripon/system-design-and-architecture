"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, Copy, Terminal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPrismLanguage = (lang: string) => {
    const l = lang.toLowerCase();
    if (l.includes('node') || l.includes('javascript') || l === 'js') return 'javascript';
    if (l.includes('typescript') || l === 'ts') return 'typescript';
    if (l === 'yml') return 'yaml';
    return l;
  };

  return (
      <div className='my-8 md:my-12 border border-border bg-[#05080f] overflow-hidden'>
          <div className='flex items-center justify-between px-4 md:px-6 py-2 md:py-3 border-b border-border bg-muted/20'>
              <div className='flex items-center gap-2 md:gap-3'>
                  <Terminal className='w-3 h-3 md:w-4 md:h-4 text-primary' />
                  <span className='text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground truncate max-w-[150px] sm:max-w-none'>
                      {filename || language}
                  </span>
              </div>
              <button
                  onClick={copyToClipboard}
                  aria-label={copied ? 'Copied' : 'Copy code'}
                  className='flex items-center gap-1.5 text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors whitespace-nowrap'>
                  <AnimatePresence mode='wait' initial={false}>
                      <motion.span
                          key={copied ? 'yes' : 'no'}
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className='flex items-center gap-1.5'>
                          {copied ? (
                              <>
                                  <Check className='w-3 h-3 text-accent' />
                                  Copied
                              </>
                          ) : (
                              <>
                                  <Copy className='w-3 h-3' />
                                  Copy
                              </>
                          )}
                      </motion.span>
                  </AnimatePresence>
              </button>
          </div>
          <div className='relative text-xs md:text-[13px] leading-relaxed overflow-x-auto  p-4 '>
              <SyntaxHighlighter
                  language={getPrismLanguage(language)}
                  style={vscDarkPlus}
                  customStyle={{
                      margin: 0,
                      padding: '1rem md:1.25rem',
                      background: 'transparent',
                      border: 'none',
                  }}
                  codeTagProps={{
                      style: { fontFamily: 'var(--font-mono)' },
                  }}>
                  {code}
              </SyntaxHighlighter>
          </div>
      </div>
  );
}

