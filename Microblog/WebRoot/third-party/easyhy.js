/**
   $.utils,工具类
	{
		formSubmit，提交表单方法
		request:请求方法
		ajaxPost:ajaxPost方式
		ajaxGet：ajaxGet方式
	}
 */
(function($){
	    $.utils=$.utils||{};
		/**
		 * 描述：
		 *	  采用脚本自动提交表单
		 * 参数：
		 *     url：,
		 *     method: 支持get/post,
		 *     data: object类型,
		 * 返回值：没有返回值
		 * 创建人：李想
		 * 创建时间：2015-5-27
		 * 样例程序：
		 *     $.utils.formSubmit(
		 *				"http://sddd",
		 *				"get",
		 *				{name:123,age:'123213'});
		 */
		$.utils.formSubmit=function(url,method,data){
			//创建form表单元素
            $form=$('<form></form>').appendTo('body');
			
			//添加表单的请求地址（url），请求方式（method）
			$form.attr({action:url,method:method});
			
			//把data数据转换成form表单内的input隐藏域
			for(var i in data){
				$Ip=$('<input type="hidden" name='+i+' value='+data[i]+'>'); 
				$form.append($Ip);
			}
			//提交表单
			$form.submit(); 
		}
		
		/**
	     * ajax封装
	     * url 发送请求的地址
	     * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
	     * async 默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
	     *       注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
	     * type 请求方式("POST" 或 "GET")， 默认为 "GET"
	     * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
	     * successfn 成功回调函数
	     * errorfn 失败回调函数
	     */
		$.utils.request=function(url, data, async, type, dataType, successfn, errorfn) {
	        async = (async==null || async=="" || typeof(async)=="undefined")? "true" : async;
	        type = (type==null || type=="" || typeof(type)=="undefined")? "post" : type;
	        dataType = (dataType==null || dataType=="" || typeof(dataType)=="undefined")? "json" : dataType;
	        data = (data==null || data=="" || typeof(data)=="undefined")? {"date": new Date().getTime()} : data;
	        $.ajax({
	            type: type,
	            async: async,
	            data: data,
	            url: url,
	            dataType: dataType,
	            success: function(d){
	            	if(typeof successfn =="function")
	            		 successfn(d);
	               
	            },
	            error: function(e){
	            	if(typeof errorfn =="function")
	            		errorfn(e);
	            }
	        });
	    };
	    /**
	     * ajax封装
	     * url 发送请求的地址
	     * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
	     * successfn 成功回调函数
	     */
	    $.utils.ajaxPost=function(url, data,dataType, successfn) {
	        data = (data==null || data=="" || typeof(data)=="undefined")? {"date": new Date().getTime()} : data;
			dataType = (dataType==null || dataType=="" || typeof(dataType)=="undefined")? "json" : dataType;
	        $.ajax({
	            type: "post",
	            data: data,
	            url: url,
				dataType:dataType,
	            success: function(d){
	            	if(typeof successfn =="function")
	                successfn(d);
	            }
	        });
	    };
	    /**
	     * ajax封装
	     * url 发送请求的地址
	     * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
	     * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
	     * successfn 成功回调函数
	     * errorfn 失败回调函数
	     */
	    $.utils.ajaxGet=function(url, data, dataType,successfn, errorfn) {
	        data = (data==null || data=="" || typeof(data)=="undefined")? {"date": new Date().getTime()} : data;
			dataType = (dataType==null || dataType=="" || typeof(dataType)=="undefined")? "json" : dataType;
	        $.ajax({
	            type: "get",
	            data: data,
	            url: url,
				dataType:dataType,
	            success: function(d){
	            	if(typeof successfn =="function")
	                successfn(d);
	            },
	            error: function(e){
	            	if(typeof errorfn =="function")
	                errorfn(e);
	            }
	        });
	    };
		
})(jQuery);

/**
 * 表单管理工具工程。
 * 	创建者：liu.wd,创建时间:2015-5-27
 */
(function($){
	// 提取表单数据
	function getData(target,params){
		var queryParams = {};
		$(target).find('input').each(function(){
			if(this.name){
				var type = this.type, tag = this.tagName.toLowerCase();
				if (type == 'text' || type == 'hidden' || type == 'password'|| tag == 'textarea') {
					queryParams[this.name] = this.value;
				} else {
					if(type=='file'){
						var node=$(this);
						queryParams[this.name] = node.val();
					}else{
						if (type == 'checkbox') {
							if(this.checked){
								if(queryParams[this.name]){
									queryParams[this.name] = queryParams[this.name]+params.splitChar+this.value;
								}else{
									queryParams[this.name] = this.value;
								}
							}
						}else if(type == 'radio'){
							if(this.checked){
								queryParams[this.name] = this.value;
							}
						} else {
							if (tag == 'select') {
								queryParams[this.name] = [this.options(this.selectedIndex).value];
							}
						}
					}
				}
			}
			
		});
		//添加TextArea
		$(target).find('textarea').each(function(){
			queryParams[this.name] = this.value;
		});
		return queryParams;
	}
	
	// ajax 提交表单数据
	function ajaxForm(target,params){
		var data = getData(target,params);
		if(params.onBeforeSubmit.call(target,data)){
			$.utils.request(params.url,data,true,params.method,null,params.onSuccess,params.onError);
		}
		
	}
	
	/**
	 *	表单数据重置方法
	 */
	function res(target) {
		$(target).find('input').each(
				function() {
					if (this.type == 'text' || this.type == 'password'
							|| this.type == 'hidden') {
						this.value = '';
					} else {
						if (this.type == 'checkbox') {
							this.checked = '';
						} else {
							if (this.type == 'radio') {
								this.checked = '';
							}
						}
					}
		});
		$(target).find('select').each(function() {
			this.value="";
		});
		$(target).find('textarea').each(function() {
			this.value = '';
		});
	}
	
	function loadData(target,data){
		
	}
	
	
	/**
	 * 表单管理工具构造方法。
	 * 
	 */
	$.fn.formmanager=function(options,params){
		if(typeof options == "string"){
			return $.fn.formmanager.methods[options](this,params);
		}
	}
	
	/**
	 * 表单的属性信息。
	 */
	$.fn.formmanager.defaults={
		// 请求服务地址
		url:"",
		//请求方式：get/post,默认是post
		method:"post",
		// 多个数据拼装一起的分隔符
		splitChar:",",
		/* 表单提交 成功 返回数据。*/
		onSuccess:function(data){
		},
		// 请求失败的回调函数。
		onError:function(data){
		},
		// 提交表单之前的回调函数。
		onBeforeSubmit:function(data){
			return true;
		}
	}
	
	/**
	 * 表单工具的公有方法。
	 */
	$.fn.formmanager.methods={
			/**
			 * 表单提交的方法
			 * @param jq 表单jquery对象。
			 * 调用方式：
			 * 		$("#ss").formmanager('submit');
			 */
			submit:function(jq){
				$(target).submit();
			},
			/**
			 * 表单通过ajax的方式去提交。
			 * @param jq 表单jquery对象。
			 * @param params：参考 $.fn.formmanager.defaults对象
			 * 调用方式： 
			 	   $("#ss").formmanager("ajax",{
							 url:"",
							 onBeforeSubmit:function(data){
							    return true;
							 },
							 onSuccess:function(data){
							    // 判断data里边的数据是否保存成功！
							    // 跳转页面
							    $.utils.formSubmit("","get/post",{});
							 }
				   });
			 */
			ajax:function(jq,params){
				 var options = $.extend({},$.fn.formmanager.defaults,params);
				 ajaxForm(jq[0],options);
			},
			/**
			 * 获取表单数据
			 * @param jq 表单jquery对象
			 * @param params {splitChar:","}
			 * @returns 返回JSON格式 key：value.
			 * 调用方式：
			 * 		$("#ss").formmanager('getData'，{splitChar:","});
			 */
			getData:function(jq,params){
				var options = $.extend({},$.fn.formmanager.defaults,params);
			    return getData(jq,options);
			},
			
			/**
			 * 給表单加载数据
			 * @param jq
			 * @param params：数据对象JSON格式
			 * 调用方式：
			 * 	  $("#ss").formmanager('loadData'，{name:'123',age:age,birth:'2015-12-12'});
			 */
			loadData:function(jq,params){
				loadData(jq[0],params,$.fn.formmanager.defaults.splitChar);
			},
			/**
			 *	表单数据清空
			 *	@param jq表单jquery对象
			 *	@returns 没有返回值
			 *	调用方式:
			 *     $('ss').formmanager('reset');
			 */
			reset:function(jq){
               res(jq);
			}
	}
	
})(jQuery);



