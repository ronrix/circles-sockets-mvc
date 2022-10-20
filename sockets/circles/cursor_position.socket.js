		
function cursor_position(socket, session, users) {

	socket.on("cursor_position", pos => {
		const new_users_cursor_position = users.map(user => {
			if(user.id === session.id) {
				if(!user.hasOwnProperty("cursor_position")) {
					user.cursor_position = pos;
				}
				else {
					user.cursor_position = pos;
				}
			}
			return user;
		});

		users = new_users_cursor_position;
		socket.broadcast.emit("cursor_position", users);
	});

}

module.exports = cursor_position;