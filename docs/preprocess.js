init();

async function init() {

// Clear the document head
document.head.innerHTML = '';

await clearHeadAndLoadCSS();

 await loadScript(
    'https://unpkg.com/@mozilla/readability@0.6.0/Readability.js');
    
    const article = new Readability(document).parse();
    window.article = article;

    if (!article?.content) {
      console.error("Article could not be extracted");
      return;
    }
    
    // Clear the document body
document.body.innerHTML = '';

// Create the HTML structure with dynamic content
const htmlStructure = `
    <div class="pill-menu">
        <button class="menu-button play-icon" aria-label="Play"></button>
        <button class="menu-button pause-icon" aria-label="Pause"></button>
        <button class="menu-button stop-icon" aria-label="Stop"></button>
        <select class="language-select" aria-label="Select language">
        </select>
    </div>
    <div class="placeholder" style="height:40px"></div>
    <h1>${article.title}</h1>
    <div class="article-content"></div>
`;

// Add the structure to the body
document.body.innerHTML = htmlStructure;

// Set the article content separately using innerHTML to handle HTML content
document.querySelector('.article-content').innerHTML = article.content;
    
  await loadScript('https://readpostaloud.21solutions.de/read.js');
  
}

function onScriptsReady() {

}


function loadScript(src, options = {}) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    
    // Apply any additional options/attributes
    Object.keys(options).forEach(key => {
      script.setAttribute(key, options[key]);
    });
    
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    
    document.head.appendChild(script);
  });
}

function loadStylesheet(url) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;

        link.onload = () => resolve(link);
        link.onerror = () => reject(new Error(`Failed to load stylesheet: ${url}`));

        document.head.appendChild(link);
    });
}

async function clearHeadAndLoadCSS() {
    document.head.innerHTML = '';
    
    try {
        const link = await loadStylesheet('https://readpostaloud.21solutions.de/styles.css');
        console.log('Stylesheet loaded successfully:', link.href);
    } catch (error) {
        console.error(error.message);
    }
}