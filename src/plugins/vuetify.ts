// Styles
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "dark",
    themes: {
      light: {
        colors: {
          primary: "#1976D2",
          secondary: "#424242",
          accent: "#82B1FF",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});
