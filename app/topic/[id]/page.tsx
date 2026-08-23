import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courseData, type Topic } from "@/lib/course-data";
import { TopicHeader } from "@/components/course/topic-header";
import { TopicNavigation } from "@/components/course/topic-navigation";
import { ContentPlaceholder } from "@/components/course/content-placeholder";
import { contentMap } from "@/content";
import { DynamicTopicContent } from "@/components/course/dynamic-topic-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: topicId } = await params;
  const phase = courseData.find(p => p.topics.some(t => t.id === topicId));
  const topic = phase?.topics.find(t => t.id === topicId);

  if (!topic) return {};

  const title = topic.title;
  const description = topic.summary
    ? `${topic.summary} Part of ${phase?.title} in System Design Mastery.`
    : `Deep dive into ${topic.title}. Part of the System Design Mastery curriculum.`;
  const url = `/topic/${topicId}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | System Design Mastery`,
      description,
      url,
      type: 'article',
      section: phase?.title,
      images: [
        {
          url: '/og-default.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      tags: [topic.tag, topic.level, topic.type].filter(Boolean) as string[],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | System Design Mastery`,
      description,
      images: ['/og-default.png'],
    },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: topicId } = await params;
  
  // Find the topic in our data
  const phase = courseData.find(p => p.topics.some(t => t.id === topicId));
  const topic = phase?.topics.find(t => t.id === topicId);

  if (!topic) {
    notFound();
  }

  // Calculate Previous and Next topics dynamically
  const allTopics: Topic[] = courseData.flatMap(p => p.topics);
  const currentIdx = allTopics.findIndex(t => t.id === topicId);
  
  const prevTopic = currentIdx > 0 ? { id: allTopics[currentIdx - 1].id, title: allTopics[currentIdx - 1].title } : null;
  const nextTopic = currentIdx < allTopics.length - 1 ? { id: allTopics[currentIdx + 1].id, title: allTopics[currentIdx + 1].title } : null;

  const contentData = contentMap[topicId];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <TopicHeader
        phase={phase?.title || "Course Topic"}
        topicNum="--"
        title={topic.title}
        time={topic.time || "৩০-৪৫ মিনিট"}
        level={topic.level || "Intermediate"}
        type={topic.type || "Theory & Practice"}
      />

      {contentData ? (
        <DynamicTopicContent data={contentData} />
      ) : (
        <ContentPlaceholder
          title={topic.title}
          details={topic.details}
          tools={topic.tools}
          homeHref="/"
          sample={{ href: '/topic/scalability', label: 'View Scalability (Demo)' }}
        />
      )}

      <TopicNavigation prev={prevTopic} next={nextTopic} />
    </div>
  );
}

export async function generateStaticParams() {
  const paths = courseData.flatMap(phase => 
    phase.topics.map(topic => ({
      id: topic.id,
    }))
  );
  return paths;
}
