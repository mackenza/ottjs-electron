const readPkg = require('read-pkg');
const writePkg = require('write-pkg');
const ipc = require('electron').ipcRenderer;

const selectDirBtn = document.getElementById('pkg-open');
var pkg;
readPkg(__dirname).then( (pkg) => {
  renderPkg(pkg);
});

selectDirBtn.addEventListener('click', function (event) {
  ipc.send('open-file-dialog')
});

ipc.on('selected-directory', function (event, path) {
  document.getElementById('selected-file').innerHTML = `${path}`;
  renderPkg(readPkg.sync(path[0]));
});

function renderPkg(pkg) {
  let keywords = pkg.keywords;
  let keywordsMarkup = "";
  keywords.forEach(function(element) {
    keywordsMarkup += `<a class="ui teal tag label">${element}</a>`;
  });
  document.getElementById('pkg-name').innerHTML = pkg.name;
  document.getElementById('pkg-version').innerHTML = pkg.version;
  document.getElementById('pkg-desc').innerHTML = pkg.description;
  document.getElementById('pkg-keywords').innerHTML = keywordsMarkup;
  document.getElementById('pkg-homepage').innerHTML = `<a href="${pkg.homepage}">${pkg.homepage}</a>`;
  document.getElementById('pkg-bugs-url').innerHTML = `<a href="${pkg.bugs.url}">${pkg.bugs.url}</a>`;
  document.getElementById('pkg-bugs-email').innerHTML = pkg.bugs.email;
}