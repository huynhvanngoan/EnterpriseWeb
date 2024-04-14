import axiosClient from "./axiosClient";
const commentApi = {
  async create(data) {
    const url = "/comment/create";
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
export default commentApi;
