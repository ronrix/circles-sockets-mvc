const add_user = require("./circles/user.socket");
const create_circle = require("./circles/create_circle.socket");
const remove_circle = require("./circles/remove_circle.socket");
const cursor_position = require("./circles/cursor_position.socket");
const clear_circles = require("./circles/clear_circles.socket");


function all_sockets(socket, session, io, users) {

	// add socket functions here
	add_user(socket, session, io, users);

	create_circle(socket, session, users);
	remove_circle(socket, session, io, users);

	cursor_position(socket, session, users);
	
	// clear all circles
	clear_circles(socket, users);

	// disconnection
	socket.on("disconnect", () => {
		const new_users = users.filter(user => user.id !== session.id);
	
		users = new_users;
		console.log(`User with id: ${session.id} disconnected`) ;
		io.emit("get_all_users", users);
	});
}

module.exports = all_sockets;