import Vue from 'vue'
import Router from 'vue-router'

import HomePage from '../views/HomePage.vue'
import Schedule from '../views/Schedule.vue'
import Dashboard from '../views/Dashboard.vue'
import LiveClass from '../views/LiveClass.vue'
import StartClass from '../views/StartClass.vue'
import AttendClass from '../views/AttendClass.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: HomePage
      // meta: {loginVisible:false}
    },
    {
      path: '/login',
      component: HomePage
      // meta: {loginVisible:true}
    },
    {
      path: '/schedule',
      component: Schedule
    },
    {
      path: '/dashboard',
      component: Dashboard,
      children:[
        {
          path: '',
          component:StartClass
        },
        {
          path: 'class',
          component:LiveClass
          
        },
        {
          path: 'attend',
          component:AttendClass
          
        }
      ]
    }

  ]
})
