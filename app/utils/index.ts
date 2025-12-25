
export function formatCurrency(value: number): string {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated.value) return 'Đăng nhập để xem giá';
    if (value === null || value === undefined) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value);
}
export function formatDate(dateString: string | undefined): string {
    const date = new Date(dateString || '');
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export function textTruncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength) + '...';
}