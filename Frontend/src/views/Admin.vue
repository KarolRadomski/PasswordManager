<template>
  <div class="homeWrapper">
    <SideBar class="sideBar" isActive="Dashboard" />
    <div class="home">
      <div class="title">
        <h1>Admin dashboard</h1>
        <p>Welcome back <b>Admin</b></p>
      </div>

      <div class="overviewWrapper">
        <div class="card">
          <h3>Projects</h3>
          <p>{{ projectsNumber }}</p>
        </div>
        <div class="card">
          <h3>Users</h3>
          <p>{{ usersNumber - 1 }}</p>
        </div>
        <div class="card">
          <h3>Accesses</h3>
          <p>{{ entriesNumber }}</p>
        </div>
      </div>

      <div class="quickAccessTitle">
        <h2>Quick Access</h2>
      </div>

      <div class="quickAccessWrapper">
        <div class="quickAddProject" @click="this.$router.push('/add-project')">
          <h3>Add Project</h3>
        </div>
        <div class="quickAddUser" @click="this.$router.push('/add-user')">
          <h3>Add User</h3>
        </div>
        <div class="quickAddAccess">
          <h3>...</h3>
        </div>
        <div class="quickGrantAccess">
          <h3>...</h3>
        </div>
        <div class="quickCard">
          <h3>...</h3>
        </div>
        <div class="quickCard">
          <h3>...</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '../components/SideBar.vue';
import { useUserStore } from '../stores/User';
import { useAdminStore } from '../stores/Admin';
import { mapState, mapActions } from 'pinia';

export default {
  name: 'Home',
  methods: {
    ...mapActions(useAdminStore, ['getNumbers']),
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    ...mapState(useAdminStore, ['usersNumber', 'projectsNumber', 'entriesNumber']),
  },
  created() {
    if (!this.user?.id) {
      this.$router.push('/login');
    } else {
      this.getNumbers();
    }
  },
  components: {
    SideBar,
  },
};
</script>

<style scoped>
.homeWrapper {
  display: flex;
}

.home {
  width: 80%;
  margin-left: 20%;
}
.sideBar {
  position: fixed;
  width: 20%;
  height: 100vh;
}
.title,
.quickAccessTitle {
  text-align: left;
  margin: 20px 40px;
}
.overviewWrapper,
.quickAccessWrapper {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.quickAccessWrapper {
  flex-wrap: wrap;
}
.overviewWrapper > *,
.quickAccessWrapper > * {
  width: 30%;
  height: 200px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 40px;
}

.quickAccessWrapper > * {
  cursor: pointer;
}
.card h3 {
  font-size: 30px;
  margin-top: 10px;
  margin-bottom: 30px;
}

.card p {
  font-size: 20px;
  margin: 0px;
}

.quickAddProject {
  background-color: #f95738;
}

.quickAddUser {
  background-color: #f9bf3b;
}

.quickAddAccess {
  background-color: #0d3b66;
}

.quickGrantAccess {
  background-color: #e94560;
}

a {
  text-decoration: none;
  color: white;
}
</style>
