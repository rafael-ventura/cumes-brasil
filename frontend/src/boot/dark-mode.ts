import { boot } from 'quasar/wrappers';
import { Dark } from 'quasar';

export default boot(({ app }) => {
  // Initialize dark mode based on user preference or system settings
  if (Dark.isActive) {
    app.config.globalProperties.$q.dark.set(true);
  } else {
    app.config.globalProperties.$q.dark.set(false);
  }
});
