import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import { VBtn } from 'vuetify/components/VBtn';
import "@/assets/styles.scss";

const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    VBtn: {
    }
  }
});

export default vuetify;
