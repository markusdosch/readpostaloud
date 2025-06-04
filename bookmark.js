(function addReadabilityScript() {
  // Create and add the import map script
  const importMapScript = document.createElement('script');
  importMapScript.type = 'importmap';
  importMapScript.textContent = JSON.stringify({
    "imports": {
      "@mozilla/readability": "https://esm.sh/@mozilla/readability@0.6.0"
    }
  }, null, 2);
  // Create and add the module script
  const moduleScript = document.createElement('script');
  moduleScript.type = 'module';
  moduleScript.textContent = `
    import { Readability } from "@mozilla/readability";
    const article = new Readability(document).parse();
    
    // Replace the complete HTML of the current page with the article content
    if (article && article.content) {
      document.documentElement.innerHTML = \
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>\${article.title || 'Article'}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #333;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #2c3e50;
              margin-top: 1.5em;
            }
            p {
              margin-bottom: 1em;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <h1>\${article.title || ''}</h1>
          <div class="article-meta">
            \${article.byline ? '<p><strong>By:</strong> ' + article.byline + '</p>' : ''}
            \${article.siteName ? '<p><strong>Source:</strong> ' + article.siteName + '</p>' : ''}
          </div>
          <div class="article-content">
            \${article.content}
          </div>
        </body>
        </html>
      \;
    }
  `;
  // Add both scripts to the document head
  document.head.appendChild(importMapScript);
  document.head.appendChild(moduleScript);
})();