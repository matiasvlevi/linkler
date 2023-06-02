const fs = require('node:fs');
const path = require('node:path');

const terser = require('terser');
const css = require('clean-css');

function injectGA(files, template) {
    template = template.replaceAll(/\{\{GA-HEAD\}\}/gm, fs.readFileSync(files.google.ga.head));
    template = template.replaceAll(/\{\{GA-KEY\}\}/gm, process.env.GA_KEY);

    return template;
}

function injectGTM(files, template) {
    template = template.replaceAll(/\{\{GTM-HEAD\}\}/gm, fs.readFileSync(files.google.gtm.head));
    template = template.replaceAll(/\{\{GTM-BODY\}\}/gm, fs.readFileSync(files.google.gtm.body));
    template = template.replaceAll(/\{\{GTM-KEY\}\}/gm, process.env.GTM_KEY);

    return template;
}

function cleanGA(template) {
    template = template.replaceAll(/\{\{GA-HEAD\}\}/gm, '');

    return template;
}

function cleanGTM(template) {
    template = template.replaceAll(/\{\{GTM-HEAD\}\}/gm, '');
    template = template.replaceAll(/\{\{GTM-BODY\}\}/gm, '');

    return template;
}

async function handleJS(files) {
    const src = fs.readdirSync(files.js)
        .filter(filename => filename.endsWith('.js'))
        .map(filename => path.join(files.js, filename));

    for (let file of src) {
        const content = fs.readFileSync(file, 'utf-8');
        await terser.minify(content).then(({ code }) => {

            if (!fs.existsSync(files.js.replace(files.src, path.join(files.dest, 'public')))) {
                fs.mkdirSync(files.js.replace(files.src, path.join(files.dest, 'public')));
            }

            fs.writeFileSync(
                file.replace(files.src, path.join(files.dest, 'public')),
                code, 'utf-8'
            );
        });
    }
}

function handleCSS(files) {
    let themeFile = `${files.config.theme}.css`;
    let themePath = path.join(files.themes, themeFile);

    if (!fs.existsSync(themePath)) {
        themeFile = 'classic.css';
        themePath = path.join(files.themes, themeFile);
    }

    const content = fs.readFileSync(themePath, 'utf-8');

    const { styles } = new css({}).minify(content);

    if (!fs.existsSync(files.css.replace(files.src, path.join(files.dest, 'public')))) {
        fs.mkdirSync(files.css.replace(files.src, path.join(files.dest, 'public')));
    }
    fs.writeFileSync(
        path.join(files.css.replace(files.src, path.join(files.dest, 'public')), 'style.css'),
        styles, 'utf-8'
    );
    
}



function moveTemplates(files) {
    let html = fs.readFileSync(files.index, 'utf-8');
    
    // Fill GA Template
    if (process.env.GA_KEY.length === 0) {
        html = cleanGA(html);
    } else {
        html = injectGA(files, html);
    }

    // Fill GTM Template
    if (process.env.GTM_KEY.length === 0) {
        html = cleanGTM(html);
    } else {
        html = injectGTM(files, html);
    }

    fs.writeFileSync(
        files.index.replace(files.src, files.dest).replace('template', 'html'),
        html, 'utf-8'
    );

    let error = fs.readFileSync(files.error, 'utf-8');
    fs.writeFileSync(
        files.error.replace(files.src, files.dest).replace('template', 'html'),
        error, 'utf-8'
    );
}

function copyAssets(files) {
    fs.cpSync(
        files.assets,
        files.assets.replace(files.src, path.join(files.dest, 'public')),
        { recursive: true }
    );
}

const build = (async (files) => {
    if (!fs.existsSync(files.dest)) {
        fs.mkdirSync(files.dest);
    }

    if (!fs.existsSync(path.join(files.dest, 'public'))) {
        fs.mkdirSync(path.join(files.dest, 'public'));
    }

    await handleJS(files);
    handleCSS(files);
    moveTemplates(files);
    copyAssets(files);
});

build({
    config: require('../.linklerrc.js'),
    src: "src",
    dest: "dist",
    themes: "./themes",
    css:  "./src/styles",
    js: "./src/scripts",
    assets: "./src/assets",
    index: "./src/page.template",
    error: "./src/error.template",
    public: "./dist/public",
    google: {
        ga: { 
            head: "./src/google/ga_head.template"
        },
        gtm: {
            head: "./src/google/gtm_head.template",
            body: "./src/google/gtm_body.template"
        }
    }
});
