/**
 * Build script - transforms JSON data into HTML
 * Run: npm run build
 */

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { execSync } = require('child_process');

/**
 * Load data from JSON files
 */
function loadData() {
  const modules = JSON.parse(fs.readFileSync('data/modules.json', 'utf8'));
  const blocks = JSON.parse(fs.readFileSync('data/blocks.json', 'utf8'));
  const ctas = JSON.parse(fs.readFileSync('data/ctas.json', 'utf8'));

  return { modules, blocks, ctas };
}

/**
 * Transform relational data into nested structure
 */
function transformData(modules, blocks, ctas) {
  return modules
    .filter(module => module.active)
    .sort((a, b) => a.order - b.order)
    .map(module => {
      // Find all blocks for this module
      const moduleBlocks = blocks
        .filter(block => block.module_id === module.module_id)
        .sort((a, b) => a.order - b.order)
        .map(block => {
          // Find all CTAs for this block
          const blockCTAs = ctas
            .filter(cta => cta.block_id === block.block_id)
            .sort((a, b) => a.order - b.order);

          // Parse slideshow images
          const slideshowImages = block.slideshow_images
            ? block.slideshow_images.split(',').map(s => s.trim()).filter(s => s)
            : [];

          return {
            ...block,
            ctas: blockCTAs,
            slideshow_images: slideshowImages,
            has_slideshow: slideshowImages.length > 0,
            has_zoom: block.hover_effect === 'zoom'
          };
        });

      return {
        ...module,
        blocks: moduleBlocks
      };
    });
}

/**
 * Register Handlebars helpers
 */
function registerHelpers() {
  // JSON stringify helper
  Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
  });

  // Equality helper
  Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });

  // Conditional helper
  Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a === b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });
}

/**
 * Register partials
 */
function registerPartials() {
  const partialsDir = path.join(__dirname, '../templates/partials');

  if (fs.existsSync(partialsDir)) {
    const partialFiles = fs.readdirSync(partialsDir);

    partialFiles.forEach(filename => {
      const matches = /^(.+)\.hbs$/.exec(filename);
      if (!matches) return;

      const name = matches[1];
      const template = fs.readFileSync(path.join(partialsDir, filename), 'utf8');
      Handlebars.registerPartial(name, template);
    });
  }
}

/**
 * Build HTML
 */
function buildHTML(data) {
  // Load templates
  const layoutTemplate = fs.readFileSync('src/templates/layout.hbs', 'utf8');
  const moduleTemplate = fs.readFileSync('src/templates/module.hbs', 'utf8');

  // Register module template as partial
  Handlebars.registerPartial('module', moduleTemplate);

  // Compile layout
  const template = Handlebars.compile(layoutTemplate);

  // Generate HTML
  const html = template({ modules: data });

  return html;
}

/**
 * Build CSS
 */
function buildCSS() {
  console.log('Compiling SCSS...');
  try {
    execSync('npm run build:css', { stdio: 'inherit' });
    console.log('✓ CSS compiled');
  } catch (error) {
    console.error('Error compiling CSS:', error.message);
  }
}

/**
 * Copy static files
 */
function copyStaticFiles() {
  // Copy JavaScript
  const jsSource = 'src/scripts/slideshow.js';
  const jsDest = 'dist/slideshow.js';

  if (fs.existsSync(jsSource)) {
    fs.copyFileSync(jsSource, jsDest);
    console.log('✓ Copied slideshow.js');
  }
}

/**
 * Main function
 */
function main() {
  try {
    console.log('Building landing page...\n');

    // Load data
    console.log('Loading data...');
    const { modules, blocks, ctas } = loadData();
    console.log(`✓ Loaded ${modules.length} modules, ${blocks.length} blocks, ${ctas.length} CTAs`);

    // Transform data
    console.log('Transforming data...');
    const transformedData = transformData(modules, blocks, ctas);
    console.log(`✓ Processed ${transformedData.length} active modules`);

    // Register Handlebars helpers and partials
    registerHelpers();
    registerPartials();

    // Build HTML
    console.log('Generating HTML...');
    const html = buildHTML(transformedData);
    fs.writeFileSync('dist/index.html', html);
    console.log('✓ Generated dist/index.html');

    // Build CSS
    buildCSS();

    // Copy static files
    copyStaticFiles();

    console.log('\n✅ Build complete!');
    console.log('\nRun "npm run dev" to preview locally at http://localhost:8080');

  } catch (error) {
    console.error('Build error:', error.message);
    console.error(error.stack);
  }
}

main();
