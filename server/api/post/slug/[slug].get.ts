export default defineEventHandler(async (event) => {
  const { slug } = event.context.params as { slug: string };

  const news =  Post.findOne({ slug });
  if (!news) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found',
    });
  }

  return news;
})
