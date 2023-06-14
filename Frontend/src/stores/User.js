import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('User', {
  state: () => {
    return {
      user: JSON.parse(localStorage.getItem('user')),
      userError: '',
      users: [],
    };
  },
  actions: {
    // User login
    async login(email, password) {
      try {
        this.userError = '';
        const data = {
          email,
          password,
        };
        const temp = await axios.post('api/users/login', data);
        this.user = temp.data;
        localStorage.setItem('user', JSON.stringify(temp.data));
      } catch (error) {
        this.userError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async logout() {
      try {
        this.userError = '';
        this.user = null;
        localStorage.removeItem('user');
      } catch (error) {
        this.userError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async createUser(userData) {
      try {
        this.userError = '';

        let user = JSON.parse(localStorage.getItem('user'));
        let config = {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        };

        const data = {
          name: userData.username,
          email: userData.email,
          password: userData.password,
        };

        await axios.post('api/users/add', data, config);
      } catch (error) {
        this.userError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async getAllUsers() {
      try {
        this.userError = '';

        let user = JSON.parse(localStorage.getItem('user'));
        let headers = {
          Authorization: 'Bearer ' + user.token,
        };

        const temp = await axios.get('api/users', { headers });

        this.users = temp.data.filter((user) => user.admin !== true);
      } catch (error) {
        this.userError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async removeUser(userID) {
      try {
        this.userError = '';

        let user = JSON.parse(localStorage.getItem('user'));
        let headers = {
          Authorization: 'Bearer ' + user.token,
        };

        await axios.delete(`api/users/${userID}`, { headers });

        this.users = this.users.filter((user) => user.id !== userID);
      } catch (error) {
        this.userError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
  },
  getters: {},
});
