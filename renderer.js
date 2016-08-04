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
  document.getElementById('pkg-name').innerHTML = pkg.name;
  document.getElementById('pkg-version').innerHTML = pkg.version;
  document.getElementById('pkg-desc').innerHTML = pkg.description;
  document.getElementById('pkg-keywords').innerHTML = pkg.keywords;
  document.getElementById('pkg-homepage').innerHTML = pkg.homepage;
  //document.getElementById('pkg-bugs-url').innerHTML = pkg.bugs.url;
  //document.getElementById('pkg-bugs-email').innerHTML = pkg.bugs.email;
}