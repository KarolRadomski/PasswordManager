<template>
  <div class="projectsWrapper">
    <SideBar class="sideBar" isActive="Projects" />
    <div class="projects">
      <div class="title">
        <h1>Projects</h1>
        <p>View all projects</p>
      </div>
      <div class="nav" v-if="this.projects?.length > 0">
        <button type="button" id="addProject" @click="this.$router.push('/add-project')">Add project</button>
      </div>
      <table class="projectsList" v-if="this.projects?.length > 0">
        <thead>
          <tr>
            <th>Project name</th>
            <th style="width: 150px">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in this.projects" :key="project.id">
            <td>{{ project.name }}</td>
            <td class="d-flex">
              <button
                type="button"
                id="manage"
                @click="
                  () => {
                    this.selectProject(project.id);
                    this.$router.push('/entries');
                  }
                "
              >
                Manage
              </button>
              <button
                @click="
                  () => {
                    this.toRemove.id = project.id;
                    this.toRemove.name = project.name;
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

      <div class="noProjects" v-else>
        <h1>No projects yet</h1>
        <p>Click on the button below to add a new project</p>
        <button type="button" id="addProject" @click="this.$router.push('/add-project')">Add project</button>
      </div>
    </div>

    <!-- Modal remove project -->

    <!-- Button trigger modal -->

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Remove project</h1>
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
    };
  },
  methods: {
    ...mapActions(useAdminStore, ['getAllProjects', 'removeProject', 'selectProject']),
    handleRemove() {
      this.removeProject(this.toRemove.name, this.toRemove.id);
    },
  },
  computed: {
    ...mapState(useAdminStore, ['projects']),
  },
  components: {
    SideBar,
  },
  created() {
    this.getAllProjects();
  },
};
</script>

<style scoped>
.projectsWrapper {
  display: flex;
}

.projects {
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
  justify-content: flex-end;
}

.nav button,
.noProjects button {
  margin: 0 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  background-color: #2196f3;
  cursor: pointer;
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
  text-align: left;
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
