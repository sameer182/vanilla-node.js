import { createServer } from "http";

const PORT = process.env.PORT;

// Example hard coded users
const users = [
    { id: 1, name: "Juggernaut", role: "carry" },
    { id: 2, name: "Tinker", role: "solo"},
    { id: 3, name: "Axe", role: "tanker"},
    { id: 4, name: "Ember Spirit", role: "carry"},
    { id: 5, name: "Earthshaker", role: "tanker"},  
    { id: 6, name: "Invoker", role: "solo"},  
];

// Logger middleware
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

// JSON middleware
const jsonMiddleware = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
};

// Route handler for GET /api/users
const getUsersHandler = (req, res) => {
    res.write(JSON.stringify(users));
    res.end();
};

// Route handler for GET /api/users/:id
const getUserIdHandler = (req, res) => {
    // Extract the url in the index 3
    const id = req.url.split('/')[3];
    const user = users.find((user) => user.id === parseInt(id));
    if (user) { 
        res.write(JSON.stringify(user));
    } else {
        res.statusCode = 404;
        res.write(JSON.stringify({message: 'User not found'}));
    }
    res.end();
};

// Route handler for GET /api/users/:role
const getUserRoleHandler = (req, res) => {
    const role = req.url.split('/')[3];
    const userRole = users.filter((user) => user.role === role);
    if (userRole.length > 0) {
        res.write(JSON.stringify(userRole));
    } else {
        res.statusCode = 404;
        res.write(JSON.stringify({ message: "User's Role not found"}));
    }
    res.end();
};

// Route not found handler
const noRouteHandler = (req, res) => {
    res.statusCode = 404;
    res.write(JSON.stringify({message: 'Route not found'}));
    res.end();
};


const server = createServer((req, res) => {
    logger(req, res, () => {
        jsonMiddleware(req, res, () => {
            // Define route and method
            if (req.url === '/api/users' && req.method === 'GET') {
               getUsersHandler(req, res);   
            // Define route for :id using regular expression
            } else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === 'GET') {
              getUserIdHandler(req, res);
            // Define route for :role using regular expression
            } else if (req.url.match(/\/api\/users\/([a-z]+)/) && req.method === 'GET') {
              getUserRoleHandler(req, res);
            } else {
               noRouteHandler(req, res);
            }

        });

    });
    
});

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}...`)
});