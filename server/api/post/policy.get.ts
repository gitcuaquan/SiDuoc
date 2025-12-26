export default defineEventHandler(async (event) => {
  try {
    const policy = await Post.findOne(
      { category: 'policy', public: true },
      null,
      { sort: { _id: -1 } }
    );
    return policy;
  } catch (error) {
    throw error;
  }
});