export function GET() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#050507"/>
      <path d="M15 40h11v8h-6v-3h-5V40Zm0-24h34v8H25v8h20v8H25v-8H15V16Zm28 24h6v8h-6v-8Z" fill="#67e8f9"/>
      <path d="M24 24h25v4H24v-4Zm0 12h18v4H24v-4Z" fill="#a3e635"/>
    </svg>`,
    {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
}
