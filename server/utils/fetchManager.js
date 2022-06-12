/*
 * Adapted from a Microsoft example of axios-based 
 */

const { default: axios } = require('axios');

const callAPI = {
    get: async (endpoint, accessToken) => {

        if (!accessToken || accessToken === "") {
            throw new Error('No tokens found');
        }
        
        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
        
        console.log('GET request made to web API at: ' + new Date().toString());
    
        try {
            const response = await axios.default.get(endpoint, options);
            return response.data;
        } catch(error) {
            console.log(error);
            return error;
        }
    },

    post: async (endpoint, accessToken, payload) => {

        if (!accessToken || accessToken === "") {
            throw new Error('No tokens found');
        }
        
        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
        
        console.log('POST request made to web API at: ' + new Date().toString());
    
        try {
            const response = await axios.default.get(endpoint, payload, options);
            return response.data;
        } catch(error) {
            console.log(error);
            return error;
        }
    }

};

module.exports = {
    callAPI
};