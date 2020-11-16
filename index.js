const http = require('http');
const httpProxy = require('http-proxy');
const services = require('./services.json');
//
// Create a proxy server with custom application logic
//
const proxy = httpProxy.createProxyServer({});
const gatewayHost = services['gateway']['host'];

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
const server = http.createServer((req, res) => {
    // You can define here your custom logic to handle the request
    // and then proxy the request.
    console.log(req.url.split('/'));
    const [, baseRoute, apiVersion, servicePath] = req.url.split('/');
    const service = services[servicePath];
    const options = { target: !!service ? service['host'] : gatewayHost };
    proxy.web(req, res, options);
    console.log("routing request to " + options.target);
});

console.log("listening on port 5050");
server.listen(5050);