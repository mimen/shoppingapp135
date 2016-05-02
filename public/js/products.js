console.log("it works");


console.log($('#category_button'));
$(".category").click(function(){
	console.log($(this).text());
	$("#category_button").text($(this).text());
})
