import axios from 'axios';

axios.defaults.baseURL = process.env.CONTACT_URL;

const signUpApi = {
  signUp(data) {
    return axios({
      method: 'POST',
      url: '/interested-in-speaking',
      data,
    });
  },
};

export default signUpApi;
