<template>
  <div class="entriesWrapper">
    <SideBar class="sideBar" isActive="Projects" />
    <div class="entries">
      <div class="title">
        <h1>Edit entry</h1>
        <p>
          Edit entry <b>{{ this.selectedEntry.name }}</b>
        </p>
      </div>
      <div class="formContainer">
        <div class="form">
          <label for="entryName">Entry name</label>
          <input type="text" id="entryName" v-model="entryName.value" placeholder="Facebook" @input="validateName" />
          <label for="entryURL">URL (optional)</label>
          <input type="text" id="entryURL" v-model="entryURL.value" placeholder="John123@example.com" @input="validateURL" />
          <label for="entryUsername">Username/email</label>
          <input type="text" id="entryUsername" v-model="entryUsername.value" placeholder="John123@example.com" @input="validateUsername" />
          <label for="entryPassword">Password</label>
          <input type="password" id="entryPassword" v-model="entryPassword.value" placeholder="*********" @input="validatePassword" />
          <label for="entryAccess">Grant Access</label>
          <VueMultiselect v-model="selected" class="mb-5" :options="options" :multiple="true" :close-on-select="false" placeholder="Pick users" label="name" track-by="name" />

          <button
            type="button"
            :class="[entryName.isValid && entryUsername.isValid && entryURL.isValid && entryPassword.isValid ? 'valid' : 'in-valid']"
            :disabled="!entryName.isValid || !entryUsername.isValid || !entryURL.isValid || !entryPassword.isValid"
            @click="handleEdit"
          >
            Edit entry
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '../components/SideBar.vue';
import { mapState, mapActions } from 'pinia';
import { useAdminStore } from '../stores/Admin';
import VueMultiselect from 'vue-multiselect';

export default {
  name: 'AddProject',
  data() {
    return {
      selected: [],
      options: [],
      xssRegex: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      entryName: {
        value: '',
        isValid: false,
      },
      entryURL: {
        value: '',
        isValid: true,
      },
      entryUsername: {
        value: '',
        isValid: false,
      },
      entryPassword: {
        value: '',
        isValid: false,
      },
    };
  },
  methods: {
    ...mapActions(useAdminStore, ['addEntry', 'getAllUsers', 'updateEntry']),
    validateName() {
      this.entryName.isValid = this.entryName.value.length < 3 || this.xssRegex.test(this.entryName.value) ? false : true;
    },
    validateURL() {
      this.entryURL.isValid = this.xssRegex.test(this.entryURL.value) ? false : true;
    },
    validateUsername() {
      this.entryUsername.isValid = this.entryUsername.value.length < 3 || this.xssRegex.test(this.entryUsername.value) ? false : true;
    },
    validatePassword() {
      this.entryPassword.isValid = this.entryPassword.value.length < 3 || this.xssRegex.test(this.entryPassword.value) ? false : true;
    },
    async handleEdit() {
      if (this.entryName.isValid && this.entryUsername.isValid && this.entryURL.isValid && this.entryPassword.isValid) {
        console.log(this.entryName.value);
        const entry = {
          name: this.entryName.value,
          url: this.entryURL.value,
          username: this.entryUsername.value,
          password: this.entryPassword.value,
        };
        await this.updateEntry(this.selectedEntry.id, entry, this.selected);
        this.$router.push('/entries');
      }
    },
  },
  computed: {
    ...mapState(useAdminStore, ['selectedEntry', 'selectedEntryAccesses', 'users']),
  },
  created() {
    if (this.selectedEntry == '' || this.selectedEntry.id === '') {
      // this.$router.push('/projects');
      window.location = '/projects';
    } else {
      this.entryName.value = this.selectedEntry.name;
      this.entryURL.value = this.selectedEntry.url;
      this.entryUsername.value = this.selectedEntry.login;
      this.entryPassword.value = this.selectedEntry.password;

      this.validateName();
      this.validateURL();
      this.validateUsername();
      this.validatePassword();

      this.getAllUsers();
      this.selected = this.selectedEntryAccesses;
      this.users.forEach((user) => {
        this.options.push({ name: user.name, id: user.id });
      });
    }
  },

  components: {
    SideBar,
    VueMultiselect,
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
