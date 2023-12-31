import "@/assets/main.css";
import "purecss";

import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import "primeicons/primeicons.css";
import Card from "primevue/card";
import PrimeVue from "primevue/config";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import Image from "primevue/image";
import InputText from "primevue/inputtext";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/lara-light-teal/theme.css";
import ScrollPanel from "primevue/scrollpanel";

import MultiSelect from "primevue/multiselect";

import Dialog from "primevue/dialog";
import SplitButton from "primevue/splitbutton";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";

import Textarea from "primevue/textarea";
import Toolbar from "primevue/toolbar";

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
app.component("Card", Card);
app.component("Textarea", Textarea);
app.component("ScrollPanel", ScrollPanel);
app.component("Divider", Divider);
app.component("Splitter", Splitter);
app.component("SplitterPanel", SplitterPanel);
app.component("Toolbar", Toolbar);
app.component("SplitButton", SplitButton);
app.component("MultiSelect", MultiSelect);
app.component("Dropdown", Dropdown);
app.component("Dialog", Dialog);

app.mount("#app");
