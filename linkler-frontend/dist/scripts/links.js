async function main(){const t=new URL(window.location.href),e=`${t.protocol}//${t.hostname}:1337`;function n(t,e,n){const a=document.createElement(t);return a.classList.add(e),a.textContent=n||"",a}function a({attributes:t}){const a=document.createElement("div");a.classList.add("link-wrapper"),a.appendChild(function({Icon:t}){const n=document.createElement("img");return n.classList.add("link-icon"),n.setAttribute("src",`${e}${t.data.attributes.url}`),n}(t));const i=document.createElement("div");i.classList.add("meta-wrapper"),i.appendChild(n("h2","link-title",t.Title)),i.appendChild(n("p","link-description",t.Description)),a.appendChild(i),t.Document.data&&(t.url=`${e}${t.Document.data.attributes.url}`);const o=document.createElement("a");return o.setAttribute("href",t.url),o.setAttribute("id",`ext-${t.GTM_Label}`),t.newtab&&o.setAttribute("target","_blank"),o.style.cursor="pointer",o.appendChild(a),o}fetch(`${e}/api/meta`).then((t=>t.json())).then((t=>{document.title+=` ${t.data.attributes.Name}`;!function(t,e,n=35,a=0){setTimeout((function i(){t.textContent+=e[a],++a<e.length?setTimeout(i,n+Math.random()*(n/2)):t.classList.remove("typewriter")}),n)}(document.querySelector("h1.title"),t.data.attributes.Name)})),fetch(`${e}/api/links?populate=*`).then((t=>t.json())).then((t=>function({data:t}){const e=document.querySelector("main");for(const n of t)e.appendChild(a(n))}(t)))}