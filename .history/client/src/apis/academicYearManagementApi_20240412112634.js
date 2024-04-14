import axiosClient from "./axiosClient";

const assetManagementApi = {
    async listAssetManagement() {
        const url = 'rentals';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async listAssetReports(id) {
        const url = 'rentals/'+id+"/reports";
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getrentalstatistics(year, month) {
        const url = `statistics?year=${year}&month=${month}`;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createAssetManagement(data) {
        const url = 'rentals';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createAssetReports(data) {
        const url = 'rentals/reports';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateAssetManagement(data, id) {
        const url = 'rentals/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchAssetManagement(name) {
        const url = 'rentals/search?query=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteAssetManagement(id) {
        const url = 'rentals/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailAssetManagement(id) {
        const url = 'rentals/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },  
    async searchrentalsByName(name) {
        const url = 'rentals/search?query=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    
    async banAccount(data, id) {
        const url = '/rentals/update-is-rented/' + id;
        return await axiosClient.put(url, data);
    },

    async unBanAccount(data, id) {
        const url = '/rentals/update-is-rented/' + id;
        return await axiosClient.put(url, data);
    },
}

export default assetManagementApi;
