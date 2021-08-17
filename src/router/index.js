import { createRouter, createWebHistory } from 'vue-router'
import HomeViews from './home/index'
import AppContaine from "../components/AppContainer.vue"
import AboutViews from './about/index'
import About from "../views/About.vue"

const routes = [{
        path: '/',
        name: 'Main',
        component: AppContaine,
        children: [
            HomeViews,
            AboutViews
        ]
    },
    {
        path: '/about2',
        name: 'About2',
        component: About,


    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router