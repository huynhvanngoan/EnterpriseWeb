import axiosClient from "./axiosClient";

const assetCategoryApi = {
    async listAssetCategories() {
        const url = 'assetCategory';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createAssetCategory(data) {
        const url = 'assetCategory';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateAssetCategory(data, id) {
        const url = 'assetCategory/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchAssetCategory(name) {
        const url = 'assetCategory/search?keyword=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteAssetCategory(id) {
        const url = 'assetCategory/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailAssetCategory(id) {
        const url = 'assetCategory/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },  
}

export default assetCategoryApi;
