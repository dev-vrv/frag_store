import { type Locale } from "@/lib/i18n";

export interface BlogPost {
  id: number;
  slug: string;
  image: string;
  video: string | null;
  title_ru: string;
  title_en: string;
  title_kg: string;
  text_ru: string;
  text_en: string;
  text_kg: string;
  created_at: string;
  updated_at: string;
}

type BlogPostListResponse = BlogPost[] | {
  results?: BlogPost[];
};

const internalApiUrl = process.env.API_URL || "http://127.0.0.1:8000/api";
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || internalApiUrl;

function getApiUrl() {
  return typeof window === "undefined" ? internalApiUrl : publicApiUrl;
}

export function getLocalizedBlogPost(post: BlogPost, locale: Locale) {
  return {
    title: post[`title_${locale}`],
    text: post[`text_${locale}`],
  };
}

function normalizeMediaUrl(url: string | null) {
  if (!url) {
    return null;
  }

  if (url.startsWith("/media/")) {
    return url;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.pathname.startsWith("/media/")) {
      return parsedUrl.pathname;
    }
  } catch {
    return url;
  }

  return url;
}

function normalizePostMedia(post: BlogPost): BlogPost {
  return {
    ...post,
    image: normalizeMediaUrl(post.image) || post.image,
    video: normalizeMediaUrl(post.video),
  };
}

export async function getBlogPosts() {
  try {
    const response = await fetch(`${getApiUrl()}/content/blog-posts/`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as BlogPostListResponse;
    const posts = Array.isArray(data) ? data : data.results ?? [];

    return posts.map(normalizePostMedia);
  } catch {
    return [];
  }
}

export async function getBlogPost(slug: string) {
  try {
    const response = await fetch(`${getApiUrl()}/content/blog-posts/${slug}/`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return normalizePostMedia((await response.json()) as BlogPost);
  } catch {
    return null;
  }
}
