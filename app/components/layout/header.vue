<template>
  <div id="top-header"></div>
  <div id="main-header" class="bg-white">
    <div class="container-md py-3 pb-2 py-md-1">
      <div class="row align-items-center justify-content-between">
        <div class="col-3 d-md-none d-block">
          <button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
            class="btn btn-outline-light border-0 px-0 text-dark">
            <Menu />
          </button>
        </div>
        <!-- logo -->
        <div class="col-5 col-md-2 order-1">
          <nuxt-link to="/">
            <img src="/images/logo-tapmed.png" class="w-100" alt="" />
          </nuxt-link>
        </div>
        <div class="col-md-7 col-12 order-3 order-md-2 d-none d-md-block">
          <div :class="'d-flex position-relative my-3 flex-column w-100 has-focus' +
            (isFocusSearch ? ' has-focus' : '')
            ">
            <form id="searchId"
              class="position-relative overflow-hidden bg-white d-flex align-items-center w-100 p-1 border rounded mt-md-0"
              role="search">
              <input class="form-control form-control-sm me-2 border-0 shadow-none" type="search" ref="searchInput"
                v-model="keywordSearch" placeholder="Tìm kiếm sản phẩm" aria-label="Search" />
              <div class="bg-white p-1 position-absolute top-0 end-0 h-100 d-flex align-items-center">
                <button class="btn btn-sm d-flex align-items-center justify-content-center h-100 py-2 px-2 btn-primary"
                  type="button">
                  <Search :size="16" />
                </button>
              </div>
            </form>

            <div v-if="isFocusSearch" class="search-backdrop"></div>

            <div v-if="isFocusSearch"
              class="position-absolute shadow overflow-auto p-2 search-view rounded w-100 bg-white mt-3">
              <div v-if="loading" class="w-100 h-100 search-view d-flex justify-content-center align-items-center">
                <UiLoading />
              </div>
              <div v-else>
                <ul class="list-unstyled">
                  <li v-for="product in listProduct?.getData || []" :key="product.ma_vt"
                    class="d-flex item-hover align-items-center gap-2 ps-0 py-3">
                    <NuxtLink :to="`/product/${product.ma_vt}`" class="text-decoration-none text-dark">
                      <div class="d-flex gap-2 align-items-center">
                        <div class="ratio ratio-1x1 border rounded" style="width: 60px">
                          <img :src="product.image_urls?.[0]?.url ||
                            '/images/image-error.svg'
                            " :alt="product.ten_vt" style="object-fit: contain" />
                        </div>
                        <div class="d-flex flex-column">
                          <span class="fw-medium">{{ product.ten_vt }}</span>
                        </div>
                      </div>
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
            <!-- tìm kiếm -->

            <!-- menu button -->
            <!-- <ul
              class="list-inline mb-0 flex-nowrap w-100 overflow-auto"
              id="category-list"
            >
              <li
                v-for="(category, idx) in categories"
                :key="idx"
                class="list-inline-item py-2 text-nowrap"
              >
                {{ category }}
                <span v-if="idx < categories.length - 1"> |</span>
              </li>
            </ul> -->
          </div>
        </div>
        <div class="col-md-3 col-4 order-2 order-md-3">
          <div class="d-flex align-items-center justify-content-end gap-1">
            <!-- Đăng nhập  đăng ký -->
            <div v-if="!isAuthenticated" class="dropdown">
              <button class="btn px-0 px-md-2 text-dark border-0" type="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <div class="d-flex align-items-center">
                  <CircleUser :size="sizeIcon" :stroke-width="1" />
                  <div class="ms-2 text-start d-none d-md-block">
                    <small class="d-block">Tài khoản</small>
                    <small class="fw-semibold d-block text-muted">
                      Đăng nhập ngay
                    </small>
                  </div>
                  <ChevronDown :stroke-width="0.75" />
                </div>
              </button>
              <ul class="dropdown-menu py-2 border-0 rounded-1 shadow">
                <li>
                  <a class="dropdown-item d-flex align-items-center gap-2" style="font-size: 14px" role="button"
                    @click="togglePopupLogin()">
                    <LogIn :size="16" />Đăng nhập
                  </a>
                </li>
                <li>
                  <a class="dropdown-item d-flex align-items-center gap-2" style="font-size: 14px" role="button"
                    @click="togglePopupRegister()">
                    <UserPlus :size="16" />
                    Đăng ký
                  </a>
                </li>
              </ul>
            </div>
            <ClientOnly v-if="isAuthenticated">
              <div class="dropdown">
                <button class="btn px-0 px-md-2 text-dark border-0" type="button" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <div class="d-flex align-items-center">
                    <CircleUser :size="sizeIcon" :stroke-width="1" />
                    <div class="ms-2 text-start d-none d-md-block">
                      <small class="d-block">Xin chào !</small>
                      <small class="fw-semibold d-block text-primary">
                        {{ user?.data?.ten_kh }}
                      </small>
                    </div>
                    <ChevronDown :stroke-width="0.75" />
                  </div>
                </button>
                <ul class="dropdown-menu py-2 border-0 rounded-1 shadow">
                  <li>
                    <NuxtLink to="/auth" class="dropdown-item d-flex align-items-center gap-2" style="font-size: 14px">
                      <UserCircle :size="16" />Tài khoản của tôi
                    </NuxtLink>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex align-items-center gap-2" style="font-size: 14px" role="button"
                      @click="logOut()">
                      <LogOut :size="16" />Đăng xuất
                    </a>
                  </li>
                </ul>
              </div>
            </ClientOnly>
            <!-- Giỏ hàng -->
            <div class="d-flex h-100 align-items-center">
              <NuxtLink to="/cart" class="position-relative me-2 px-0 px-md-2 btn text-dark border-0">
                <ShoppingCart :size="sizeIcon" :stroke-width="1" />
                <ClientOnly>
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                    {{ totalProducts }}
                  </span>
                </ClientOnly>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="bottom-header" class="sticky-top">
    <nav class="navbar py-0 bg-light shadow-sm navbar-expand-md">
      <div class="container ps-1">
        <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel">
          <div class="offcanvas-header bg-light">
            <h5 class="offcanvas-title" id="offcanvasNavbarLabel">
              <nuxt-link to="/">
                <img src="/images/logo-tapmed.png" width="120" alt="" />
              </nuxt-link>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav fw-bold py-2 gap-1 flex-grow-1">
              <li class="nav-item py-2 px-3 ps-lg-0">
                <nuxt-link to="/" class="nav-link  fw-bold py-1" role="button">
                  Trang chủ
                </nuxt-link>
              </li>
              <li class="nav-item py-2 position-relative px-3" v-for="value in menu">
                <nuxt-link :to="value.url" class="nav-link fw-bold  py-1" role="button">{{ value.name }}</nuxt-link>
                <div v-if="value.hot" class="position-absolute d-none d-md-block mt-2 top-0 end-0 translate-middle-y">
                  <img src="/images/icon-hot.webp" width="45" alt="" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
  <ClientOnly>
    <SharedModalLogin v-if="showLogin" @close="togglePopupLogin()" />
    <SharedModalRegister v-if="showRegister" @close="togglePopupRegister()" />
  </ClientOnly>
</template>

<script lang="ts" setup>
  import {
    BaseResponse,
    BodyFilter,
    FilterItem,
    OperatorType,
    type ITemsTapmed,
  } from "~/model";

  const { $bootstrap } = useNuxtApp();
  const {
    isAuthenticated,
    showLogin,
    showRegister,
    togglePopupLogin,
    togglePopupRegister,
    user,
    clearToken,
    clearUser,
  } = useAuth();

  const { totalProducts, clearCart } = useCart();
  const sizeIcon = ref(35);
  const loading = ref(false);
  const route = useRoute();
  const { $appServices } = useNuxtApp();
  const keywordSearch = useDebouncedRef<string>("", 500);

  const searchInput = ref<HTMLInputElement | null>(null);
  const categories = [
    "Thuốc",
    "Thực phẩm chức năng",
    "Thiết bị y tế",
    "Mĩ phẩm",
    "Cá nhân",
  ];

  const menu = [
    {
      name: "Sản phẩm",
      url: "/product",
    },
    {
      name: "Đặt hàng nhanh",
      url: "/quick-order",
    },
    {
      name: "Khuyến mãi",
      url: "/promotion",
      hot: true,
    },
    {
      name: "Tin tức",
      url: "/news",
    },
    {
      name: "Chính sách",
      url: "/policies",
    },
  ];
  const filterListProduct = ref(
    new BodyFilter<ITemsTapmed>({
      pageIndex: 1,
      pageSize: 20,
      filters: [
        new FilterItem<ITemsTapmed>({
          filterValue: "ten_vt",
          operatorType: OperatorType.Contains,
          valueSearch: "",
        }),
        new FilterItem<ITemsTapmed>({
          filterValue: "ten_nhasanxuat",
          operatorType: OperatorType.Contains,
          valueSearch: "",
        }),
      ],
    })
  );
  const isFocusSearch = ref(false);
  const listProduct = ref<BaseResponse<ITemsTapmed> | null>(null);
  const offCanvasInstance = ref<any>(null);
  watch(
    () => keywordSearch.value,
    (newVal) => {
      filterListProduct.value.setValue(
        "ten_vt",
        keywordSearch.value,
        OperatorType.Contains
      );
      getListProduct();
    }
  );
  onMounted(() => {
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);
    initOffcanvas();
    searchInput.value?.addEventListener("focus", () => {
      isFocusSearch.value = true;
    });
    searchInput.value?.addEventListener("blur", () => {
      setTimeout(() => {
        isFocusSearch.value = false;
      }, 200);
    });
  });
  watch(
    () => route.fullPath,
    () => {
      if (offCanvasInstance.value) {
        offCanvasInstance.value.hide();
      }
    }
  );
  watch(
    () => isFocusSearch.value,
    (newVal) => {
      if (listProduct.value == null && newVal === true) {
        getListProduct();
      }
      if (newVal === false) {
        window.document.body.style.overflow = "auto";
      } else {
        window.document.body.style.overflow = "hidden";
      }
    }
  );

  function initOffcanvas() {
    const offcanvasElement = document.getElementById("offcanvasNavbar");
    if (offcanvasElement) {
      // @ts-ignore
      offCanvasInstance.value = new $bootstrap.Offcanvas(offcanvasElement);
    }
  }

  async function getListProduct() {
    try {
      loading.value = true;
      const response = await $appServices.items.getItems(filterListProduct.value);
      listProduct.value = response;
    } catch (error) {
      console.error("Error fetching product list:", error);
    } finally {
      loading.value = false;
    }
  }

  function checkWindowSize() {
    const width = window.innerWidth;
    if (width < 768) {
      sizeIcon.value = 28;
    } else {
      sizeIcon.value = 35;
    }
  }

  function logOut() {
    clearCart();
    clearToken();
    clearUser();
    togglePopupLogin();
    useRouter().push("/");
    useToast().success("Đăng xuất thành công");
  }
</script>

<style scoped>
  .item-hover {
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #f8f9fa;
    }
  }

  /* #bottom-header {
    z-index: 1;
  } */

  #category-list {
    display: flex;
    flex-wrap: wrap;
  }

  #category-list .list-inline-item {
    font-size: 13px;
    cursor: pointer;
    /* Add transition for hover effect */
    transition: all 0.2s ease;

    &:hover {
      color: var(--bs-primary);
    }
  }

  .dropdown-menu {
    min-width: 250px;
  }

  .nav-item {
    border-radius: 5px;
    transition: all 0.2s;

    /* màu chữ */
    .nav-link {
      color: #000;
      font-weight: 400;
    }

    /* hiệu ứng hover */
    &:hover {
      .nav-link {
        color: var(--bs-primary);
      }
    }

    /* hiệu ứng active */
    .router-link-active {
      color: var(--bs-primary);
    }
  }

  .sticky-top {
    z-index: 999;
  }

  .search-view {
    z-index: 1003 !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    top: 90%;
    height: 50vh;
    overflow: auto;
  }

  .search-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #0000004b;
    z-index: 1001;
    backdrop-filter: blur(4px);
  }

  #searchId {
    z-index: 1002;
  }
</style>
