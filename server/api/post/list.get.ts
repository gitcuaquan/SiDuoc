export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt((query.page as string) || '1')
  const limit = parseInt((query.limit as string) || '10')
  const skip = (page - 1) * limit
  const posts = await Post.find().skip(skip).limit(limit).exec()
  const total = await Post.countDocuments().exec()
  return {
    data: posts,
    meta: {
      totalCount: total,
      pageIndex:page,
      pageSize:limit,
      totalPages: Math.ceil(total / limit),
    },
  }
})
