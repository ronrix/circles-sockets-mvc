
function add_user(socket, session, io, users) {
	socket.on("create_user", (username) => {
		users.push({id: session.id, name: username, default_color: "#d5f135"});
		io.emit("get_all_users", users);
	});
}

module.exports = add_user;