/* Amiraa Designs – loads products and blog posts from /data/*.json
   The admin panel (/admin) edits those JSON files; this script shows them. */
(function () {
  'use strict';

  var CATS = { bridal: 'Bridal Couture', party: 'Party Wear', modest: 'Abaya & Niqab', bespoke: 'Atelier Bespoke' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function slugify(s) {
    return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  function load(path) {
    return fetch(path, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(path + ' ' + r.status);
      return r.json();
    });
  }
  function fmtDate(d) {
    var dt = new Date(d);
    if (isNaN(dt)) return '';
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  function show(el) { requestAnimationFrame(function () { el.classList.add('visible'); }); }
  // A missing picture should leave a soft blank, not a broken-image icon.
  function img(src, alt, attrs) {
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" ' + (attrs || '') +
           ' onerror="this.onerror=null;this.style.opacity=0">';
  }

  /* ---------- Collections page ---------- */
  function initCollections() {
    var grid = document.getElementById('collectionsGrid');
    if (!grid) return;

    load('data/products.json').then(function (data) {
      var items = data.products || [];
      if (!items.length) { grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;">New pieces coming soon.</p>'; return; }

      grid.innerHTML = items.map(function (p, i) {
        var price = p.price && String(p.price).trim() ? esc(p.price) : 'Price on request';
        return '<div class="collection-card reveal reveal-delay-' + (i % 3) + '" data-category="' + esc(p.category) + '">' +
          img(p.image, p.title, 'class="card-img" style="width:100%; aspect-ratio:3/4; object-fit:cover;"') +
          '<div class="card-overlay">' +
            '<span class="blog-meta" style="color: var(--sand); font-weight: 600; margin-bottom: 0.4rem;">' + esc(CATS[p.category] || p.category) + '</span>' +
            '<h3>' + esc(p.title) + '</h3>' +
            '<p>' + esc(p.description) + '</p>' +
            '<span class="card-price">' + price + '</span>' +
            '<a href="contact.html?inquiry=' + encodeURIComponent(slugify(p.title)) + '" class="btn-gold-card" style="text-decoration: none;">Inquire Piece</a>' +
          '</div>' +
          '<div class="card-arrow">↗</div>' +
        '</div>';
      }).join('');
      grid.querySelectorAll('.reveal').forEach(show);

      var buttons = document.querySelectorAll('[data-filter]');
      var cards = grid.querySelectorAll('.collection-card');
      function apply(f) {
        buttons.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-filter') === f); });
        cards.forEach(function (c) {
          c.style.display = (f === 'all' || c.getAttribute('data-category') === f) ? '' : 'none';
        });
      }
      buttons.forEach(function (b) {
        b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
      });
      var wanted = new URLSearchParams(location.search).get('cat');
      if (wanted) apply(wanted);
    }).catch(function () {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;">We could not load the collection. Please refresh the page.</p>';
    });
  }

  /* ---------- Blog list page ---------- */
  var PAGE_SIZE = 9;

  function sortedPosts(data) {
    return (data.posts || []).map(function (p) {
      p.slug = p.slug || slugify(p.title);
      return p;
    }).sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  }

  function initBlog() {
    var app = document.getElementById('blogApp');
    var catBar = document.getElementById('blogCats');
    if (!app || !catBar) return;

    load('data/blog.json').then(function (data) {
      var posts = sortedPosts(data);
      if (!posts.length) { app.innerHTML = '<p style="text-align:center;">New stories coming soon.</p>'; return; }

      var featured = posts.filter(function (p) { return p.featured; })[0] || posts[0];
      var cats = [];
      posts.forEach(function (p) { if (p.category && cats.indexOf(p.category) < 0) cats.push(p.category); });
      var filter = 'All Stories', shown = PAGE_SIZE;

      function link(p) { return 'post.html?p=' + encodeURIComponent(p.slug); }

      function render() {
        catBar.innerHTML = ['All Stories'].concat(cats).map(function (c) {
          return '<button class="category-tag' + (c === filter ? ' active' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
        }).join('');

        var all = filter === 'All Stories';
        var list = posts.filter(function (p) { return all ? p !== featured : p.category === filter; });
        var html = '';

        if (all) {
          html += '<article class="featured-post reveal">' +
            '<div class="featured-img">' + img(featured.image, featured.title) + '</div>' +
            '<div class="featured-content">' +
              '<span class="blog-meta">Featured • ' + esc(featured.category) + ' • ' + fmtDate(featured.date) + '</span>' +
              '<h2>' + esc(featured.title) + '</h2>' +
              '<p>' + esc(featured.excerpt) + '</p>' +
              '<a href="' + link(featured) + '" class="blog-link" style="font-size: 0.85rem;">Read Full Story →</a>' +
            '</div></article>';
        }
        html += '<div class="blog-grid">' + list.slice(0, shown).map(function (p, i) {
          return '<article class="blog-card reveal reveal-delay-' + (i % 3) + '">' +
            '<div class="blog-card-img">' + img(p.image, p.title) + '</div>' +
            '<div class="blog-card-content">' +
              '<span class="blog-meta">' + esc(p.category) + ' • ' + fmtDate(p.date) + '</span>' +
              '<h3>' + esc(p.title) + '</h3>' +
              '<p>' + esc(p.excerpt) + '</p>' +
              '<a href="' + link(p) + '" class="blog-link">Read More →</a>' +
            '</div></article>';
        }).join('') + '</div>';
        if (list.length > shown) {
          html += '<div class="testimonials-nav" style="margin-top: 4rem;"><button class="t-btn" id="moreStories" style="width:auto;padding:0 28px;">Load more stories</button></div>';
        }
        app.innerHTML = html;
        app.querySelectorAll('.reveal').forEach(show);

        var more = document.getElementById('moreStories');
        if (more) more.addEventListener('click', function () { shown += PAGE_SIZE; render(); });
        catBar.querySelectorAll('[data-cat]').forEach(function (b) {
          b.addEventListener('click', function () { filter = b.getAttribute('data-cat'); shown = PAGE_SIZE; render(); });
        });
      }
      render();
    }).catch(function () {
      app.innerHTML = '<p style="text-align:center;">We could not load the stories. Please refresh the page.</p>';
    });
  }

  /* ---------- Single post page ---------- */
  function markdown(src) {
    if (window.marked && window.DOMPurify) {
      return window.DOMPurify.sanitize(window.marked.parse(String(src || '')));
    }
    // Fallback if the helper libraries cannot load: plain paragraphs.
    return String(src || '').split(/\n{2,}/).map(function (para) { return '<p>' + esc(para) + '</p>'; }).join('');
  }

  function initPost() {
    var app = document.getElementById('postApp');
    if (!app) return;
    var want = new URLSearchParams(location.search).get('p');

    load('data/blog.json').then(function (data) {
      var posts = sortedPosts(data);
      var p = posts.filter(function (x) { return x.slug === want; })[0];
      if (!p) {
        app.innerHTML = '<p style="text-align:center;">That story could not be found.</p>' +
          '<p style="text-align:center;margin-top:1.5rem;"><a href="blog.html" class="blog-link">← Back to the Journal</a></p>';
        return;
      }
      document.title = p.title + ' – Amiraa Designs';
      var t = document.getElementById('postTitle'); if (t) t.textContent = p.title;
      var m = document.getElementById('postMeta'); if (m) m.textContent = p.category + ' • ' + fmtDate(p.date);

      app.innerHTML = img(p.image, p.title, 'class="post-hero"') +
        '<div class="post-body">' + markdown(p.body) + '</div>' +
        '<p style="margin-top:3rem;"><a href="blog.html" class="blog-link">← Back to the Journal</a></p>';
    }).catch(function () {
      app.innerHTML = '<p style="text-align:center;">We could not load this story. Please refresh the page.</p>';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCollections();
    initBlog();
    initPost();
  });
})();
