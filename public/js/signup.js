console.log("it works");


console.log($('#button1'));
$("#customer").click(function(){
	console.log("clicked");
	$("#button1").text("Customer");
})

$("#owner").click(function(){
	console.log("clicked");
	$("#button1").text("Owner");
})

$(".state").click(function(){
	console.log($(this).text());
	$("#button2").text($(this).text());

})