const readPkg = require('read-pkg');
const writePkg = require('write-pkg');
const ipc = require('electron').ipcRenderer;

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
  for (var prop in pkg) {
    if( pkg.hasOwnProperty( prop ) ) {
      if (typeof prop == 'undefined') {
        pkg[prop] = "";
      }
    } 
  }
  var keywords = pkg.keywords;
  var keywordsMarkup = "";
  keywords.forEach(function(element) {
    keywordsMarkup += `<a class="ui teal tag label">${element}</a>`;
  });
  document.getElementById('pkg-name').innerHTML = pkg.name;
  document.getElementById('pkg-version').innerHTML = pkg.version;
  document.getElementById('pkg-desc').innerHTML = pkg.description;
  document.getElementById('pkg-keywords').innerHTML = keywordsMarkup;
  document.getElementById('pkg-homepage').innerHTML = `<a href="${pkg.homepage}">${pkg.homepage}</a>`;
  if (typeof pkg.bugs.url != 'undefined') {
    document.getElementById('pkg-bugs-url').innerHTML = `URL: <a href="${pkg.bugs.url}">${pkg.bugs.url}</a>`;
  }
  if (typeof pkg.bugs.email != 'undefined') {
    document.getElementById('pkg-bugs-email').innerHTML = `Email: <a href="${pkg.bugs.email}">${pkg.bugs.email}</a>`;
  }
}