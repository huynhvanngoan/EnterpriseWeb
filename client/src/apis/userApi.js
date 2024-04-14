import axiosClient from "./axiosClient";

const userApi = {
  async getAllPersonalInfo() {
    const url = "/auth/users";
    try {
      const response = await axiosClient.get(url);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getByRole(role) {
    const url = "/auth/getUserByRole/" + role;
    try {
      const response = await axiosClient.get(url);
      console.log(response.data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  login(email, password) {
    const url = "/auth/login";
    return axiosClient
      .post(url, {
        email,
        password,
      })
      .then((response) => {
        console.log(response);
        if (response.status) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        return response;
      });
  },

  getProfile() {
    const url = "/auth/profile";
    return axiosClient.get(url);
  },

  updateProfile(data, id) {
    const url = "/user/updateProfile/" + id;
    return axiosClient.put(url, data);
  },

  forgotPassword(data) {
    const url = "/auth/forgot-password";
    return axiosClient.post(url, data);
  },

  listUserByAdmin(data) {
    const url = "/auth/users/search";
    return axiosClient.post(url, data);
  },

  banAccount(data, id) {
    const url = "/user/updateProfile/" + id;
    return axiosClient.put(url, data);
  },

  unBanAccount(data, id) {
    const url = "/user/updateProfile/" + id;
    return axiosClient.put(url, data);
  },

  searchUser(email) {
    console.log(email);
    const params = {
      email: email.target.value,
    };
    const url = "/user/searchByEmail";
    return axiosClient.get(url, { params });
  },

  sendNotification(data) {
    console.log(data);
    const url = "/auth/notifications";
    return axiosClient.post(url, data);
  },

  listNotification() {
    const url = "/notifications";
    return axiosClient.get(url);
  },
  async deleteUser(id) {
    const url = "/auth/user/" + id;
    try {
      const response = await axiosClient.delete(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getById(id) {
    const url = "/auth/user/" + id;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async update(data, id) {
    const url = "/auth/user/" + id;
    try {
      const response = await axiosClient.put(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default userApi;
