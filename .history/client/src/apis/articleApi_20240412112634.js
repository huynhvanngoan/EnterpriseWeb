import axiosClient from "./axiosClient";
const ariticle = {
  async listAriticle() {
    const url = "/article/get/all";
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async listAriticlePublic() {
    const url = "/article/public/all";
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getArticleByUserId(userId) {
    const url = "/article/" + userId;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getArticlePublic() {
    const url = "/article/public/all";
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async createArticle(data) {
    const url = "/article/create";
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async deleteArticle(id) {
    const url = "/article/" + id;
    try {
      const response = await axiosClient.delete(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async updateArticle(data, id) {
    const url = "/article/" + id;
    try {
      const response = await axiosClient.put(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getArticleByFaculty(id) {
    const url = "/article/getbyfaculty/" + id;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getArticleApproved() {
    const url = "/article/getapproved/all";
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async downloadAllArticles() {
    const url = "/article/download/all";
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async downloadArticle(id) {
    const url = "/article/downloadbyid/" + id;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getById(id) {
    const url = "/article/getbyid/" + id;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
export default ariticle;
