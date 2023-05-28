const fs = require('node:fs');
const path = require('node:path');

const terser = require('terser');
const css = require('clean-css');

async function handleJS(files) {
    const src = fs.readdirSync(files.js)
        .filter(filename => filename.endsWith('.js'))
        .map(filename => path.join(files.js, filename));

    for (let file of src) {
        const content = fs.readFileSync(file, 'utf-8');
        await terser.minify(content).then(({ code }) => {
            if (!fs.existsSync(files.js.replace(files.src, files.dest))) {
                fs.mkdirSync(files.js.replace(files.src, files.dest));
            }
            fs.writeFileSync(
                file.replace(files.src, files.dest),
                code, 'utf-8'
            );
        });
    }
}

function handleCSS(files) {
    const src = fs.readdirSync(files.css)
        .filter(filename => filename.endsWith('.css'))
        .map(filename => path.join(files.css, filename));

    for (let file of src) {
        const content = fs.readFileSync(file, 'utf-8');

        const { styles } = new css({}).minify(content);

        if (!fs.existsSync(files.css.replace(files.src, files.dest))) {
            fs.mkdirSync(files.css.replace(files.src, files.dest));
        }
        fs.writeFileSync(
            file.replace(files.src, files.dest),
            styles, 'utf-8'
        );
    }
}

function injectGA(files, template) {
    const ga_reg = new RegExp(/\{\{GA-HEAD\}\}/gm);
    template = template.replaceAll(ga_reg, fs.readFileSync(files.google.ga.head));

    const ga_key_reg = new RegExp(/\{\{GA-KEY\}\}/gm);
    template = template.replaceAll(ga_key_reg, process.env.GA_KEY);

    return template;
}

function injectGTM(files, template) {
    const gtm_head_reg = new RegExp(/\{\{GTM-HEAD\}\}/gm);
    template = template.replaceAll(gtm_head_reg, fs.readFileSync(files.google.gtm.head));

    const gtm_body_reg = new RegExp(/\{\{GTM-BODY\}\}/gm);
    template = template.replaceAll(gtm_body_reg, fs.readFileSync(files.google.gtm.body));

    const gtm_key_reg = new RegExp(/\{\{GTM-KEY\}\}/gm);
    template = template.replaceAll(gtm_key_reg, process.env.GTM_KEY);

    return template;
}

function cleanGA(template) {
    const ga_reg = new RegExp(/\{\{GA-HEAD\}\}/gm);
    template = template.replaceAll(ga_reg, '');

    return template;
}

function cleanGTM(template) {
    const gtm_head_reg = new RegExp(/\{\{GTM-HEAD\}\}/gm);
    template = template.replaceAll(gtm_head_reg, '');

    const gtm_body_reg = new RegExp(/\{\{GTM-BODY\}\}/gm);
    template = template.replaceAll(gtm_body_reg, '');

    return template;
}

function moveIndex(files) {
    let html = fs.readFileSync(files.index, 'utf-8');

    if (process.env.GA_KEY && process.env.GTM_KEY) {
        html = injectGA(files, html);
        html = injectGTM(files, html);
    } else {
        html = cleanGA(html);
        html = cleanGTM(html);
    }

    fs.writeFileSync(
        files.index.replace(files.src, files.dest).replace('template', 'html'),
        html, 'utf-8'
    );
}

function copyAssets(files) {
    fs.cpSync(
        files.assets,
        files.assets.replace(files.src, files.dest),
        { recursive: true }
    );
}

const build = (async (files) => {
    if (!fs.existsSync(files.dest)) {
        fs.mkdirSync(files.dest);
    }

    await handleJS(files);
    handleCSS(files);
    moveIndex(files);
    copyAssets(files);
});

build({
    src: 'src',
    dest: 'dist',
    js: './src/scripts',
    css: './src/styles',
    assets: './src/assets',
    index: './src/index.template',
    google: {
        ga: { head: './src/google/ga_head.template' },
        gtm: {
            head: './src/google/gtm_head.template',
            body: './src/google/gtm_body.template'
        }
    }
});
