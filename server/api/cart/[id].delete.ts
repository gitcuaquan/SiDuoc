export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    const data = await Cart.deleteOne({ user_id: id })
    if (data.deletedCount && data.deletedCount > 0) {
      return { success: true, message: 'Cart deleted successfully' }
    } else {
      return { success: false, message: 'No cart found to delete' }
    }
  } catch (error) {
    return { success: false, message: 'Error deleting cart', error }
  }
})
