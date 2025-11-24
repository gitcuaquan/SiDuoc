export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const post = await Post.findOne({
    _id: id,
  })
  return post
})
