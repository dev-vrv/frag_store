import type { Metadata } from "next";

import {
  getLocaleDictionary,
  getLocalizedMetadata,
  type LocalePageProps,
} from "@/app/[locale]/localized";
import { BlogDetailPage } from "@/components/Pages/BlogDetailPage";
import { getBlogPost, getLocalizedBlogPost } from "@/lib/blog";

interface LocalizedBlogDetailRouteProps extends LocalePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: LocalizedBlogDetailRouteProps): Promise<Metadata> {
  const { locale, dictionary } = await getLocaleDictionary(params);
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return getLocalizedMetadata(params, "blog");
  }

  const content = getLocalizedBlogPost(post, locale);

  return {
    title: `${content.title} | Frag Store`,
    description: content.text.slice(0, 160),
    openGraph: {
      title: content.title,
      description: content.text.slice(0, 160),
      images: [post.image],
    },
    alternates: {
      canonical: `/${locale}/blog/${post.slug}`,
    },
    applicationName: dictionary.metadata.title,
  };
}

export default async function LocalizedBlogDetail({ params }: LocalizedBlogDetailRouteProps) {
  const { locale, dictionary } = await getLocaleDictionary(params);
  const { slug } = await params;

  return <BlogDetailPage locale={locale} dictionary={dictionary} slug={slug} />;
}
