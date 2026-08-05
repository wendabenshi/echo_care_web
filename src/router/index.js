import { createRouter, createWebHistory } from "vue-router";
import HeroPage from "../components/HeroPage.vue";
import {
  getLegacyToken,
  hasAuthorizedSession,
  setLegacyToken,
} from "../utils/authSession.js";

const isDev = import.meta.env.DEV;
const publicPaths = new Set(["/login", "/ring", "/r"]);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HeroPage },
    {
      path: "/draw/love-energy",
      name: "love-energy",
      component: () => import("../pages/LoveEnergyPage.vue"),
    },
    {
      path: "/draw/daily-card",
      name: "daily-card",
      component: () => import("../pages/DailyCardPage.vue"),
    },
    {
      path: "/draw/single-card",
      name: "single-card",
      redirect: (to) => {
        if (to.query.mode === "daily") {
          return { path: "/draw/daily-card" };
        }
        return { path: "/draw/daily-card" };
      },
    },
    {
      path: "/ring",
      name: "ring-entry",
      component: () => import("../pages/RingEntryPage.vue"),
    },
    {
      path: "/r",
      name: "ring-entry-short",
      component: () => import("../pages/RingEntryPage.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../pages/login.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const queryToken = to.query.token ? to.query.token : "000000";
  const localToken = getLegacyToken();

  if (isDev) {
    next();
  } else if (publicPaths.has(to.path)) {
    next();
  } else if (hasAuthorizedSession()) {
    next();
  } else if (to.path === "/" && queryToken !== "000000") {
    const { default: supabase } = await import("../supabase/index.js");

    supabase
      .from("page_tokens")
      .select("*")
      .eq("token", queryToken)
      .then(({ data, error }) => {
        if (error || !data || data.length == 0) {
          next("/login");
        } else {
          setLegacyToken(queryToken);
          next({ path: "/" });
        }
      });
  } else if (localToken) {
    next();
  } else {
    next("/login");
  }
});

export default router;
