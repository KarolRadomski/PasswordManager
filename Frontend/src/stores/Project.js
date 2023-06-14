import { defineStore } from 'pinia';
import axios from 'axios';
const CryptoJS = require('crypto-js');

export const useProjectStore = defineStore('Project', {
  state: () => {
    return {
      projects: [],
      selectedProject: '',
      entries: [],
      selectedEntry: '',
      selectedEntryAccesses: [],
      users: [],
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

        const data = {
          name,
        };

        await axios.post('api/projects', data, config);
      } catch (error) {
        this.projectError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async removeProject(name, id) {
      try {
        this.projectError = '';

        let user = JSON.parse(localStorage.getItem('user'));
        let headers = {
          Authorization: 'Bearer ' + user.token,
        };

        const data = {
          name,
        };

        await axios.delete('api/projects', { headers, data });

        this.projects = this.projects.filter((project) => project.id !== id);
      } catch (error) {
        this.projectError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    selectProject(projectID) {
      this.selectedProject = this.projects.find((project) => project.id === projectID);
      this.getAllUsers();
    },

    async getAllProjectEntries() {
      try {
        this.projectError = '';

        let user = JSON.parse(localStorage.getItem('user'));
        let config = {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        };
        const temp = await axios.get(`api/entry/user/${this.selectedProject.id}`, config);
        this.entries = temp.data;

        this.entries.map((item) => {
          if (item.password) {
            let bytes = CryptoJS.AES.decrypt(item.password, process.env.VUE_APP_CRYPTO_SECRET);
            item.password = bytes.toString(CryptoJS.enc.Utf8);
          }
        });
      } catch (error) {
        this.projectError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async addEntry(entry, selectedUsers) {
      try {
        this.projectError = '';

        let user = JSON.parse(localStorage.getItem('user'));
        let config = {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        };

        const data = {
          name: entry.name,
          login: entry.username,
          password: entry.password,
          url: entry.url,
          projectId: this.selectedProject.id,
        };

        const temp = await axios.post('api/entry', data, config);
        const entryID = temp.data.id;
        //grant access to users

        console.log(selectedUsers);
        selectedUsers.forEach(async (user) => {
          const data = {
            entryID: entryID,
          };
          await axios.post(`api/access/${user.id}`, data, config);
        });
      } catch (error) {
        this.projectError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async removeEntry(name, id) {
      try {
        this.projectError = '';

        let user = JSON.parse(localStorage.getItem('user'));
        let headers = {
          Authorization: 'Bearer ' + user.token,
        };

        await axios.delete(`api/entry/${id}`, { headers });

        this.entries = this.entries.filter((entry) => entry.id !== id);
      } catch (error) {
        this.projectError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async selectEntry(entryID) {
      try {
        this.selectedEntry = this.entries.find((entry) => entry.id === entryID);
        this.projectError = '';
        this.selectedEntryAccesses = [];
        let user = JSON.parse(localStorage.getItem('user'));
        let headers = {
          Authorization: 'Bearer ' + user.token,
        };
        await this.getAllUsers();
        const temp = await axios.get(`api/access/${entryID}`, { headers });

        temp.data.access.map((acc) => {
          this.users.forEach((user) => {
            if (user.id === acc.userId) {
              this.selectedEntryAccesses.push({ name: user.name, id: user.id });
            }
          });
        });
      } catch (error) {
        this.projectError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },

    async getAllUsers() {
      try {
        this.projectError = '';

        let user = JSON.parse(localStorage.getItem('user'));
        let headers = {
          Authorization: 'Bearer ' + user.token,
        };

        const temp = await axios.get('api/users', { headers });

        this.users = temp.data.filter((user) => user.admin !== true);
      } catch (error) {
        this.projectError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
    async updateEntry(entryID, entry, selectedUsers) {
      try {
        this.projectError = '';

        let user = JSON.parse(localStorage.getItem('user'));
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const data = {
          name: entry.name,
          login: entry.username,
          password: entry.password,
          url: entry.url,
          users: selectedUsers,
        };
        console.log(data);

        await axios.put(`api/entry/${entryID}`, data, config);
      } catch (error) {
        this.projectError = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      }
    },
  },
  getters: {},
});
