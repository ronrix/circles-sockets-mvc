$(document).ready(function() {

	const socket = io.connect();

	let name = prompt("What is your name");
	if(name) {
		socket.emit("create_user", name);
	}

	$("div#members").append(`<p>${name}(you)</p>`);

	// get all users
	socket.on("get_all_users", users => {
		let html_string = "";
		let cursor_string = "";

		for(const user of users) {
			if(name == user.name) {
				html_string += `<p>${user.name}(you)</p>`;
				continue;
			}
			html_string += `<p>${user.name}</p>`;
			cursor_string += `<div class="cursor" id="${user.name}"><p>${user.name}</p><img src="imgs/cursor-icon.webp" alt="cursor icon" /></div>`
		}

		$("div.members-container div#members").html(html_string);
		$("body").append(cursor_string);
	});

	// listen for cursor event and emit the x and y position for all users
	socket.on("cursor_position", users => {
		for(const user of users) {
			$(`div#${user.name}`).css({"top": `${user.cursor_position.y}px`, "left": `${user.cursor_position.x}px`});
		}
	});

	$(document).mousemove((e) => {
		socket.emit("cursor_position", {x: e.clientX, y: e.clientY});
	});

	class Shape {

		constructor(x, y, size) {
			this.x = x;
			this.y = y;
			this.shape_el = document.createElement("div");

			this.shape_el.style.position = "absolute";

			// size
			this.size = size;
			this.shape_el.style.width = this.size + "px";
			this.shape_el.style.height = this.size + "px";
			
			// x,y location
			this.shape_el.style.top = y - ((this.size/2) + 80) + "px";
			this.shape_el.style.left = x - ((this.size/2) + 50 ) + "px";
		
		}

		// return shape element to append in the container
		draw() {
			return this.shape_el;
		}

		// shrinks the shapes with interval
		shrink() {
			const interval = setInterval(() => {
				if(this.size <= 0) {
					this.shape_el.remove();
					// socket.emit("remove_circle");
					clearInterval(interval);
				}
				this.size -= 5;
				if(this.shape_el.classList.value.includes("fa-star")) {
					this.shape_el.style.fontSize = this.size + "px";
				}
				else {
					this.shape_el.style.width = this.size + "px";
					this.shape_el.style.height = this.size + "px";
				}
			}, 50);
		}
	}

	class Circle extends Shape {
		constructor(x, y, color, name, size) {
			super(x, y, size);
			this.shape_el.classList.add("circle");
			this.shape_el.style.backgroundColor = color;
			this.id = Math.random();

			// username
			this.shape_el.textContent = name;
		}
	}

	// listen to other user for creating circles
	socket.on("create_circle", users => {
		for(const user of users) {
			for(const circle of user.circles) {
				if(user.name === name) {
					continue;
				}
				const shape = new Circle(circle.x, circle.y, circle.color, user.name, circle.size);
				body.append(shape.draw());
				shape.shrink();
			}
		}
	});

	socket.on("clear_circles", () => {
		body.innerHTML = "";
	});

	// generate shape with click event
	const body = document.querySelector("#body");
	body.addEventListener("click", function(e) {
		const size = Math.floor(Math.random() * 300 + 100);
		// emit create circle
		socket.emit("create_circle", {x: e.clientX, y: e.clientY, color: selected_color, size});

		const shape = new Circle(e.clientX, e.clientY, selected_color, name, size);
		body.append(shape.draw());
		shape.shrink();
	});
	
	// select color
	let selected_color = "#d5f135";
	const div_colors = document.querySelectorAll(".btn");
	for(let i=0; i<div_colors.length; i++) {
		div_colors[i].addEventListener("click", function() {
			selected_color = this.getAttribute("data-color");

			// remove all borders on color btns
			div_colors.forEach(el => {
				el.classList.remove("selected");
			});

			this.classList.add("selected");
		});
	}

	// reset btn 
	document.querySelector("#clear").addEventListener("click", function() {
		body.innerHTML = "";
		selected_color = "#d5f135";

		// remove all borders on color btns
		div_colors.forEach(el => {
			el.classList.remove("selected");
		});

		// add the border for default color
		div_colors[0].classList.add("selected");

		// clear all circles with socket
		socket.emit("clear_circles");
	});

});