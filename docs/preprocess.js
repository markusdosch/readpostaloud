(function addReadabilityScript() {
  console.log("init");

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
  console.log("before readability");
    import { Readability } from "@mozilla/readability";
  console.log("readability imported");

    const article = new Readability(document).parse();

  console.log("after readability");
    
    // Replace the complete HTML of the current page with the article content
    if (article && article.content) {
      console.log(article.content);
      
      document.documentElement.innerHTML = \
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>\${article.title || 'Article'}</title>
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

  console.log("before appendChild");

  // Add both scripts to the document head
  document.head.appendChild(importMapScript);
  document.head.appendChild(moduleScript);
})();
