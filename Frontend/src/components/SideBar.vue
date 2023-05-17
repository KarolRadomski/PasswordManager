<template>
  <div class="sideBarWrapper">
    <div>
      <input class="searchBar" type="text" placeholder="Search" />
      <ul>
        <li><a href="/">Dashboard</a></li>
        <li>Projects</li>
        <li>Users</li>
      </ul>
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
import { mapState, mapActions } from 'pinia';

export default {
  name: 'SideBar',
  data() {
    return {};
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  methods: {
    ...mapActions(useUserStore, ['logout']),
    async handleLogout() {
      await this.logout();
      this.$router.push('/login');
    },
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

ul {
  list-style-type: none;
  margin: 50px 20px;
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
li:hover {
  cursor: pointer;
  color: #3498db;
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
