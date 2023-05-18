const url = 'http://10.0.0.77:1337';

function renderIcon({ Icon }) {
    const icon = document.createElement('img');
    icon.classList.add('link-icon');

    icon.setAttribute('src', `${url}${Icon.data.attributes.url}`);

    return icon;
}

function renderText(tag, className, content) {
    const txt = document.createElement(tag);
    txt.classList.add(className);

    txt.textContent = content || '';

    return txt;
}

function renderLink({ id, attributes }) {

    const link = document.createElement('div');
    link.classList.add('link-wrapper');
    link.setAttribute('id', id);

    // Render Icon
    link.appendChild(renderIcon(attributes));   

    // Render Text
    const meta = document.createElement('div');
    meta.classList.add('meta-wrapper');
    meta.appendChild(renderText('h2', 'link-title', attributes['Title']));
    meta.appendChild(renderText('p', 'link-description', attributes['Description']));
    link.appendChild(meta);

    if (attributes.Document.data) {
        attributes.url = `${url}${attributes.Document.data.attributes.url}`;
        link.setAttribute('download', true);
    } 
    
    // Set clickable and href
    link.setAttribute('onclick', `location.href='${attributes.url}';`);

    link.style.cursor = 'pointer';
    
    return link;
}

function render({ data }) {
    const container = document.querySelector('main');

    // Render all links
    for (const link of data) {
        container.appendChild(
            renderLink(link)
        );
    }
}

function typewriter(element, text, speed = 30, i = 0) {
    function typeNextCharacter() {
        element.textContent += text[i];
        i++;

        if (i < text.length) {
            setTimeout(
                typeNextCharacter,
                speed + Math.random() * (speed / 2)
            );
        } else {
            element.classList.remove('typewriter');
        }
    }

    setTimeout(typeNextCharacter, speed);
}

// Entrypoint
async function main() {
    // Render meta data
    fetch(`${url}/api/meta`)
        .then((res) => res.json())
        .then((meta) => {
            // Set page title
            document.title += ` ${meta.data.attributes.Name}`;
            
            // Render name
            const title = document.querySelector('h1.title');
            typewriter(title, meta.data.attributes.Name);
        });

    // Render Links
    fetch(`${url}/api/links?populate=*`)
        .then(res => res.json())
        .then(links => render(links));    
}