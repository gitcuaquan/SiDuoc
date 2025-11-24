export default defineNuxtPlugin(async (nuxtApp) => {
    const { token, setUser, clearToken, clearUser } = useAuth();
    const { initCartFromStorage } = useCart();
    if (!token.value) {
        return;
    }
    initCartFromStorage();

    try {
        interface ApiResponse {
            data: any; // Replace 'any' with the actual type if known
            [key: string]: any;
        }
        const { data, error } = await useFetch<ApiResponse>('/api/proxy/CustomerTapmed/details', {
            method: 'POST',
            body: {},
            headers: {
                'Authorization': `Bearer ${token.value}`
            },
        });
        if (error.value) {
            if (error.value.statusCode === 401 || error.value.statusCode === 403) {
                clearToken();
                clearUser();
            }
            return;
        }
        data.value?.data && setUser(data.value.data);
    } catch (error) {
        console.error('Error fetching user details:', error);
        // Xử lý lỗi nếu cần thiết
    }
});