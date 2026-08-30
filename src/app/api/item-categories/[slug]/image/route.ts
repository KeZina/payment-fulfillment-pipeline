import { getItemCategoryImage } from "@/lib/server/item-categories";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const image = await getItemCategoryImage(slug).catch(() => null);

  if (!image) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(image.buffer, {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
