export default defineNuxtRouteMiddleware((to, from) => {
    const { ref } = to.query
    if(ref){
        const refValue = Array.isArray(ref) ? ref[0] : ref
        useCookie('referral_siduoc',{
            maxAge: 60 * 60 * 24 * 30 // 30 days
        }).value = refValue
    }
})
