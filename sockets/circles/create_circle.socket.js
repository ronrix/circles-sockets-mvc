

function create_cirlce(socket, session, users) {
		
	socket.on("create_circle", circle => {
		const new_users_circle = users.map(user => {
			if(user.id === session.id) {
				user.circles = [circle];
			}
			
			return user;
		});

		users = new_users_circle;
		socket.broadcast.emit("create_circle", users);
	});
}

module.exports = create_cirlce;