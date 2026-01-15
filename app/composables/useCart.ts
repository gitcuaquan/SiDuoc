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

  watch(() => cart.value, (newCart) => {
    let changed = false
    newCart.forEach((item) => {
      const max = Number(item.sl_toi_da) || 0
      const qty = Number(item.quantity) || 0

      if (max > 0 && qty > max) {
        item.quantity = max
        useToast().error(`Số lượng tối đa cho sản phẩm là ${max}.`)
        changed = true
      }

      if (qty < 0) {
        item.quantity = 0
        changed = true
      }
    })

    if (changed) {
      cart.value = [...newCart]
    }
    asyncCartUpdateToServer()
  }, { deep: true })

  const addToCart = (product: ITemsTapmed, auto?: boolean) => {
    const slToiDa = product.sl_toi_da || 0;
    const productId = product.ma_vt.trim();
    const existingProduct = cart.value.find((item) => item.ma_vt.trim() === productId);

    // Lấy quantity từ product, đảm bảo luôn là số hợp lệ
    const inputQty = Number(product.quantity) || 0;

    // Nếu quantity <= 0 => xóa khỏi giỏ
    if (inputQty <= 0 && !auto) {
      removeFromCart(productId);
      return true;
    }

    // Số lượng sẽ set sau khi thao tác
    const desiredQty = existingProduct
      ? auto
        ? (existingProduct.quantity || 0) + 1
        : inputQty
      : auto
        ? 1
        : Math.max(inputQty, 1);

    if (slToiDa > 0 && desiredQty > slToiDa) {
      useToast().error(`Số lượng tối đa cho sản phẩm này là ${slToiDa}.`);
      return false;
    }

    if (existingProduct) {
      existingProduct.quantity = desiredQty;
      asyncCartUpdateToServer();
      if (existingProduct.quantity <= 0) {
        removeFromCart(productId);
      }
      return true;
    } else {
      cart.value.push({
        ...product,
        sl_toi_da: product.sl_toi_da,
        quantity: desiredQty,
        han_sd_web: product.han_sd_web || '',
      } as ITemsTapmedNew);
      asyncCartUpdateToServer();
      return true;
    }
  };


  const getQtyById = (productId: string) => {
    const product = cart.value.find((item) => item.ma_vt === productId)
    return product ? product.quantity || 0 : 0
  }

  const removeFromCart = (productId: string) => {
    cart.value = cart.value.filter((item) => item.ma_vt !== productId)
    useToast().success('Đã xóa sản phẩm khỏi giỏ hàng.')
    asyncCartUpdateToServer();
  }

  const clearCart = () => {
    cart.value = []
    asyncCartUpdateToServer();
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
