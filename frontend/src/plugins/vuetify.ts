import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import { VBtn } from 'vuetify/components';
import "@/assets/styles.scss";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi"
  },
  theme: {
    defaultTheme: "dark"
  },
  defaults: {
    VBtn: {
      style: 'height: 30px; background-color: #216230; color: #3c3425;',
      class: 'btn'
    }
  }
});

export default vuetify;
