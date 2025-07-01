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

    console.log(article);
  };

  document.head.appendChild(s);
})();
