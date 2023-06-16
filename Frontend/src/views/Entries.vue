<template>
  <div class="entriesWrapper">
    <SideBar class="sideBar" isActive="Projects" />
    <div class="entries">
      <div class="title">
        <h1>Entries</h1>
        <p>
          View all Entries for <b>{{ this.selectedProject.name }}</b>
        </p>
      </div>
      <div class="nav" v-if="this.entries?.length > 0">
        <div class="showPassIcons">
          <button v-if="showPassword" @click="showPassword = !showPassword"><i class="bi bi-eye-slash-fill"></i> Hide passwords</button>
          <button v-else @click="showPassword = !showPassword"><i class="bi bi-eye-fill"></i> Show passwords</button>
        </div>
        <button type="button" id="addProject" @click="this.$router.push('/add-entry')">Add entries</button>
      </div>
      <table class="projectsList" v-if="this.entries?.length > 0">
        <thead>
          <tr>
            <th>Entry name</th>
            <th>Login</th>
            <th>Password</th>
            <th>URL</th>
            <th style="width: 150px">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in this.entries" :key="entry.id">
            <td>{{ entry.name }}</td>
            <td>{{ entry.login }}</td>

            <td v-if="showPassword">
              <span>{{ entry.password }}</span>
            </td>
            <td v-else><span>********</span></td>
            <td v-if="entry.url !== ''">{{ entry.url }}</td>
            <td v-else>-</td>
            <td class="d-flex">
              <button
                type="button"
                id="manage"
                @click="
                  () => {
                    selectEntry(entry.id);
                    this.$router.push('/edit-entry');
                  }
                "
              >
                Manage
              </button>
              <button
                @click="
                  () => {
                    this.toRemove.id = entry.id;
                    this.toRemove.name = entry.name;
                  }
                "
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                id="delete"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="noEntries" v-else>
        <h1>No entries yet</h1>
        <p>Click on the button below to add a new entry</p>
        <button type="button" id="addProject" @click="this.$router.push('/add-entry')">Add entry</button>
      </div>
    </div>

    <!-- Modal remove project -->

    <!-- Button trigger modal -->

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Remove entry</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to remove <b>{{ this.toRemove.name }}</b
            >?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" @click="() => handleRemove()" data-bs-dismiss="modal">Remove it</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '../components/SideBar.vue';
import { mapState, mapActions } from 'pinia';
import { useAdminStore } from '../stores/Admin';

export default {
  name: 'Projects',
  data() {
    return {
      toRemove: {
        id: '',
        name: '',
      },
      showPassword: false,
    };
  },
  methods: {
    ...mapActions(useAdminStore, ['getAllProjectEntries', 'removeEntry', 'selectEntry']),
    handleRemove() {
      this.removeEntry(this.toRemove.name, this.toRemove.id);
    },
  },
  computed: {
    ...mapState(useAdminStore, ['selectedProject', 'entries']),
  },
  components: {
    SideBar,
  },
  created() {
    this.getAllProjectEntries();
    if (this.selectedProject == '' || this.selectedProject.id === '') {
      this.$router.push('/projects');
    }
  },
};
</script>

<style scoped>
.entriesWrapper {
  display: flex;
}

.entries {
  width: 80%;
  margin-left: 20%;
}

.sideBar {
  position: fixed;
  width: 20%;
  height: 100vh;
}

.title {
  text-align: left;
  margin: 20px 40px;
}

.nav {
  display: flex;
  width: 90%;
  margin: 20px 40px;
  justify-content: space-between;
}
.nav button,
.noEntries button {
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  background-color: #2196f3;
  cursor: pointer;
}
.showPassIcons {
  display: flex;
  align-items: center;
}
.showPassIcons > button {
  display: flex;
  align-items: center;
  background-color: #213341;
}
.showPassIcons i {
  font-size: 28px;
  cursor: pointer;
  margin: 0 5px;
  padding: 0;
}

.projectsList {
  width: 90%;
  margin: 20px 40px;
  border-collapse: collapse;
  border: 1px solid rgb(185, 185, 185);
}

.projectsList th,
.projectsList td {
  padding: 15px;
  text-align: center;
}

.projectsList tr:nth-child(even) {
  background-color: #f2f2f2;
}

.projectsList th {
  background-color: #4caf50;
  color: white;
}

.projectsList button {
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  color: white;
}

#manage {
  background-color: #2196f3;
}

#manage:hover {
  background-color: #0b7dda;
}

#delete {
  background-color: #f44336;
}

#delete:hover {
  background-color: #da190b;
}
</style>
