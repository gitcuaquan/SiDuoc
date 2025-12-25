
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const data = await Cart.findOne({ user_id: id })
  return {
    user_id: data?.user_id,
    data: data ? JSON.parse(data.data) : [],
  }
})
