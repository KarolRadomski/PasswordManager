<template>
  <div class="projectsWrapper">
    <SideBar class="sideBar" isActive="Projects" />
    <div class="projects">
      <div class="title">
        <h1>Add Project</h1>
        <p>Add new project</p>
      </div>
      <div class="formContainer">
        <div class="form">
          <label for="projectName">Project name</label>
          <input type="text" id="projectName" v-model="projectName.value" placeholder="Social media" @input="validateName" />
          <button type="button" :class="[projectName.isValid ? 'valid' : 'in-valid']" :disabled="!projectName.isValid" @click="handleAdd">Add project</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '../components/SideBar.vue';
import { mapState, mapActions } from 'pinia';
import { useProjectStore } from '../stores/Project';

export default {
  name: 'AddProject',
  data() {
    return {
      projectName: {
        value: '',
        isValid: false,
      },
    };
  },
  methods: {
    ...mapActions(useProjectStore, ['addProject']),
    validateName() {
      console.log(this.projectName.value);
      const xssRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
      if (this.projectName.value.length < 3 || xssRegex.test(this.projectName.value)) {
        this.projectName.isValid = false;
      } else {
        this.projectName.isValid = true;
      }
    },
    async handleAdd() {
      if (this.projectName.isValid) {
        console.log(this.projectName.value);
        await this.addProject(this.projectName.value);
        this.$router.push('/projects');
      }
    },
  },
  components: {
    SideBar,
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
.formContainer {
  margin: 20px 40px;
  padding: 80px 40px;
  background-color: #2c3e50;
  color: white;
  border-radius: 10px;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.form label {
  margin-bottom: 10px;
  font-size: 26px;
}

.form input {
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: none;
  padding: 0 10px;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.valid {
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;
  margin: 0 auto;
}

.in-valid {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;
  margin: 0 auto;
}
</style>
