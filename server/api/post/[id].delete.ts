export default defineEventHandler(async (event) => {
  try {
      const id = event.context.params?.id
      const result = await Post.deleteOne({
        _id: id,
      })
      if (result.deletedCount === 0) {
        return createError({
          statusCode: 404,
          statusMessage: 'Post Not Found',
        })
      }
      return { message: 'Post deleted successfully' }
  } catch (error) {
    let newError = error as any
    return createError({
      statusCode: newError?.statusCode || 500,
      statusMessage: newError?.message || 'Internal Server Error',
    })
  }
})
