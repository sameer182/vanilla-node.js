import { createServer } from "http";
import fs from 'fs';

const PORT = process.env.PORT;

// Function to save users to a file
const saveUsersToFile = () => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}

// Read users from a file when server starts
let users = [];

// Check if users.json file exists, if not create it with initial users
if (fs.existsSync('users.json')) {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        users = JSON.parse(data);
    } catch (err) {
        console.error('Error reading users file:', err);
    }
} else {
    saveUsersToFile();
}

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

// Route handler for POST /api/users
const createUserHandler = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
    const newUser = JSON.parse(body);
    // Check if the ID already exists
    const existingUser = users.find(user => user.id === newUser.id);
    if (existingUser) {
        res.statusCode = 400;
        res.write(JSON.stringify({ message: "User's Id already exists" }));
        res.end()
    } else {
        users.push(newUser);
        saveUsersToFile();
        res.statusCode = 201;
        res.write(JSON.stringify({ user: newUser, message: "User successfully created"}));
        res.end();
    }
    });
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
            } else if (req.url === '/api/users' && req.method === 'POST') {
              createUserHandler(req, res);
            } else {
               noRouteHandler(req, res);
            }

        });

    });
    
});

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}...`)
});