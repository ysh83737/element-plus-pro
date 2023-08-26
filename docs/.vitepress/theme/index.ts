import DefaultTheme from 'vitepress/theme';
import type { Theme} from 'vitepress';
import './tailwind.scss';
import DemoContainer from '../components/DemoContainer.vue';

export default <Theme>{
  extends: DefaultTheme,
  enhanceApp({ app }): void {
    app.component(DemoContainer.name, DemoContainer);
  },
};
