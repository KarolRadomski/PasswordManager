import { defineStore } from 'pinia';
import axios from 'axios';
const CryptoJS = require('crypto-js');

export const useUsersStore = defineStore('Users', {
  state: () => {
    return {
      projects: [],
      selectedProject: '',
      selectedEntry: '',
      projectError: '',
    };
  },
  actions: {
    async getMyProjects() {
      try {
        this.projectError = '';

        this.projects = [];
        this.selectedProject = '';
        this.selectedEntry = '';

        let user = JSON.parse(localStorage.getItem('user'));
        let config = {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        };

        //fetch projects
        const temp = await axios.get('api/projects/user', config);
        //save projects to states
        this.projects = temp.data;

        //fetch entries
        this.projects?.forEach(async (project, index) => {
          const temp = await axios.get('api/entry/user/' + project.id, config);
          this.projects[index].entries = temp.data;
          this.projects[index].entries.map((entry) => {
            if (entry.password) {
              let bytes = CryptoJS.AES.decrypt(entry.password, process.env.VUE_APP_CRYPTO_SECRET);
              entry.password = bytes.toString(CryptoJS.enc.Utf8);
            }
          });

          console.log(temp.data);
          if (index === 0) this.selectProject(this.projects[0]?.id);
        });
      } catch (error) {
        this.projectError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async selectProject(id) {
      this.selectedProject = this.projects.find((project) => project.id === id);
      this.selectedEntry = this.selectedProject.entries[0];
    },
  },
  getters: {},
});
