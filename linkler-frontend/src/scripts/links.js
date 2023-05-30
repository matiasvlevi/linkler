// Entrypoint and main scope
async function main() {
    const { protocol, hostname } = new URL(window.location.href);
    const origin = `${protocol}//${hostname}`;

    function renderIcon({ Icon }) {
        const icon = document.createElement('img');
        icon.classList.add('icon');

        icon.setAttribute('src', `${origin}${Icon.data.attributes.url}`);

        return icon;
    }

    function renderText(tag, className, content) {
        const txt = document.createElement(tag);
        txt.classList.add(className);

        txt.textContent = content || '';

        return txt;
    }

    function renderLink({ attributes }) {
        const link = document.createElement('div');
        link.classList.add('link');

        // Render Icon
        link.appendChild(renderIcon(attributes));   

        // Render Text
        const meta = document.createElement('div');
        meta.classList.add('content');
        meta.appendChild(renderText('h2', 'title', attributes['Title']));
        
        if (attributes['Description']) 
            meta.appendChild(renderText('p', 'description', attributes['Description']));

        link.appendChild(meta);

        if (attributes.Document.data) {
            attributes.url = `${origin}${attributes.Document.data.attributes.url}`;
        }
        
        const aref = document.createElement('a');
        aref.setAttribute('href', attributes.url);
        
        aref.setAttribute('id', `ext-${attributes['GTM_Label']}`);

        if (attributes.newtab) {
            aref.setAttribute('target', '_blank');
        }
        aref.style.cursor = 'pointer';
        aref.classList.add('button');
        aref.appendChild(link);

        return aref;
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

    function renderError() {
        const container = document.querySelector('main');

        const p = document.createElement('p');
        p.textContent = 'No links found.';
        
        container.appendChild(p);
    }

    // Render Links
    fetch(`${origin}/api/links?populate=*`)
        .then(res => res.json())
        .then(links => {
            if (links.error) {
                renderError();
            } else {
                render(links)
            }
        });    
}

async function name(name, typewriterEffect) {
    function typewriter(element, text, speed = 42, i = 0) {
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

    // Render name
    const title = document.querySelector('h1.name');

    if (typewriterEffect) {
        title.classList.add('typewriter');
        setTimeout(() =>
            typewriter(title, name),
        100);
    } else {
        title.textContent = name;
    }
}