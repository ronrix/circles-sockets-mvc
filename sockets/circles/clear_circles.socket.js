
function clear_circles(socket, users) {

	socket.on("clear_circles", () => {
		const cleared_circles = users.map(user => {
			user.circles = [];
			return user;
		});

		users = cleared_circles	;
		socket.broadcast.emit("clear_circles", users);
	});

}

module.exports = clear_circles;