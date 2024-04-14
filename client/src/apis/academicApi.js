import axiosClient from "./axiosClient";
const academicApi = {
  async listAcademic() {
    const url = "/academic/all";
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async createAcademic(data) {
    const url = "/academic/create";
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async deleteAcademic(id) {
    const url = "/academic/" + id;
    try {
      const response = await axiosClient.delete(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async updateAcademy(data, id) {
    const url = "/academic/" + id;
    try {
      const response = await axiosClient.put(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getById(id) {
    const url = "/academic/" + id;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
export default academicApi;
