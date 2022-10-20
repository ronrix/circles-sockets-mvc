
class CircleController {
	index = (req, res) => {
		res.render("index");
	}
}

module.exports = new CircleController();