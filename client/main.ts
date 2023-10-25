import "@/assets/main.css";
import "purecss";

import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import PrimeVue from "primevue/config";
import Image from "primevue/image";
import InputText from "primevue/inputtext";
import "primevue/resources/themes/lara-light-teal/theme.css";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { createApp } from "vue";

import Button from "primevue/button";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(PrimeVue);
app.use(router);
app.component("InputText", InputText);
app.component("Button", Button);
app.component("Image", Image);
app.component("TabView", TabView);
app.component("TabPanel", TabPanel);

app.mount("#app");
