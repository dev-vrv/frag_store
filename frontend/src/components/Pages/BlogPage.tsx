import Link from "next/link";
import Image from "next/image";

import {
  CyberBadge,
  CyberButton,
  CyberCard,
  CyberCardContent,
  CyberLaserText,
} from "@/components/cyber";
import { Header } from "@/components/Header/Header";
import { getBlogPosts, getLocalizedBlogPost } from "@/lib/blog";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";

const readMoreLabels: Record<Locale, string> = {
  ru: "Подробнее",
  en: "Read more",
  kg: "Кененирээк",
};

const emptyLabels: Record<Locale, string> = {
  ru: "Записи блога скоро появятся.",
  en: "Blog posts will appear soon.",
  kg: "Блог жазуулары жакында чыгат.",
};

export interface BlogPageProps {
  locale: Locale;
  dictionary: Dictionary;
}

export async function BlogPage({ locale, dictionary }: BlogPageProps) {
  const page = dictionary.pages.blog;
  const posts = await getBlogPosts();

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-20 pt-36 text-zinc-50 sm:px-6 lg:px-8">
      <Header locale={locale} dictionary={dictionary.header} />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_18%,rgba(255,23,68,0.2),transparent_30%),radial-gradient(circle_at_80%_16%,rgba(34,211,238,0.12),transparent_28%),linear-gradient(180deg,#050507,#000)]" />
      <div className="cyber-grid absolute inset-0 -z-10 opacity-60" />

      <section className="mx-auto w-full max-w-7xl">
        <CyberBadge variant="red" glow>
          {page.badge}
        </CyberBadge>
        <CyberLaserText
          as="h1"
          text={page.title}
          className="mt-7 block text-5xl text-red-100 sm:text-7xl"
          speedMs={44}
        />
        <p className="mt-6 max-w-3xl text-xl leading-9 text-zinc-400">{page.subtitle}</p>
      </section>

      <section className="mx-auto mt-12 grid w-full max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => {
            const content = getLocalizedBlogPost(post, locale);

            return (
              <CyberCard key={post.id} variant="product" hover className="flex min-h-[34rem] flex-col">
                <div className="relative h-56 overflow-hidden border-b border-white/10 bg-zinc-950">
                  <Image
                    src={post.image}
                    alt={content.title}
                    fill
                    unoptimized
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                </div>
                <CyberCardContent className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-2xl font-normal leading-tight text-red-100">
                    {content.title}
                  </h2>
                  <p className="mt-4 h-32 overflow-hidden text-base leading-7 text-zinc-400">
                    {content.text}
                  </p>
                  <div className="mt-auto pt-6">
                    <CyberButton asChild variant="outline" size="sm">
                      <Link href={localizePath(`/blog/${post.slug}`, locale)}>
                        <span>{readMoreLabels[locale]}</span>
                      </Link>
                    </CyberButton>
                  </div>
                </CyberCardContent>
              </CyberCard>
            );
          })
        ) : (
          <CyberCard variant="glass" className="md:col-span-2 xl:col-span-3">
            <CyberCardContent className="p-8 text-lg text-zinc-300">
              {emptyLabels[locale]}
            </CyberCardContent>
          </CyberCard>
        )}
      </section>
    </main>
  );
}
