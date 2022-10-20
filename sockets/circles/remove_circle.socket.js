

function remove_circle(socket, session, io, users) {
	socket.on("remove_circle", () => {
		const new_users_circle = users.map(user => {
			console.log("removing circle");
			if(user.id === session.id) {
				user.circles.pop();
			}
			return user;
		});

		users = new_users_circle;
		io.emit("create_circle", users);
	});
}

module.exports = remove_circle;