import type { Metadata } from "next";

import { BlogDetailPage } from "@/components/Pages/BlogDetailPage";
import { getBlogPost, getLocalizedBlogPost } from "@/lib/blog";
import { defaultLocale, getDictionary } from "@/lib/i18n";

interface BlogDetailRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

const dictionary = getDictionary(defaultLocale);

export async function generateMetadata({ params }: BlogDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return dictionary.pages.blog.metadata;
  }

  const content = getLocalizedBlogPost(post, defaultLocale);

  return {
    title: `${content.title} | Frag Store`,
    description: content.text.slice(0, 160),
  };
}

export default async function BlogDetail({ params }: BlogDetailRouteProps) {
  const { slug } = await params;

  return <BlogDetailPage locale={defaultLocale} dictionary={dictionary} slug={slug} />;
}
