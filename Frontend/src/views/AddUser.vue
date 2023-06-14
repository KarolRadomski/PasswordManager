<template>
  <div class="entriesWrapper">
    <SideBar class="sideBar" isActive="Users" />
    <div class="entries">
      <div class="title">
        <h1>Add user</h1>
      </div>
      <div class="formContainer">
        <div class="form">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username.value" placeholder="John Smith" @input="validateUsername" />
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email.value" placeholder="John123@example.com" @input="validateEmail" />
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password.value" placeholder="*********" @input="validatePassword" />

          <button type="button" :class="[username.isValid && email.isValid && password.isValid ? 'valid' : 'in-valid']" :disabled="!username.isValid || !email.isValid || !password.isValid" @click="handleAdd">Add user</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '../components/SideBar.vue';
import { mapState, mapActions } from 'pinia';
import { useUserStore } from '../stores/User';

export default {
  name: 'AddProject',
  data() {
    return {
      emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      xssRegex: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      username: {
        value: '',
        isValid: false,
      },
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    };
  },
  methods: {
    ...mapActions(useUserStore, ['createUser']),
    validateUsername() {
      this.username.isValid = this.username.value.length < 3 || this.xssRegex.test(this.username.value) ? false : true;
    },
    validateEmail() {
      this.email.isValid = this.email.value.length < 3 || this.xssRegex.test(this.email.value) || !this.emailRegex.test(this.email.value) ? false : true;
    },
    validatePassword() {
      this.password.isValid = this.password.value.length < 3 || this.xssRegex.test(this.password.value) ? false : true;
    },
    async handleAdd() {
      if (this.username.isValid && this.email.isValid && this.password.isValid) {
        const user = {
          username: this.username.value,
          email: this.email.value,
          password: this.password.value,
        };
        await this.createUser(user);
        this.$router.push('/');
      }
    },
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  created() {},
  components: {
    SideBar,
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
