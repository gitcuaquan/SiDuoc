
import type { CustomerDetail, CustomerResponse } from "~/model/customer/Customer";

export const useAuth = () => {

  const NAME_TOKEN_IN_COOKIE = 'tapmed_token_access';

  const token = useCookie<string | null>(NAME_TOKEN_IN_COOKIE);
  const user = useState<CustomerResponse | null>('user', () => null);
  const showLogin = useState<boolean>('showLogin', () => false);
  const showRegister = useState<boolean>('showRegister', () => false);

  /**
   * Đã đăng nhập hay chưa
   */
  const isAuthenticated = computed(() => !!token.value);

  const setToken = (newToken: string) => {
    token.value = newToken;
  };

  const clearToken = () => {
    token.value = null;
  };

  const setUser = (newUser: any) => {
    user.value = newUser;
  };


  const clearUser = () => {
    user.value = null;
  }

  const togglePopupLogin = () => {
    showLogin.value = !showLogin.value;
  };

  const togglePopupRegister = () => {
    showRegister.value = !showRegister.value;
  };

  watch(() => user.value?.data.ma_kh, (newToken) => {
    if (!newToken) {
      clearUser();
    }
  });

  return {
    isAuthenticated,
    setToken,
    clearToken,
    token,
    showLogin,
    showRegister,
    togglePopupLogin,
    togglePopupRegister,
    user,
    setUser,
    clearUser,
  };
}
