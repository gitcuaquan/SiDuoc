import type { ITemsTapmed } from "~/model"

interface ITemsTapmedNew extends ITemsTapmed {
  gia_moi?: number;
}
export const useCart = () => {
  // const { isAuthenticated } = useAuth()
  // const { error } = useToast()

  const cart = useState<ITemsTapmedNew[]>('cart', () => [])

  const addToCart = (product: ITemsTapmed, auto?: boolean) => {

    const existingProduct = cart.value.find((item) => Number(item.ma_vt) === Number(product.ma_vt))
    if (product.quantity! <= 0) {
      removeFromCart(product.ma_vt)
      return
    }
    if (existingProduct) {
      if (!auto) {
        existingProduct.quantity = (product.quantity || 1) + (existingProduct.quantity || 0)
      } else {
        existingProduct.quantity = (existingProduct.quantity || 0) + 1
      }
    } else {
      cart.value.push({ ...product, quantity: product.quantity || 1 } as ITemsTapmedNew)
    }
  }

  const getQtyById = (productId: string) => {
    const product = cart.value.find((item) => item.ma_vt === productId)
    return product ? product.quantity || 0 : 0
  }

  const removeFromCart = (productId: string) => {
    cart.value = cart.value.filter((item) => item.ma_vt !== productId)
  }

  const clearCart = () => {
    cart.value = []
  }

  const totalProducts = computed(() => cart.value.length)

  const totalItems = computed(() =>
    cart.value.reduce((total, item) => total + (item.quantity || 0), 0)
  )

  const totalPrice = computed(() =>
    cart.value.reduce((total, item) => total + item.gia_nt2 * (item.quantity || 0), 0)
  )

  watch(() => cart.value, (newCart) => {
    localStorage.setItem('cart_siduoc', JSON.stringify(newCart))
  }, { deep: true })
 
  const initCartFromStorage = () => {
    const cartInStorage = localStorage.getItem('cart_siduoc');
    if (cartInStorage) {
        cart.value = JSON.parse(cartInStorage);
    }
  }
  const isCartEmpty = computed(() => cart.value.length === 0);
  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
    getQtyById,
    initCartFromStorage,
    totalProducts,
    isCartEmpty
  }
}
