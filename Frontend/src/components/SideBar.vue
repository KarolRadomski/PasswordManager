<template>
  <div class="sideBarWrapper">
    <!-- Admin  -->
    <div v-if="this.user?.admin">
      <ul>
        <li :class="[isActive == 'Dashboard' ? 'active' : '']"><a href="/admin">Dashboard</a></li>
        <li :class="[isActive == 'Projects' ? 'active' : '']"><a href="./projects">Projects</a></li>
        <li :class="[isActive == 'Users' ? 'active' : '']"><a href="./users">Users</a></li>
      </ul>
    </div>

    <!-- User -->
    <div v-else>
      <input class="searchBar" type="text" placeholder="Search" v-model="searchQuery" @change="filterProducts" />
      <h3 class="title">Yours projects</h3>

      <ul v-if="filteredProjects.length > 0">
        <li
          v-for="project in filteredProjects"
          :key="project.id"
          :class="[selectedProject.id == project.id ? 'active' : '']"
          @click="
            () => {
              selectProject(project.id);
            }
          "
        >
          {{ project.name }}
        </li>
      </ul>
      <div v-else>
        <p class="mt-5">You don't have any projects yet.</p>
      </div>
    </div>

    <div>
      <div class="userInfo">
        <img class="avatar" src="../assets/avatar.png" alt="logo" />
        <span v-if="user !== null" class="username">{{ user.name }}</span>
      </div>
      <button class="logoutButton" @click="handleLogout">Logout</button>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/User';
import { useUsersStore } from '../stores/Users';
import { mapState, mapActions, mapWritableState } from 'pinia';

export default {
  name: 'SideBar',
  props: ['isActive'],
  data() {
    return {
      filteredProjects: [],
      searchQuery: '',
    };
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    ...mapState(useUsersStore, ['projects', 'selectedProject']),
    ifSelectedProject(projectID) {
      return this.selectedProject.id == projectID ? true : false;
    },
    filteredProjects() {
      return this.projects.filter((project) => {
        return project.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
    ...mapActions(useUserStore, ['logout', 'validateToken']),
    ...mapActions(useUsersStore, ['getMyProjects', 'selectProject']),
    async handleLogout() {
      await this.logout();
      this.$router.push('/login');
    },
  },
  async created() {
    if (this.user === null) {
      this.$router.push('/login');
    } else {
      if (!this.user.admin) {
        await this.getMyProjects();
      } else {
        const results = await this.validateToken();
        if (results == false) {
          await this.logout();
          this.$router.push('/login');
        }
      }
    }
  },
};
</script>

<style scoped>
.sideBarWrapper {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.searchBar {
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: none;
  padding: 0 10px;
  box-sizing: border-box;
  margin-bottom: 20px;
  font-size: 16px;
  padding: 10px 45px;
  background: white url('../assets/searchIcon.svg') no-repeat 15px center;
  background-size: 20px 20px;
  transition: all 0.2s ease-in-out;
}

.searchBar:focus {
  outline: none;
  transform: scale(1.03);
}
.title {
  text-align: start;
  margin-left: 20px;
  margin-top: 20px;
}
ul {
  list-style-type: none;
  margin: 30px;
  padding: 0;
  text-align: left;
  font-size: 20px;
}
li {
  margin: 20px 0;
}
a {
  color: white;
  text-decoration: none;
}
li:hover > a,
li:hover {
  cursor: pointer;
  color: #3498db;
}

.active {
  color: #3498db;
}

.active > a {
  color: #3498db;
  font-weight: bold;
}
.userInfo {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 25%;
  height: auto;

  border-radius: 50%;
}

.username {
  font-size: 18px;
  margin-left: 15px;
  font-weight: bold;
}
.logoutButton {
  border: none;
  color: #2c3e50;
  background-color: white;
  padding: 10px 20px;
  border-radius: 5px;
  width: 100%;
  font-size: 16px;
}
.logoutButton:hover {
  cursor: pointer;
  background-color: #ecf0f1;
  transform: scale(1.03);
}
</style>
