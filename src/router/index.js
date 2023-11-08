import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },    
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/agent',
      name: 'agent',
      component: () => import('../views/AgentView.vue')
    },
    {
      path: '/waypoints',
      name: 'waypoints',
      component: () => import('../views/WaypointView.vue')
    },
    {
      path: '/contracts',
      name: 'contracts',
      component: () => import('../views/ContractsView.vue')
    },
    {
      path: '/systems',
      name: 'systems',
      component: () => import('../views/SystemView.vue')
    },
    {
      path: '/systems/:sid',
      name: 'detailedsystem',
      props: true,
      component: () => import('../views/SystemView.vue')
    },
    {
      path: '/systems/:sid/:wid',
      name: 'detailedwaypoint',
      props: true,
      component: () => import('../views/SystemView.vue')
    },
    {
      path: '/shipyard/:id',
      name: 'shipyard',
      props: true,
      component: () => import('../views/ShipyardView.vue')
    },
    {
      path: '/marketplace/:id',
      name: 'marketplace',
      props: true,
      component: () => import('../views/MarketView.vue')
    },
    {
      path: '/ships',
      name: 'ships',
      component: () => import('../views/ShipsView.vue')
    },
    {
      path: '/ships/:id',
      name: 'detailedship',
      props: true,
      component: () => import('../views/DetailedShipView.vue')
    }
  ]
})

export default router
