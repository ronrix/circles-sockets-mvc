const express = require("express");
const session = require("express-session");
const { RemoteSocket } = require("socket.io");
const {PORT} = require("./config");
const app = express();

app.use(express.static("assets"));
app.use(express.urlencoded({extended: true})); // for now (install body-parser)
/*
	DOCU: setting up profiler to get the data to be dispplayed, you can turn the profile by doing
		req.enable_profiler = true
	OWNER: ronrix
*/
const Profiler = require("./modules/profiler/Profiler");
app.use(new Profiler().setup);

// set up view engine, you can change this based on your view engine preferrence
app.set("views",__dirname + "/views");
app.set("view engine", "ejs");

// including all route files (DON'T CHANGE THIS)
const Routes = require("./routes");
Routes.get().then(routes => {
	app.use([...routes]);
});


const server = app.listen(PORT, () => console.log(`Server running in PORT ${PORT}`));


/*
	DOCU: this file is the server file which handles all files and run it
		include here other libraries to be used
	OWNER: ronrix
*/ 

/*
	DOCU: add socket functions in here
	OWNER: ronrix
*/ 

const io = require("socket.io")(server);
const all_sockets = require("./sockets/index.socket");
let users = [];

const sessionMiddleware = session({
	secret: "supersecret",
	resave: false,
	saveUninitialized: true
});

io.use((socket, next) => {
	sessionMiddleware(socket.request, {}, next);
});
// setup session
app.use(sessionMiddleware);


io.on("connection", socket => {
	console.log("socket connected");
	const session = socket.request.session;
	all_sockets(socket, session, io, users);
});