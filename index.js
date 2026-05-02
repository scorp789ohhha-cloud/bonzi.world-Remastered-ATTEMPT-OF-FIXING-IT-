// ========================================================================
// Server init
// ========================================================================

console.log('=== STARTING SERVER ===');
console.log('Current directory:', __dirname);
console.log('Node version:', process.version);

// Filesystem reading functions
const fs = require('fs-extra');
console.log('✓ fs-extra loaded');

// Declare variables properly
let stats;
let updating = false;

// Check if settings.json exists
console.log('Checking for settings.json...');
try {
    stats = fs.lstatSync('settings.json');
    console.log('✓ settings.json found');
} catch (e) {
    console.log('settings.json error:', e.code);
    if (e.code == "ENOENT") {
        try {
            fs.copySync('settings.example.json', 'settings.json');
            console.log("Created new settings file.");
        } catch(e) {
            console.log(e);
            throw "Could not create new settings file.";
        }
    } else {
        console.log(e);
        throw "Could not read 'settings.json'.";
    }
}

// Load settings into memory
console.log('Loading settings.json...');
const settings = require("./settings.json");
console.log('✓ settings loaded, port:', settings.port);

// Setup basic express server
console.log('Loading express...');
var express = require('express');
var app = express();

if (updating == true) {
    if (settings.express.serveStatic)
        app.use(express.static('./build/maintenance/themes/win_xp'));
} else {
    if (settings.express.serveStatic)
        app.use(express.static('./build/www'));
}

console.log('Creating HTTP server...');
var server = require('http').createServer(app);

// Init socket.io
console.log('Loading socket.io...');
var io = require('socket.io')(server);
var port = process.env.PORT || settings.port;

exports.io = io;

// Init sanitize-html
console.log('Loading sanitize-html...');
var sanitize = require('sanitize-html');
console.log('✓ sanitize-html loaded');

// Init winston loggers (hi there)
console.log('Loading log.js...');
try {
    const Log = require('./log.js');
    Log.init();
    const log = Log.log;
    console.log('✓ log.js loaded');
} catch(e) {
    console.error('✗ Failed to load log.js:', e.message);
    console.log('Creating dummy logger...');
    const log = console;
}

// Load ban list
console.log('Loading ban.js...');
try {
    const Ban = require('./ban.js');
    Ban.init();
    console.log('✓ ban.js loaded');
} catch(e) {
    console.error('✗ Failed to load ban.js:', e.message);
}

// Start actually listening
console.log('Starting server on port:', port);
server.listen(port, function () {
    console.log("\n", "Server domain: localhost\n", "------------------------\n", "Server listening on port: " + port);
});

app.use(express.static(__dirname + '/public'));
app.use(( req, res, next ) => {
    res.setHeader( 'Access-Control-Allow-Origin', '*' );
    next();
});

app.use(express.json());

app.get('/api/v1/', async (req, res) => res.send('hello world'));

app.get('/api/v1/rooms/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./rooms.json')));
    } catch(e) {
        res.status(500).send({error: 'rooms.json missing'});
    }
});

app.post('/api/v1/rooms/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./rooms.json')));
    } catch(e) {
        res.status(500).send({error: 'rooms.json missing'});
    }
});

app.get('/api/v1/identity/user/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./user.json')));
    } catch(e) {
        res.status(500).send({error: 'user.json missing'});
    }
});

app.post('/api/v1/identity/user/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./user.json')));
    } catch(e) {
        res.status(500).send({error: 'user.json missing'});
    }
});

app.get('/api/v1/identity/fingerprint/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./fingerprint.json')));
    } catch(e) {
        res.status(500).send({error: 'fingerprint.json missing'});
    }
});

app.post('/api/v1/identity/fingerprint/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./fingerprint.json')));
    } catch(e) {
        res.status(500).send({error: 'fingerprint.json missing'});
    }
});

app.get('/api/v1/session/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./session.json')));
    } catch(e) {
        res.status(500).send({error: 'session.json missing'});
    }
});

app.post('/api/v1/session/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./session.json')));
    } catch(e) {
        res.status(500).send({error: 'session.json missing'});
    }
});

app.get('/api/v1/login/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./logins.json')));
    } catch(e) {
        res.status(500).send({error: 'logins.json missing'});
    }
});

app.post('/api/v1/login/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./logins.json')));
    } catch(e) {
        res.status(500).send({error: 'logins.json missing'});
    }
});

app.get('/api/v1/login/register/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./register.json')));
    } catch(e) {
        res.status(500).send({error: 'register.json missing'});
    }
});

app.post('/api/v1/login/register/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./register.json')));
    } catch(e) {
        res.status(500).send({error: 'register.json missing'});
    }
});

app.get('/api/v1/login/forgot/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./forgot.json')));
    } catch(e) {
        res.status(500).send({error: 'forgot.json missing'});
    }
});

app.post('/api/v1/login/forgot/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./forgot.json')));
    } catch(e) {
        res.status(500).send({error: 'forgot.json missing'});
    }
});

app.get('/api/v1/unload/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./unload.json')));
    } catch(e) {
        res.status(500).send({error: 'unload.json missing'});
    }
});

app.post('/api/v1/unload/', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(require('./unload.json')));
    } catch(e) {
        res.status(500).send({error: 'unload.json missing'});
    }
});

// Helper functions
console.log('Loading utils.js...');
try {
    const Utils = require("./utils.js");
    console.log('✓ utils.js loaded');
} catch(e) {
    console.error('✗ Failed to load utils.js:', e.message);
}

// The Beef(TM)
console.log('Loading meat.js...');
try {
    const Meat = require("./meat.js");
    Meat.beat();
    console.log('✓ meat.js loaded');
} catch(e) {
    console.error('✗ Failed to load meat.js:', e.message);
}

// Console commands
console.log('Loading console.js...');
try {
    const Console = require('./console.js');
    Console.listen();
    console.log('✓ console.js loaded');
} catch(e) {
    console.error('✗ Failed to load console.js:', e.message);
}

console.log('=== SERVER INITIALIZATION COMPLETE ===');
