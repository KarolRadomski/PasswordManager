import { defineStore } from 'pinia';
import axios from 'axios';

export const useProjectStore = defineStore('Project', {
  state: () => {
    return {
      projects: [],
      projectError: '',
    };
  },
  actions: {
    async getAllProjects() {
      try {
        this.projectError = '';

        let user = JSON.parse(localStorage.getItem('user'));
        let config = {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        };

        const temp = await axios.get('api/projects', config);
        this.projects = temp.data;
      } catch (error) {
        this.projectError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },

    async addProject(name) {
      try {
        this.projectError = '';

        let user = JSON.parse(localStorage.getItem('user'));
        let config = {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        };

        //name validation
        if (!name.match(/^([a-zA-Z])+/g)) {
          this.projectError = 'Invalid project name';
          return;
        }
        const data = {
          name,
        };

        await axios.post('api/projects', data, config);
      } catch (error) {
        this.projectError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async removeProject(name) {
      try {
        this.projectError = '';

        let user = JSON.parse(localStorage.getItem('user'));
        let headers = {
          Authorization: 'Bearer ' + user.token,

        };
        console.log(config);
        const data = {
          name,
        };

        await axios.delete('api/projects', { headers, data });
      } catch (error) {
        this.projectError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
  },
  getters: {},
});
