/* eslint-disable no-dupe-keys */
import axiosClient from "./axiosClient";

const dashBoardApi = {
  async getTotalAcademicYears() {
    const url = `academic/static/total`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTotalFaculties() {
    const url = `faculty/static/total`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTotalArticle() {
    const url = `article/static/total`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }, async getTotalArticle() {
    const url = `article/static/total`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTotalUser() {
    const url = `auth/static/total`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTotalByFaculty(id) {
    const url = `article/static/totalbyprivate/` + id;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTotalByAcademic(id) {
    const url = `article/static/totalbyacademic/` + id;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTotalByStatus(id) {
    const url = `article/static/totalbystatus/` + id;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTotalByComment(id) {
    const url = `article/static/totalbycomment/` + id;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTotalByUrl() {
    const url = `log/statiswithurl`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTotalByComment(id) {
    const url = `article/static/totalbycomment/` + id;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTotalByUrl() {
    const url = `log/statiswithurl`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTotalByBrower() {
    const url = `log/statiswithbrower`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default dashBoardApi;
