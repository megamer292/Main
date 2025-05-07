const http = require('http');
    var myText;
    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(myText);
    });

    const port = 3000;

    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
      fetch('https://megamer292.github.io/Main/').then((data)=>{retur>
    });
