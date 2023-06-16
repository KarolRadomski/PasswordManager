<template>
  <div class="limiter">
    <img class="bgImg" src="../assets/Serwerownia.png" alt="serwerownia" />
    <div class="container">
      <h1>Account Login</h1>
      <div class="formContainer">
        <input type="email" v-model="form.email.value" :state="validateEmail" id="email" placeholder="E-mail" class="form-control" :class="validateEmail" />

        <input type="password" v-model="form.password.value" id="password" placeholder="Password" class="form-control" />
        <div class="error" v-if="userError || validationError">{{ userError }} {{ validationError }}</div>
        <button @click="handleLogin" class="loginButton">Zaloguj się</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useUserStore } from '../stores/User';

export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        email: {
          value: '',
          valid: null,
        },
        password: {
          value: '',
          valid: null,
        },
      },
      validationError: '',
    };
  },
  methods: {
    ...mapActions(useUserStore, ['login']),
    async handleLogin() {
      this.validationError = '';
      if (this.form.email.valid && this.form.password.value.length !== 0) {
        await this.login(this.form.email.value, this.form.password.value);
        if (!this.userError) {
          if (this.user?.admin) {
            this.$router.push('/admin');
          } else {
            this.$router.push('/');
          }
        }
      } else {
        this.validationError = 'Uzupełnij wszystkie pola';
      }
    },
    saveStateChange(formCopy) {
      this.form.email = formCopy;
      return this.form.email.valid;
    },
  },
  computed: {
    ...mapState(useUserStore, ['user', 'userError']),
    validateEmail() {
      const formCopy = this.form.email;
      var validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (formCopy.value.length > 0 && formCopy.value.match(validRegex)) {
        formCopy.valid = true;
      } else if (formCopy.value.length === 0) {
        formCopy.valid = null;
      } else {
        formCopy.valid = false;
      }
      switch (this.saveStateChange(formCopy)) {
        case true:
          return 'is-valid';
        case null:
          return '';

        case false:
          return 'is-invalid';
      }
    },
  },
  created() {
    if (localStorage.getItem('user')) {
      this.$router.push('/');
    }
  },
};
</script>

<style scoped>
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  color: white;
  padding: 40px;

  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}
.bgImg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  filter: brightness(0.3);
  object-fit: cover;
}
.formContainer {
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: 0 auto;
}

h1 {
  margin: 10px;
  margin-top: 0px;
}

input {
  background-color: transparent;
  color: white;
  border: none;
  border-bottom: 2px solid white;
  height: 40px;
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
}

input:focus {
  outline: none;
}
input:focus::placeholder {
  opacity: 0;
}

input::placeholder {
  color: rgb(189, 189, 189);
  font-size: 20px;
  text-align: center;
}

button {
  background-color: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 20px;
  height: 40px;
  font-size: 20px;
  margin-top: 20px;
  cursor: pointer;
}
button:hover {
  background-color: white;
  color: black;
}
/* tablet */
@media screen and (min-width: 767px) and (max-width: 1023px) {
  .container {
    width: 100%;
    background: rgba(255, 255, 255, 0.2);
  }
}

/* mobile */
@media screen and (max-width: 767px) {
  .container {
    width: 100%;
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>
