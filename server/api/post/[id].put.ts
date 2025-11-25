export default defineEventHandler(async (event) => {
  try {
     const id = event.context.params?.id
      const body = await readBody(event)
      const result = await Post.updateOne(
        { _id: id },
        {
          $set: body,
        }
      )
      if (result.matchedCount === 0) {
        return createError({
          statusCode: 404,
          statusMessage: 'Post Not Found',
        })
      }
      return { message: 'Post updated successfully' }
  } catch (error) {
    let newError = error as any
    return createError({
      statusCode: newError?.statusCode || 500,
      statusMessage: newError?.message || 'Internal Server Error',
    })
  }
})
