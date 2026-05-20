import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  CyberBadge,
  CyberButton,
  CyberCard,
  CyberCardContent,
  CyberLaserText,
} from "@/components/cyber";
import { Header } from "@/components/Header/Header";
import { getBlogPost, getLocalizedBlogPost } from "@/lib/blog";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";

const backLabels: Record<Locale, string> = {
  ru: "К блогу",
  en: "Back to blog",
  kg: "Блогго",
};

export interface BlogDetailPageProps {
  locale: Locale;
  dictionary: Dictionary;
  slug: string;
}

export async function BlogDetailPage({ locale, dictionary, slug }: BlogDetailPageProps) {
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const content = getLocalizedBlogPost(post, locale);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-20 pt-36 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_18%,rgba(255,23,68,0.2),transparent_30%),radial-gradient(circle_at_80%_16%,rgba(34,211,238,0.12),transparent_28%),linear-gradient(180deg,#050507,#000)]" />
      <div className="cyber-grid absolute inset-0 -z-10 opacity-60" />

      <article className="mx-auto w-full max-w-5xl">
        <CyberButton asChild variant="ghost" size="sm">
          <Link href={localizePath("/blog", locale)}>
            <span>{backLabels[locale]}</span>
          </Link>
        </CyberButton>

        <div className="mt-8">
          <CyberBadge variant="red" glow>
            {dictionary.pages.blog.badge}
          </CyberBadge>
          <CyberLaserText
            as="h1"
            text={content.title}
            className="mt-7 block text-4xl text-red-100 sm:text-6xl"
            speedMs={34}
          />
        </div>

        <CyberCard variant="glass" className="mt-10 overflow-hidden">
          <div className="relative h-[22rem] bg-zinc-950 sm:h-[32rem]">
            <Image
              src={post.image}
              alt={content.title}
              fill
              unoptimized
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <CyberCardContent className="space-y-8 p-6 sm:p-9">
            <div className="whitespace-pre-line text-lg leading-9 text-zinc-200">
              {content.text}
            </div>

            {post.video ? (
              <video
                src={post.video}
                controls
                className="aspect-video w-full rounded-lg border border-white/10 bg-black"
              />
            ) : null}
          </CyberCardContent>
        </CyberCard>
      </article>
    </main>
  );
}
