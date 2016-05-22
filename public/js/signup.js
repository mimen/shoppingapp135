
console.log($('#button1'));
$(".role").click(function(){
	console.log($(this).text());
	$("#button1").text($(this).text());
})

$(".state").click(function(){
	console.log($(this).text());
	$("#button2").text($(this).text());
})