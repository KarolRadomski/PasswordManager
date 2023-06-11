<template>
  <div class="projectsWrapper">
    <SideBar class="sideBar" isActive="Projects" />
    <div class="projects">
      <div class="title">
        <h1>Projects</h1>
        <p>View all projects</p>
      </div>
      <table class="projectsList">
        <thead>
          <tr>
            <th>Project name</th>
            <th style="width: 200px">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in this.projects" :key="project.id">
            <td>{{ project.name }}</td>
            <td>
              <button type="button" id="edit">Edit</button>
              <button type="button" id="manage">Manage</button>
              <button type="button" id="delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import SideBar from '../components/SideBar.vue';
import { mapState, mapActions } from 'pinia';
import { useProjectStore } from '../stores/Project';

export default {
  name: 'Projects',
  methods: {
    ...mapActions(useProjectStore, ['getAllProjects']),
  },
  computed: {
    ...mapState(useProjectStore, ['projects']),
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

#edit {
  background-color: #4caf50;
}

#edit:hover {
  background-color: #3e8e41;
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
