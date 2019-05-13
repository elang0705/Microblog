
(function ($) {
	
	function createView(target){
		  var options = $.data(target,"hyMicroblog").options;		
	      $(target).after('<script type="text/javascript">var um = UM.getEditor(\''+target.id+'\'); UM.getEditor(\''+target.id+'\').setHeight('+options.height+'); UM.getEditor(\''+target.id+'\').setWidth('+options.width+');</script>');
		  $('<div class="hy_microblog_fb" id="hy_microblog_fb"><input type="button" value="发表" class="hy_microblog_fb_button" id="hy_microblog_fb_button"/></div>').appendTo($(target).parent()[0]);
		  bindEvent(target);
	}
	function bindEvent(target){
		var options = $.data(target,"hyMicroblog").options;	
		$($($(target).next()[0])).delegate(".hy_microblog_fb_button","click", function(){			
		    var str = UM.getEditor('myEditor').getContent();
		    var arr = {_dd:str};		 
		   $.post(options.fbUrl, arr,
			  function(data){
			  }, "json");        	
			//$.utils.formSubmit(options.fbUrl,"post",arr);			
		});
		
	}
	$.fn.hyMicroblog = function (options, param) {
		if(typeof options=="string"){
			var input =$.data(this[0],"options").input;
			var method = $.fn.hyMicroblog.methods[options];
			if(method){
				return (input,params);	
			}
		}
		options = options||{};
		return this.each(function(){
			var state= $.data(this,'hyMicroblog');
			if(state){
				$.extend(state.options, options);
			}else{
				$.data(this, 'hyMicroblog', {
					options: $.extend({}, $.fn.hyMicroblog.defaults,$.fn.hyMicroblog.parseOptions(this),options)
				});
			}
			createView(this);
			
		});
	};	
	$.fn.hyMicroblog.defaults = {
			width:800,
			height:200,
			fbUrl:"http://www.baidu.com/xx"
	};
	$.fn.hyMicroblog.parseOptions=function(target){		
	}
	$.fn.hyMicroblog.methods = {			
	};
})(jQuery);