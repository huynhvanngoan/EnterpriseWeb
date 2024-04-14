import axiosClient from "./axiosClient";

const facultyApi = {
  async listFaculty() {
    const url = "/faculty/all";
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async createFaculty(data) {
    const url = "/faculty/create";
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getById(id) {
    const url = "/faculty/" + id;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async updateFaculty(data, id) {
    const url = "/faculty/" + id;
    try {
      const response = await axiosClient.put(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async deleteFaculty(id) {
    const url = "/faculty/" + id;
    try {
      const response = await axiosClient.delete(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default facultyApi;
