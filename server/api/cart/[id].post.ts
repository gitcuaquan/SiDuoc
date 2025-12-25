export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    const body = await readBody(event)

    const cartExists = await Cart.findOne({ user_id: id })

    if (cartExists) {
      //@ts-ignore
      cartExists.data = JSON.stringify(body)
      await cartExists.save()
      return cartExists
    }

    const cart = await Cart.create({
      user_id: id,
      data: JSON.stringify(body),
    })

    return cart
  } catch (error) {
    console.error('Error saving cart:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
