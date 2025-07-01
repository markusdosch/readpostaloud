(function addReadabilityScript() {
  var s = document.createElement('script');
  s.src = 'https://unpkg.com/@mozilla/readability@0.6.0/Readability.js';
  s.type = 'text/javascript';
  s.onerror = function () { console.error('Failed to load readability.js'); };
  s.onload = function () {
    console.log('readability.js loaded successfully');

    const article = new Readability(document).parse();

    if (!article?.content) {
      console.error("Article could not be extracted");
      return;
    }

    document.documentElement.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${article.title || 'Article'}</title>
          <link rel="stylesheet" href="https://readpostaloud.21solutions.de/styles.css"/>
          <script type="text/javascript" src="https://readpostaloud.21solutions.de/read.js"></script>
        </head>
        <body>
          <div class="pill-menu">
            <button class="menu-button play-icon" aria-label="Play"></button>
            <button class="menu-button pause-icon" aria-label="Pause"></button>
            <button class="menu-button stop-icon" aria-label="Stop"></button>
            <select class="language-select" aria-label="Select language"></select>
          </div>
          <div class="placeholder" style="height:40px"></div>
          <h1>${article.title || ''}</h1>
          <div class="article-meta">
            ${article.byline ? '<p><strong>By:</strong> ' + article.byline + '</p>' : ''}
            ${article.siteName ? '<p><strong>Source:</strong> ' + article.siteName + '</p>' : ''}
          </div>
          <div class="article-content">
            ${article.content}
          </div>
        </body>
        </html>
      `;
  };

  document.head.appendChild(s);
})();
