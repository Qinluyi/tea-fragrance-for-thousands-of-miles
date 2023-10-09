let ID = 'suofang';

$(function() {
	$(window).resize(function() {
		setTransform();
	});
	setTransform();
});


function setTransform() {

	const windowWitdh = document.documentElement.clientWidth;
	let viewWitdh = $("#" + ID).width();
	var wBi = windowWitdh / viewWitdh
	str = "scale(" + wBi + ", " + wBi + ")"
	$("#" + ID).css('transform', str);
	$("#" + ID).show()
}