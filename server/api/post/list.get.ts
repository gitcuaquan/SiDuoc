export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

  
    let keyword = query.keyword as string | undefined
    if (keyword === "") {
      keyword = undefined
    }
    let category = query.category as string | undefined
    if (category === "") {
      category = undefined
    }

    const page = parseInt((query.page as string) || '1')
    const limit = parseInt((query.limit as string) || '10')
    const skip = (page - 1) * limit

    const filter: any = {}
    if (category !== undefined) {
      filter.category = category
    }
    if (keyword !== undefined) {
      filter.title = { $regex: keyword, $options: "i" }
    }

    const posts = await Post.find(filter, { content: 0 }).sort({ created_at: -1 }).skip(skip).limit(limit).exec()
    const total = await Post.countDocuments(filter).exec()

    return {
      data: posts,
      meta: {
        totalCount: total,
        pageIndex: page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    return {
      error: true,
      message: (error as Error).message || 'Internal server error',
    }
  }
})
