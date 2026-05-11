import { FeedClient } from "@/components/feed/FeedClient";
import { buildFeed, type FeedItem } from "@/lib/feed";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Landing } from "@/components/landing/Landing";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ post?: string }>;
}) {
  const session = await getSession();
  const sp = await searchParams;

  // Signed-out visitors get the editorial landing page — the algorithmic
  // feed is for members. Unless they explicitly deep-linked a post.
  if (!session?.user?.id && !sp.post) {
    return <Landing />;
  }

  let initial = await buildFeed(session?.user?.id ?? null, 20);

  // Deep-link: if ?post=id, prepend that post so it loads first
  if (sp.post) {
    const alreadyInFeed = initial.some(
      (i) => i.kind === "post" && i.id === sp.post
    );
    if (!alreadyInFeed) {
      const p = await prisma.post.findUnique({
        where: { id: sp.post },
        include: {
          user: { select: { id: true, username: true, name: true, image: true } },
        },
      });
      if (p) {
        const viewerLike = session?.user?.id
          ? await prisma.postLike.findUnique({
              where: { postId_userId: { postId: p.id, userId: session.user.id } },
            })
          : null;
        const followedByViewer = session?.user?.id
          ? await prisma.follow.findUnique({
              where: {
                followerId_followedId: {
                  followerId: session.user.id,
                  followedId: p.userId,
                },
              },
            })
          : null;
        const deepItem: FeedItem = {
          kind: "post",
          id: p.id,
          userId: p.userId,
          username: p.user.username ?? p.user.name,
          userImage: p.user.image,
          caption: p.caption,
          mediaUrl: p.mediaUrl,
          mediaType: p.mediaType,
          thumbUrl: p.thumbUrl,
          postKind: p.kind,
          featuredCardId: p.featuredCardId,
          featuredCardName: p.featuredCardName,
          featuredCardImage: p.featuredCardImage,
          featuredGradeCompany: p.featuredGradeCompany,
          featuredGradeScore: p.featuredGradeScore,
          askingPrice: p.askingPrice,
          openToTrade: p.openToTrade,
          tags: p.tags,
          viewCount: p.viewCount,
          likeCount: p.likeCount,
          commentCount: p.commentCount,
          shareCount: p.shareCount,
          createdAt: p.createdAt.toISOString(),
          liked: Boolean(viewerLike),
          followingAuthor: Boolean(followedByViewer),
        };
        initial = [deepItem, ...initial];
      }
    } else {
      // move it to the front
      initial = [
        ...initial.filter((i) => !(i.kind === "post" && i.id === sp.post)),
      ];
      const match = initial.find((i) => i.kind === "post" && i.id === sp.post);
      if (match) initial.unshift(match);
    }
  }

  return <FeedClient initialItems={initial} viewerId={session?.user?.id ?? null} />;
}
