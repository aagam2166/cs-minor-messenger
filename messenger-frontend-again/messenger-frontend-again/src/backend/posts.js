import api from "./axios"

export const getMyPostsRequest = async () => {
    const res = await api.get("/posts/me");
    return res.data;
}

export const createPostRequest = async ({imageFile, caption}) => {
    const formData = new FormData();
    formData.append("avatar",imageFile);
    formData.append("caption",caption);

    const res = await api.post("/posts",formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;

};

export const deletePostRequest = async (postId) => {
  const res = await api.delete(`/posts/${postId}`);
  return res.data;
};
