let highestZIndex = 1;

const layering = {
	getHighestZIndex: function () {
		return highestZIndex;
	}, incrementHighestZIndex: function () {
		highestZIndex += 1;
	}, decrementHighestZIndex: function () {
		highestZIndex -= 1;
	}, setHighestZIndex: function (zIndex) {
		highestZIndex = zIndex;
	},
};

export default layering;
