import { dirname, resolve, relative } from 'node:path';
import { existsSync } from 'node:fs';
import type { Plugin } from 'vite';
import { fileSourceUrl } from '../utils/paths';

interface DemoInfo { name: string, path: string };

export function MarkdownTransform(): Plugin {
  const DEMO_CONTAINER_REG = /::: demo:([a-z0-9-\.\/]+)/ig;

  return {
    name: 'markdown-transform',
    enforce: 'pre',
    async transform(code, id) {
      const hasDemo = DEMO_CONTAINER_REG.test(code);
      if (!hasDemo) return code;

      const mdDir = dirname(id);

      const demos: DemoInfo[] = [];
      code = code.replace(DEMO_CONTAINER_REG, (match, $1) => {
        let demoRelativePath: string = $1;
        if (!demoRelativePath.endsWith('.vue')) {
          // Demo => Demo.vue
          demoRelativePath += '.vue';
        }
        const demoAbsolutePath = resolve(mdDir, demoRelativePath);

        if (!existsSync(demoAbsolutePath)) {
          return `\n::: danger Demo Not Found\n  \`${demoRelativePath}\`\n:::\n`
        }

        const demoName = demoRelativePath
          .replace(/\.vue$/, '')
          .replace(/.+\//, '')
          .replace(/^[a-z]/, (m) => m.toUpperCase())
        // import async demo component
        demos.push({ name: demoName, path: demoRelativePath });

        const source = fileSourceUrl(demoAbsolutePath);
        return `<DemoContainer source="${source}">\n  <${demoName} />\n</DemoContainer>`;
      });

      if (demos.length > 0) {
        code = getDemoDefinitions(code, demos);
      }
      return code
    },
  }
};

/**
 * get full markdown code with demo definitions
 * @param code source md code
 * @param demos demos's info in this md
 */
function getDemoDefinitions(code: string, demos: DemoInfo[]) {
  const SETUP_SCRIPT_REG = /(<script[^\>]*setup[^\>]*>)/;
  let definitionsCode = `import { defineAsyncComponent } from 'vue';\n`;
  demos.forEach(({ name, path }) => {
    definitionsCode += `const ${name} = defineAsyncComponent(() => import('./${path}'));\n`;
  });
  if (SETUP_SCRIPT_REG.test(code)) {
    return code.replace(SETUP_SCRIPT_REG, `$1\n${definitionsCode}`);
  }
  return `<script lang="ts" setup>\n${definitionsCode}</script>\n\n${code}`;
}
