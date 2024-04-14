import axiosClient from "./axiosClient";
const logApi = {
  async pushLog(data) {
    const url = "/log/push";
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
export default logApi;
