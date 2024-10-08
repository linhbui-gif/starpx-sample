import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/pages/Home.vue";
import Login from "@/pages/auth/Login.vue";
import {getRefreshCognitoSession} from "../hooks/useCognito.ts";

export const Paths = {
	Home: "/",
	Auth: {
		Login: "/auth/login"
	}
};

const routes = [
	{
		path: Paths.Home,
		name: 'Home',
		component: Home,
		meta: { requiresAuth: true },
	},
	{
		path: Paths.Auth.Login,
		name: 'Login',
		component: Login,
		meta: { requiresAuth: false },
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});
router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	const sessionStore = useSessionStore()
	const { JWTtokens } = storeToRefs(sessionStore)
	if (requiresAuth && !JWTtokens.value) {
		next({ name: 'Login' });
	} else {
		next();
	}
});
export default router;
declare module 'vue-router' {
	interface RouteMeta {
		authRequired?: boolean
		disallowAuthorized?: boolean
	}
}