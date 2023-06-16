<template>
  <div class="homeWrapper">
    <SideBar class="sideBar" isActive="Dashboard" />
    <div class="home">
      <div class="title">
        <h1>Yours passwords</h1>
      </div>

      <div class="entrisAndAccesses" v-if="selectedProject?.entries?.length() > 0">
        <div class="entries">
          <h3>Yours entries</h3>
          <div
            class="entry"
            v-for="entry in selectedProject.entries"
            :key="entry.id"
            :class="[selectedEntry.id == entry.id ? 'active' : '']"
            @click="
              () => {
                selectedEntry = entry;
              }
            "
          >
            {{ entry.name }}
          </div>
        </div>
        <div class="passwords">
          <div class="d-flex justify-content-between">
            <h3>
              <b>{{ selectedEntry.name }}</b>
            </h3>
            <div class="showPassIcons">
              <button v-if="showPassword" @click="showPassword = !showPassword"><i class="bi bi-eye-slash-fill"></i> Hide passwords</button>
              <button v-else @click="showPassword = !showPassword"><i class="bi bi-eye-fill"></i> Show passwords</button>
            </div>
          </div>
          <div class="password">
            <label for="login">Login</label>
            <input type="text" id="login" v-model="selectedEntry.login" readonly />

            <label for="password">Password</label>
            <input v-if="showPassword" type="text" id="password" v-model="selectedEntry.password" readonly />
            <input v-else type="text" id="password" value="*********" readonly />

            <label for="url">URL</label>
            <input type="text" id="url" v-model="selectedEntry.url" readonly />
          </div>
        </div>
      </div>
      <div v-else>
        <h3>You don't have any entries</h3>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '../components/SideBar.vue';
import { useUserStore } from '../stores/User';
import { useUsersStore } from '../stores/Users';
import { mapState, mapWritableState, mapActions } from 'pinia';

export default {
  name: 'Home',
  data() {
    return {
      showPassword: false,
    };
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    ...mapState(useUsersStore, ['selectedProject']),
    ...mapWritableState(useUsersStore, ['selectedEntry']),
  },
  created() {
    if (!this.user?.id) {
      this.$router.push('/login');
    }
    if (this.user?.admin) {
      this.$router.push('/admin');
    } else {
      this.$router.push('/');
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
  background-color: #f0f0f0;
  height: 100vh;
}

.home {
  width: 80%;
  margin-left: 20%;
  height: 100%;
}
.sideBar {
  position: fixed;
  width: 20%;
  height: 100vh;
}
.title {
  text-align: left;
  padding: 20px 40px;
  height: 10%;
}
.entrisAndAccesses {
  display: flex;
  height: 90%;
}

.entries,
.passwords {
  width: 30%;
  height: calc(100% - 20px);
  padding: 20px;
  margin: 0 20px;
  text-align: start;
  box-shadow: 0 2.5rem 2rem -2rem hsl(200 50% 20% / 40%);
  background: hsl(0 0% 100%);
  padding: 3ch;
  border-radius: 1ch;
}
.passwords {
  width: 70%;
  margin-left: 10px;
}

.entry {
  margin-bottom: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: 0.3s;
  font-weight: 600;
}

.entry:hover {
  background-color: #e0e0e0;
}
.entry.active {
  background-color: #3498db;
  color: white;
}

.password {
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  height: 100%;
}

label {
  margin-bottom: 10px;
  font-weight: 500;
}
input {
  margin-bottom: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #f0f0f0;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  transition: 0.3s;
}
a {
  text-decoration: none;
  color: white;
}
h3 {
  margin-bottom: 40px;
  font-weight: 500;
}
.showPassIcons {
  display: flex;
  align-items: center;
}
.showPassIcons > button {
  display: flex;
  align-items: center;
  background-color: #213341;
  color: white;
}
.showPassIcons i {
  font-size: 28px;
  cursor: pointer;
  margin: 0 5px;
  padding: 0;
}
</style>
