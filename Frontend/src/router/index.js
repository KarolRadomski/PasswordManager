import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Projects from '../views/Projects.vue';
import AddProject from '../views/AddProject.vue';
import Entries from '../views/Entries.vue';
import AddEntry from '../views/AddEntry.vue';
import EditEntry from '../views/EditEntry.vue';
import AddUser from '../views/AddUser.vue';
import Users from '../views/Users.vue';
import Admin from '../views/Admin.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects,
  },
  {
    path: '/add-project',
    name: 'add-project',
    component: AddProject,
  },
  {
    path: '/entries',
    name: 'entries',
    component: Entries,
  },
  {
    path: '/add-entry',
    name: 'add-entry',
    component: AddEntry,
  },
  {
    path: '/edit-entry',
    name: 'edit-entry',
    component: EditEntry,
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
  },
  {
    path: '/add-user',
    name: 'add-user',
    component: AddUser,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
