export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    body.updated_at = new Date()
    body.created_at = new Date()
    body.slug = createVietnameseSlug(body.title)
    const newPost = await Post.create(body)
    return newPost
  } catch (error) {
    return error
  }
})

function createVietnameseSlug(str: string): string {
  str = str.toLowerCase();
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Chuẩn hóa và xóa ký tự có dấu
  str = str.replace(/[^a-z0-9\s-]/g, ''); // Xóa ký tự không mong muốn
  str = str.trim().replace(/\s+/g, '-'); // Thay thế khoảng trắng bằng dấu gạch nối và xóa khoảng trắng thừa
  return str;
}