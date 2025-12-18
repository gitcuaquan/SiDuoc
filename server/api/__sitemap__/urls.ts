import { ITemsTapmed } from './../../../app/model/item/ITemsTapmed';
import { BaseResponse } from './../../../app/model/http/BaseResponse';
// server/api/__sitemap__/urls.ts
import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrl } from '#sitemap/types'

export default defineSitemapEventHandler(async () => {

  const rsData = await $fetch<{ data: any, meta: any }>('/api/post/list')
  const posts = rsData?.data?.map((item: any) => ({
    loc: `/${item.category}/${item.slug}`, // Transform to your domain structure
    _sitemap: 'posts',
  }))

  const rsProducts = await $fetch<BaseResponse<ITemsTapmed>>('/api/proxy/ItemsTapmed', {
    method: 'POST',
    body: {
      "pageIndex": 1,
      "pageSize": 200,
    }
  })
  const productsArray: ITemsTapmed[] = Array.isArray(rsProducts.data)
    ? rsProducts.data
    : rsProducts.data.items ?? [];

  const productUrls = productsArray.map((item: any) => ({
    loc: `/product/${item.ma_vt}`, // Transform to your domain structure
    _sitemap: 'products',
  }))
  return [...posts, ...productUrls] as SitemapUrl[]
})
