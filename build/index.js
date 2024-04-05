import fs from 'fs'
import path from 'path';
import { build } from 'esbuild';
import { lessLoader } from 'esbuild-plugin-less';
import less from 'less'

async function compileLess(inputFile, outputFile) {
  const lessCode = fs.readFileSync(inputFile, 'utf8');
  const { css } = await less.render(lessCode);
  const outputDir = path.dirname(outputFile);
  fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(outputFile, css, 'utf8');
}

async function bundle() {
  build({
    entryPoints: ['./src/index.js'],
    bundle: true,
    format: 'esm',
    plugins: [lessLoader()],
    outdir: 'dist',
  }).then(() => {
    for (let path of ['index', 'edit', 'footer', 'preview']) {
      compileLess(`./src/style/${path}.less`, `dist/style/${path}.css`);
    }
  })
  .catch(() => process.exit(1))
}

bundle().catch((e) => console.error(e));