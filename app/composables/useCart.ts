import type { ITemsTapmed } from "~/model"

interface ITemsTapmedNew extends ITemsTapmed {
  gia_moi?: number;
}
export const useCart = () => {
  // const { csrf } = useCsrf();
  const { user } = useAuth()
  // giới hạn debounce
  let timeOut = ref<any>("")
  const cart = useState<ITemsTapmedNew[]>('cart', () => [])

  const addToCart = (product: ITemsTapmed, auto?: boolean) => {
    const productId = product.ma_vt.trim()
    const existingProduct = cart.value.find(item => item.ma_vt.trim() === productId)

    // Lấy quantity từ product, đảm bảo luôn là số hợp lệ
    const inputQty = Number(product.quantity) || 0

    // Nếu quantity <= 0 => xóa khỏi giỏ
    if (inputQty <= 0 && !auto) {
      removeFromCart(productId)

      return
    }

    if (existingProduct) {
      if (auto) {
        // tăng +1
        existingProduct.quantity = (existingProduct.quantity || 0) + 1
        asyncCartUpdateToServer();
      } else {
        // cập nhật số lượng mới
        existingProduct.quantity = inputQty
        asyncCartUpdateToServer();
      }
      // Nếu sau cập nhật mà <= 0 thì xóa khỏi giỏ
      if (existingProduct.quantity <= 0) {
        removeFromCart(productId)
      }
    } else {
      // Nếu chưa có và auto = true → mặc định quantity = 1
      const qtyToSet = auto ? 1 : Math.max(inputQty, 1)

      cart.value.push({
        ...product,
        quantity: qtyToSet
      } as ITemsTapmedNew)
      asyncCartUpdateToServer();
    }
  }


  const getQtyById = (productId: string) => {
    const product = cart.value.find((item) => item.ma_vt === productId)
    return product ? product.quantity || 0 : 0
  }

  const removeFromCart = (productId: string) => {
    cart.value = cart.value.filter((item) => item.ma_vt !== productId)
    asyncCartUpdateToServer();
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

  function asyncCartUpdateToServer() {
    if (timeOut.value) clearTimeout(timeOut.value)
    timeOut.value = window.setTimeout(async () => {
      if (user.value) {
        await useFetch(`/api/cart/${user.value?.data.ma_kh}`, {
          method: 'POST',
          body: JSON.stringify(cart.value),
          // headers: {
          //   'csrf-token': csrf || ''
          // }
        })
      }
    }, 1000)
  }
  watch(() => user.value?.data.ma_kh, (newToken) => {
    if (newToken) {
      // đồng bộ giỏ hàng từ server
      useFetch<{
        data: any[];
      }>(`/api/cart/${user.value?.data.ma_kh}`, {
        method: 'GET',
        // headers: {
        //   'csrf-token': csrf || ''
        // }
      }).then(({ data }) => {
        if (data.value && Array.isArray(data.value.data)) {
          cart.value = data.value.data;
        }
      })
    }
  });

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
    isCartEmpty,
  }
}
