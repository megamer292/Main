var gun = GUN(['https://megamer292.github.io/Main/Chat/index.html']);
var paste = document.getElementById('paste');
var copy = gun.get('test').get('paste');
paste.oninput = () => { copy.put(paste.value) };
copy.on((data) => { paste.value = data });
