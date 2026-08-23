'use client';

import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronRight, PlayCircle } from "lucide-react";

import { SubHeader } from "./sub-header";

interface Option {
  key: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

interface MCQProps {
  questions: Question[];
}

export function MCQ({ questions = [] }: MCQProps) {
  const [selectedOptions, setSelectedOptions] = React.useState<Record<number, string>>({});
  const [showResults, setShowResults] = React.useState(false);

  const handleSelect = (qId: number, key: string) => {
    if (showResults) return;
    setSelectedOptions((prev) => ({ ...prev, [qId]: key }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      const correctOption = q.options.find((o) => o.isCorrect);
      if (selectedOptions[q.id] === correctOption?.key) {
        score++;
      }
    });
    return score;
  };

  return (
    <section className="my-12 md:my-24 border border-border bg-card">
      <div className="p-6 md:p-10 border-b border-border bg-muted/20">
        <SubHeader index="004" title="Assessment" className="mb-4" />
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Knowledge Check</h2>
      </div>

      <div className="p-6 md:p-10 space-y-12 md:space-y-20">
        {questions.map((q, qIdx) => (
          <div key={q.id} className="space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono font-bold text-primary border border-primary/30 px-3 py-1 bg-primary/5 uppercase">Question 0{qIdx + 1}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold leading-tight max-w-3xl">{q.text}</h3>
            </div>

            <div className="grid grid-cols-1 border-t border-l border-border">
              {q.options.map((option) => {
                const isSelected = selectedOptions[q.id] === option.key;
                const isCorrect = option.isCorrect;
                const showFeedback = showResults;

                return (
                  <button
                    key={option.key}
                    disabled={showFeedback}
                    onClick={() => handleSelect(q.id, option.key)}
                    className={cn(
                      "flex items-start gap-4 md:gap-8 p-6 md:p-8 border-r border-b border-border text-left transition-all group",
                      !showFeedback && "hover:bg-muted/10",
                      showFeedback && isCorrect && "bg-accent/10",
                      showFeedback && isSelected && !isCorrect && "bg-red-500/10",
                      !showFeedback && isSelected && "bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 md:w-12 md:h-12 border border-border flex items-center justify-center font-mono text-xs md:text-sm font-black transition-all shrink-0",
                      showFeedback && isCorrect ? "bg-accent text-accent-foreground border-accent" :
                      showFeedback && isSelected && !isCorrect ? "bg-red-600 text-white border-red-600" :
                      !showFeedback && isSelected ? "bg-primary text-primary-foreground border-primary" :
                      "bg-background group-hover:border-primary/50"
                    )}>
                      {option.key}
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <p className="text-sm md:text-base font-bold leading-snug md:leading-none">{option.text}</p>
                      {showFeedback && (isSelected || isCorrect) && (
                        <p className={cn(
                          "text-xs md:text-sm leading-relaxed font-medium max-w-2xl",
                          isCorrect ? "text-accent" : "text-red-700 dark:text-red-400"
                        )}>
                          {option.explanation}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 md:p-10 border-t border-border bg-muted/20">
        {!showResults ? (
          <button
            onClick={() => setShowResults(true)}
            disabled={Object.keys(selectedOptions).length < questions.length}
            className="w-full py-3 md:py-4 border border-primary bg-primary/10 text-primary font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
          >
            Check Answers
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Your Score</span>
              <span className="text-xl md:text-2xl font-black">{calculateScore()} / {questions.length}</span>
            </div>
            <button
              onClick={() => {
                setSelectedOptions({});
                setShowResults(false);
              }}
              className="w-full sm:w-auto px-8 py-3 border border-border font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-muted transition-all"
            >
              Retry Quiz
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
