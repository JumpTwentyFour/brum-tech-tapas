import axios from 'axios';

axios.defaults.baseURL = process.env.CONTACT_URL;

console.log(process.env.CONTACT_URL);
const signUpApi = {
  signUp(data) {
    return axios({
      method: 'POST',
      url: '/contact-us',
      data,
    });
  },
};

export default signUpApi;
