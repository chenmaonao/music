(function($){
	var id = null;
	function setrem(){
		id = new Date().getTime();
		
		
		var fonsize = innerWidth > 768 ? "100px" : (innerWidth/768 * 100) + "px";
		var style = $(`		<style id="${id}">
			html{
				font-size: ${fonsize};
			}
		</style>`);
		// console.log(fonsize)
		$("head").append(style);
	}
	
	setrem();
	
	var timer = [];
	$(window).on("resize",function(){
		
		var time = setTimeout(function(){
			
			for(var i = 1;i<timer.length;i++){
				clearTimeout(timer[i]);
			}
			$('#'+id).remove();
			setrem();
			timer = [];
			
		},500);
		
		timer.push(time);
		
		
		
	})
	
	
	
})(jQuery)