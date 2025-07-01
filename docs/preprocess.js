(function addReadabilityScript() {
  var s = document.createElement('script');
  s.src = 'https://unpkg.com/@mozilla/readability@0.6.0/Readability.js';
  s.type = 'text/javascript';
  s.onerror = function () { console.error('Failed to load readability.js'); };
  s.onload = function () { console.log('readability.js loaded successfully'); };

  document.head.appendChild(s);

  const article = new Readability(document).parse();

  console.log(article.content);
})();
