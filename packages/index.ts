import type { App } from 'vue';
import { version } from './package.json';

import ElpLineClampText from './line-clamp-text';
export * from './line-clamp-text';

const components = [
  ElpLineClampText,
];

export function install(app: App) {
  components.forEach((c) => app.use(c));
}

export default {
  install,
  version,
};
