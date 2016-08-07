const readPkg = require('read-pkg');
const writePkg = require('write-pkg');
const ipc = require('electron').ipcRenderer;
const shell = require('electron').shell;

const selectPkgBtn = document.getElementById('pkg-open');
var pkg;
readPkg(__dirname).then( (pkg) => {
  document.getElementById('selected-file').innerHTML = `${__dirname}/${"package.json"}`;
  renderPkg(pkg);
});

selectPkgBtn.addEventListener('click', function (event) {
  ipc.send('open-file-dialog')
});

ipc.on('selected-directory', function (event, path) {
  document.getElementById('selected-file').innerHTML = `${path}`;
  renderPkg(readPkg.sync(path[0]));
});

function renderPkg(pkg) {
  console.log(pkg);
  
  var keywords = pkg.keywords;
  var keywordsMarkup = "";
  if (typeof keywords != 'undefined') {
    keywords.forEach(function(element) {
      keywordsMarkup += `<a class="ui small teal tag label">${element}</a>`;
    });
  }
  
  $('#pkg-name').html(pkg.name);
  $('#pkg-version').html(pkg.version);
  $('#pkg-desc').html(pkg.description);
  $('#pkg-keywords').html(keywordsMarkup);

  if (typeof pkg.homepage != 'undefined') {
    $('#pkg-homepage').html(`<a href="${pkg.homepage}" id="pkg-homepage-link">${pkg.homepage}</a>`);
    $('#pkg-homepage-link').click( (event) => {
      event.preventDefault();
      handleAnchor(pkg.homepage)
    });
  }
  
  if (typeof pkg.bugs.url != 'undefined') {
    $('#pkg-bugs-url').html(`URL: <a href="${pkg.bugs.url}" id="pkg-bugs-url-link">${pkg.bugs.url}</a>`);
    $('#pkg-bugs-url-link').click( (event) => {
      event.preventDefault();
      handleAnchor(pkg.bugs.url);
    });
  } else {
    $('#pkg-bugs-url').html('URL: [unspecified]');
  }
  if (typeof pkg.bugs.email != 'undefined') {
    $('#pkg-bugs-email').html(`Email: <a href="mailto:${pkg.bugs.email}" id="pkg-bugs-email-link">${pkg.bugs.email}</a>`);
    $('#pkg-bugs-email-link').click( (event) => {
      event.preventDefault();
      handleAnchor(`mailto:${pkg.bugs.email}`)
    });
  } else {
    $('#pkg-bugs-email').html(`Email: [unspecified]`);
  }
  if (typeof pkg.license != 'undefined') {
    let licenseUrl = `https://spdx.org/licenses/${pkg.license}.html`;
    $('#pkg-license').html(`<a href="${licenseUrl}" id="pkg-license-link">${pkg.license}</a>`);
    $('#pkg-license-link').click( (event) => {
      event.preventDefault();
      handleAnchor(licenseUrl);
    });
  }

  if (typeof pkg.author != 'undefined') {
    let authorMarkup = genPersonMarkup(pkg.author);
    $('#pkg-author').html(authorMarkup);
  }
}

function genPersonMarkup(person) {
  var markup = `<div class="item">`;
  // name
  markup += `<div class="header">${person.name}</div>`;
  if (typeof person.email != 'undefined') {
    markup += `<div class="description">${person.email}</div>`;
  }
  if (typeof person.url != 'undefined') {
    markup += `<div class="description">${person.url}</div>`;
  }
  markup += `</div>`;
  return markup;
}

function handleAnchor(href) {
  shell.openExternal(href);
}

function makeEditable(el){
  el.style.border = "1px solid #000";
  el.contentEditable = true;
}

function makeReadOnly(el){
  el.style.border = "none";
  el.contentEditable = false;
}
