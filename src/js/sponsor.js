// slideout
var slideout = new Slideout({
    'panel': document.getElementById('panel'),
    'menu': document.getElementById('menu'),
    'padding': 256,
    'tolerance': 70,
    'touch': false
});

function Approval(){
	this.switchStr = true; //面包屑点击switch
	this.expenseImageUrl = []; //报销凭证url
	this.expenseImageName = []; //报销凭证name
	this.num = 0; //添加报销num

	this.config = {
		productType: document.querySelector("#productType"),
		myModal: document.querySelector("#myModal"),
		addBtn: document.querySelector("#addBtn"),
		inWrap: document.querySelector("#inWrap"),
		cashierWrap: document.querySelector("#cashierWrap"),
		bankAccount: document.querySelector("#bankAccount"),
		accountName: document.querySelector("#accountName"),
		accounNumber: document.querySelector("#accounNumber"),
		expenseTotal: document.querySelector("#expenseTotal"),
		epUserWrap: document.querySelector("#epUserWrap"),
		departmentWrap: document.querySelector("#departmentWrap"),
		breadcrumb: document.querySelector("#breadcrumb"),
		approverWrap: document.querySelector("#approverWrap"),
		uploadBtn: document.querySelector("#uploadBtn"),
		myFile: document.querySelector("#myFile"),
		uploadWrap: document.querySelector("#uploadWrap"),
		departWrapID: document.querySelector("#departWrapID"),
		addApprover: document.querySelector("#addApprover"),
		closeBtn: document.querySelector("#closeBtn"),
		closeBtn_depart: document.querySelector("#closeBtn_depart"),
		menu: document.querySelector("#menu"),
		departSearch: document.querySelector("#departSearch"),
		departmentContent: document.querySelector("#departmentContent"),
		jobNum: document.querySelector("#jobNum"),
		groupWrap: document.querySelector("#groupWrap")
	}
}

Approval.prototype = {
	// throttle: function(method, context) { //点击节流
	// 	clearTimeout(method.tId);
	// 	method.tId = setTimeout(function() {
	// 		method.call(context);
	// 	}, 200);
	// },
	throttle: function(method, delay){ //节流
		var timer = null;
		return function() {
			var context = this,
				args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function() {
				method.apply(context, args);
			}, delay);
		}
	},
	throttleInput: function(method, delay, duration) { //input节流
		var timer = null,
			begin = new Date();
		return function() {
			var context = this,
				args = arguments,
				current = new Date();;
			clearTimeout(timer);
			if (current - begin >= duration) {
				method.apply(context, args);
				begin = current;
			} else {
				timer = setTimeout(function() {
					method.apply(context, args);
				}, delay);
			}
		}
	},
	getProductType: function(){ //获取报销类型
		var self = this;
		$.ajax({
		    url: getRoothPath+'/ddExpenses/userController/reviewType.do',
		    // async: false, //同步
		    success:function(data){
		        console.log(data)
		        if (JSON.stringify(data) !== "{}") 
		        {
		            var status = data.status;

		            switch(status){
		                case "true":
	                   	var info = data.info;
	                   	if (JSON.stringify(info) !== "{}") {
							var dataArr = info.data;
							if (dataArr.length) {
								var str = "";

								for (var i = 0,len = dataArr.length; i < len; i++) {
									str += '<li class="list-group-item" data-producttypeid='+dataArr[i].productTypeID+'>'+dataArr[i].productTypeName+'</li>';
								};

								self.config.productType.innerHTML = str;
								self.selectProductType();
							} else{
								$my.messageInfo.html("报销类型为空").fadeIn("fast").delay("1000").fadeOut("slow");
								return false;
							};

	                   	} else{
	                		$my.messageInfo.html("暂无报销类型").fadeIn("fast").delay("1000").fadeOut("slow");
	                		return false;
	                   	};
	
		                   break;
		                case "failure":
		                   $my.messageInfo.html("查询错误").fadeIn("fast").delay("1000").fadeOut("slow"); 
		                   break;
		                default:
		                    break;
		            }           
		        } else
		        {
		            $my.messageInfo.html("暂无数据").fadeIn("fast").delay("1000").fadeOut("slow");
		            return false;
		        };
		    }
		})
	},
	selectProductType: function(){ //报销类型选择事件
		var self = this;
		var num = ""; //点击下标
		var productTypeList = this.config.productType.querySelectorAll("li");
		productTypeList = Array.prototype.slice.apply(productTypeList);

		$(self.config.inWrap).on('touchend',".product", function(event) {
			event.preventDefault();
			event.stopPropagation();

			num = parseInt($(this).parents(".bx_appendChild")[0].dataset["index"]);
			
			$(myModal).modal("show");
		});
		
		for (var i = 0,len = productTypeList.length; i < len; i++) {			
			productTypeList[i].addEventListener("click", function(event){
				event.preventDefault();
				event.stopPropagation();

				var val = this.innerHTML;
				var productid = this.dataset["producttypeid"];

				var domArr = self.config.inWrap.querySelectorAll(".bx_appendChild");
				Array.prototype.forEach.call(domArr,function(item,index){
					if (num === index) {
						item.querySelector(".product").value = val;
						item.querySelector(".product").dataset["productid"] = productid;
					};
				})

				$(myModal).modal("hide"); //手动关闭模态框
			}, false);
		};
	},
	addEvents: function(){ //添加报销
		// var num = 0;
		var str = "";
		var text = "";
		var self = this;

		self.config.addBtn.addEventListener("click", function(){
			self.num++;
			if (self.num > 2) {
				$my.messageInfo.html("最多添加2个报销").fadeIn("fast").delay("1000").fadeOut("slow");
				return false;
			} else{

				switch(self.num){
					case 1:
						text = "报销二";
						break;
					case 2:
						text = "报销三";
						break;
					default:
						break;
				}
				str += '<div class="appendChild bx_appendChild" data-index='+self.num+'>';
				str += '<p class="titleMessage clearfix">'+text+' <i class="iconfont icon-ttpodicon deleteIcon pull-right"></i></p>';
				str += '<div class="container-fluid myContainer inputFile">';
				str += '<div class="row my-row">';
				str += '<div class="col-xs-3 col-sm-3 col-md-3 my-col">';
				str += '<span>报销类型</span>';
				str += '</div>';
				str += '<div class="col-xs-9 col-sm-9 col-md-9 my-col">';
				str += '<input type="text" class="product" data-productid="" readonly="readonly" data-toggle="modal" data-target="#myModal" placeholder="请输入">';
				str += '</div>';
				str += '</div>';
				str += '<div class="row my-row">';
				str += '<div class="col-xs-4 col-sm-4 col-md-4 my-col">';
				str += '<span>报销金额(￥)</span>';
				str += '</div>';
				str += '<div class="col-xs-8 col-sm-8 col-md-8 my-col">';
				str += '<input type="number" class="itemAlltotals" data-count="0" placeholder="请输入">';
				str += '</div>';
				str += '</div>';
				str += '<div class="row my-row special-row">';
				str += '<div class="col-xs-3 col-sm-3 col-md-3 my-col">';
				str += '<span>费用说明</span>';
				str += '<span class="limit">(150字)</span>';
				str += '</div>'; 
				str += '<div class="col-xs-9 col-sm-9 col-md-9 my-col">';
				str += '<textarea class="remarks" placeholder="请输入" maxlength="150"></textarea>';
				str += '</div>';
				str += '</div>';
				str += '</div>';
				str += '</div>';

				$(self.config.inWrap).append(str);
				str = "";
			}
		}, false);
	},
	getCashierUser: function(){ //获取出纳人
		var self = this;
		$.ajax({
		    url: getRoothPath+'/ddExpenses/userController/cashierUser.do',
		    // async: false, //同步
		    success:function(data){
		        console.log(data)
		        if (JSON.stringify(data) !== "{}") 
		        {
		            var status = data.status;

		            switch(status){
		                case "true":
	                   		var info = data.info;
	                   		
							if (JSON.stringify(info) !== "{}") {
								var dataArr = info.data;
								if (dataArr.length) {
									var str = "";

									for (var i = 0,len = dataArr.length; i < len; i++) {
										str += '<li class="cashier text-center" data-cashierUserID='+dataArr[i].cashierUserID+'>';
										str += '<div class="wating text-center progressBar">出纳</div>';
										str += '<p class="name">'+dataArr[i].cashierUserName+'</p>';
										str += '</li>';
									};

									self.config.cashierWrap.innerHTML = str;
								} else{
									self.config.cashierWrap.innerHTML = "<span style='font-weight:normal'>暂无出纳人信息</span>";
								};

							} else{
								$my.messageInfo.html("返回信息为空").fadeIn("fast").delay("1000").fadeOut("slow"); 
								return;
							};
		                	break;
		                case "failure":
		                	$my.messageInfo.html("查询错误").fadeIn("fast").delay("1000").fadeOut("slow"); 
		                	break;
		                default:
		                    break;
		            }           
		        } else
		        {
		            $my.messageInfo.html("暂无数据").fadeIn("fast").delay("1000").fadeOut("slow");
		            return false;
		        };
		    }
		})
	},
	getOldBank: function(userID){ //获取历史收款信息
		var self = this;

		if (userID != null && userID != "null") {
			$.ajax({
			    url: getRoothPath+'/ddExpenses/userController/getOldBank.do',
			    // data: {"userID":userID},
			    data: {"userID":userID},
			    // async: false, //同步
			    success:function(data){
			        console.log(data)
			        if (JSON.stringify(data) !== "{}") 
			        {
			            var status = data.status;

			            switch(status){
			                case "true":
		                   		var info = data.info;
		                   		
								if (JSON.stringify(info) !== "{}") {
									var dataArr = info.data;
									if (dataArr.length) {
										self.config.bankAccount.value = dataArr[0].bankAccount;
										self.config.accountName.value = dataArr[0].accountName;
										self.config.accounNumber.value = dataArr[0].accounNumber;
									};

								} else{
									$my.messageInfo.html("返回信息为空").fadeIn("fast").delay("1000").fadeOut("slow"); 
									return;
								};
			                	break;
			                case "failure":
			                	$my.messageInfo.html("查询错误").fadeIn("fast").delay("1000").fadeOut("slow"); 
			                	break;
			                default:
			                    break;
			            }           
			        } else
			        {
			            $my.messageInfo.html("暂无数据").fadeIn("fast").delay("1000").fadeOut("slow");
			            return false;
			        };
			    }
			})
		} else{
			$my.messageInfo.html("用户ID丢失").fadeIn("fast").delay("1000").fadeOut("slow"); 
			return;
		};
	},
	calcExpenseTotal: function(){ //计算总金额
		var self = this;
		var reg = /^\d+(\.\d+)?$/; //非负浮点数
		$(self.config.inWrap).on('keyup',".itemAlltotals", function(event) {
			var totalCount = 0;
			event.preventDefault();
			event.stopPropagation();
			
			if (this.value != "") {
				if (reg.test(this.value)) {

					if (parseFloat(this.value) <= 1000000) {					
						this.dataset["count"] = this.value;
					} else{
						$my.messageInfo.html("单个报销金额最大100万").fadeIn("fast").delay("1500").fadeOut("slow"); 
						this.value = "";
						this.dataset["count"] = 0;
						// return;
					};					
				} else{
					$my.messageInfo.html("请输入非负浮点数").fadeIn("fast").delay("1000").fadeOut("slow"); 
					return;
				};
			}else if(this.value == ""){
				this.dataset["count"] = 0;
			};	

			//计算总金额
			var itemAlltotalsList = $(this).parents("#inWrap")[0].querySelectorAll(".itemAlltotals");
			Array.prototype.forEach.call(itemAlltotalsList,function(item){
				totalCount += parseFloat(item.dataset["count"]);
			});

			self.config.expenseTotal.value = totalCount.toFixed(4);
		});
	},
	getEpUser: function(userID){ //获取常用审批人
		var self = this;
		if (userID != null && userID != "null") {
			$.ajax({
			    url: getRoothPath+'/ddExpenses/userController/oldExpensesUser.do',
			    data: {"userID":userID},
			    // async: false, //同步
			    success:function(data){
			        console.log(data)
			        if (JSON.stringify(data) !== "{}") 
			        {
			            var status = data.status;

			            switch(status){
			                case "true":
		                   		var info = data.info;
		                   		
								if (JSON.stringify(info) !== "{}") {
									var dataArr = info.data;
									if (dataArr.length) {
										var str = "";

										for (var i = 0,len = dataArr.length; i < len; i++) {
											str += '<li class="nowrap text-center" data-oldEpUserID='+dataArr[i].oldEpUserID+'>'+dataArr[i].oldEpUserUserName+'</li>';
										};

										self.config.epUserWrap.innerHTML = str;
									}else if(dataArr.length == 0){
										self.config.epUserWrap.innerHTML = "<span style='font-weight:normal'>暂无常用审批人</span>";
									};

								} else{
									$my.messageInfo.html("返回信息为空").fadeIn("fast").delay("1000").fadeOut("slow"); 
									return;
								};
			                	break;
			                case "failure":
			                	$my.messageInfo.html("查询错误").fadeIn("fast").delay("1000").fadeOut("slow"); 
			                	break;
			                default:
			                    break;
			            }           
			        } else
			        {
			            $my.messageInfo.html("暂无数据").fadeIn("fast").delay("1000").fadeOut("slow");
			            return false;
			        };
			    }
			})
		} else{
			$my.messageInfo.html("用户ID丢失").fadeIn("fast").delay("1000").fadeOut("slow");
            return false;
		};	
	},
	_renderDepartSP: function(info){ //渲染获取部门及联系人
		var str = "";
		var listUserArr = info.listUser;
		var listDepartArr = info.listDepart;

		if (listDepartArr.length) {
			for (var i = 0,len = listDepartArr.length; i < len; i++) {
				str += '<div class="row my-row" data-departID='+listDepartArr[i].departID+'>';
				str += '<div class="col-xs-8 col-sm-8 col-md-8 my-col nowrap">';
				str += '<span class="departName">'+listDepartArr[i].departName+'</span>';
				str += '</div>';
				str += '<div class="col-xs-4 col-sm-4 col-md-4 my-col text-right">';
				str += '<p><i>'+listDepartArr[i].userCount+'</i>&nbsp;<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></p>';
				str += '</div>';
				str += '</div>';
			};
		};

		if (listUserArr.length) {
			for (var i = 0,len = listUserArr.length; i < len; i++) {
				str += '<div class="row my-row" data-departUserID='+listUserArr[i].departUserID+'>';
					str += '<div class="col-xs-8 col-sm-8 col-md-8 my-col nowrap">';
						str += '<span class="departUserName">'+listUserArr[i].departUserName+'</span>';
					str += '</div>';
					str += '<div class="col-xs-4 col-sm-4 col-md-4 my-col text-right">';
						str += '<p><span class="glyphicon glyphicon-ok my-icon" aria-hidden="true"></span></p>';
					str += '</div>';
				str += '</div>';
			};
		};

		this.config.departmentWrap.innerHTML = str;
		this.switchStr = true;
	},
	_deleteProductType:function(){ //删除报销类型
		var self = this;

		$(self.config.inWrap).on('touchend', '.deleteIcon', function(event) {
			event.preventDefault();
			event.stopPropagation();

			var index = $(this).parents(".bx_appendChild").attr("data-index");
			var length = $(this).parents("#inWrap").find('.bx_appendChild').length;

			switch(length){
				case 2:
					$(this).parents(".bx_appendChild").next(".bx_appendChild").attr('data-index', '1');
					self.num = 0;
					break;
				case 3:
					if (index === "1") {
						$(this).parents(".bx_appendChild").next(".bx_appendChild").attr('data-index', '1').children('.titleMessage').html("报销二 <i class='iconfont icon-ttpodicon deleteIcon pull-right'></i>");
						self.num = 1;
					}else if(index === "2"){
						self.num = 1;
					};
					break;
				default:
					$my.messageInfo.html("异常错误").fadeIn("fast").delay("1500").fadeOut("slow"); 
					break;
			};

			$(this).parents(".bx_appendChild").remove();

			//计算总金额
			var totalCount = 0;
			var itemAlltotalsList = self.config.inWrap.querySelectorAll(".itemAlltotals");
			Array.prototype.forEach.call(itemAlltotalsList,function(item){
				totalCount += parseFloat(item.dataset["count"]);
			});

			self.config.expenseTotal.value = totalCount.toFixed(4);
		});
	},
	getDepart: function(departmentID){ //获取部门及联系人
		var self = this;
		$.ajax({
		    url: getRoothPath+'/ddExpenses/userController/getDepartOrUser.do',
		    // async: false, //同步
		    data: {"departmentID": departmentID},
		    success:function(data){
		        console.log(data)
		        if (JSON.stringify(data) !== "{}") 
		        {
		            var status = data.status;

		            switch(status){
		                case "true":
	                   		var info = data.info;
	                   		
							if (JSON.stringify(info) !== "{}") {
								self._renderDepartSP(info)
							} else{
								$my.messageInfo.html("返回信息为空").fadeIn("fast").delay("1000").fadeOut("slow"); 
								return;
							};
		                	break;
		                case "failure":
		                	$my.messageInfo.html("部门及人员获取错误").fadeIn("fast").delay("1000").fadeOut("slow"); 
		                	break;
		                default:
		                    break;
		            }           
		        } else
		        {
		            $my.messageInfo.html("暂无数据").fadeIn("fast").delay("1000").fadeOut("slow");
		            return false;
		        };
		    }
		})
	},
	asyncGetDepart: function(){ //异步加载部门及联系人&选择审批人
		var self = this;
		$(departmentWrap).on('click', '.row', function(event) {
			event.preventDefault();
			event.stopPropagation();

			var str = document.createElement("li");
			var departid = this.dataset["departid"];
			var departStr = '';

			if (this.querySelector(".departName")) {
				departStr = this.querySelector(".departName").innerHTML;

				str = '<li data-departmentID='+departid+'><a href="javascript:;">'+departStr+'</a></li>';
				self.getDepart(departid);

				$(self.config.breadcrumb).append(str);
			}else{ //选择审批人
				var departUserName = ""; //选择审批人名
				var userid = ""; //选择审批人id
				var approverStr = "";

				departUserName = this.querySelector(".departUserName").innerHTML;
				userid = this.dataset["departuserid"];

				var approverList = self.config.approverWrap.querySelectorAll("li");

				if (approverList.length >= 10) {
					$my.messageInfo.html("审批人最多添加9名").fadeIn("fast").delay("1000").fadeOut("slow");
					return;
				};

				Array.prototype.forEach.call(approverList,function(item){
					if (userid == item.dataset["userid"]) {
						$my.messageInfo.html("该审批人已在列表中").fadeIn("fast").delay("1000").fadeOut("slow");
						throw new Error("该审批人已在列表中");
					};
				});
				this.querySelector(".my-icon").classList.add("hasselect");
				approverStr = '<li class="nowrap addPeople" data-userid='+userid+'>'+departUserName+'</li>';
				self.config.approverWrap.insertAdjacentHTML('afterBegin', approverStr);
				slideout.close();
			};		

			var breadcrumbList = self.config.breadcrumb.querySelectorAll("li");
			breadcrumbList = Array.prototype.slice.call(breadcrumbList);
			breadcrumbList.pop();
			
			for (var i = 0,len = breadcrumbList.length; i < len; i++) {
				breadcrumbList[i].classList.add("active");
			};
		});
	},
	crumbsEvent: function(){ //面包屑点击事件
		var self = this;
		$(breadcrumb).on('click', 'li', function(event) {
			event.preventDefault();
			event.stopPropagation();

			if (self.switchStr) {
				if (this.classList.contains("active")) { //hasclass
					this.classList.remove("active"); //当前点击移除active
					self.switchStr = false;

					var str = "";
					var departmentid = this.dataset["departmentid"];
					var num = $(this).index();
					var breadcrumbList = this.parentNode.querySelectorAll("li");
					breadcrumbList = Array.prototype.slice.apply(breadcrumbList);			
					breadcrumbList = breadcrumbList.slice(0, num+1);
					
					for (var i = 0,len = breadcrumbList.length; i < len; i++) {
						str += breadcrumbList[i].outerHTML;				
					};
					self.config.breadcrumb.innerHTML = str;
					self.getDepart(departmentid);
				};
			};			
		});
	},
	selectEpUser: function(){ //常用审批人点击事件
		var self = this;
		var departUserName = ""; //选择审批人名
		var userid = ""; //选择审批人id
		var approverStr = "";

		$(this.config.epUserWrap).on('click', 'li', function(event) {
			event.preventDefault();
			event.stopPropagation();

			userid = this.dataset["oldepuserid"];
			departUserName = this.innerHTML;

			var approverList = self.config.approverWrap.querySelectorAll("li");
			Array.prototype.forEach.call(approverList,function(item){
				if (userid == item.dataset["userid"]) {
					$my.messageInfo.html("该审批人已在列表中").fadeIn("fast").delay("1000").fadeOut("slow");
					throw new Error("该审批人已在列表中");
				};
			});

			approverStr = '<li class="nowrap addPeople" data-userid='+userid+'>'+departUserName+'</li>';
			self.config.approverWrap.insertAdjacentHTML('afterBegin', approverStr);
			slideout.close();
		});
	},
	submitEvent: function(){ //提交保存事件
		var imageUrlArr = [],
			expenseTotal = approval.config.expenseTotal.value,
			bankAccount = approval.config.bankAccount.value,
			accountName = approval.config.accountName.value,
			accounNumber = approval.config.accounNumber.value,
			departmentID = approval.config.departWrapID.dataset["departmentinputid"],
			producttypeIDs = [],
			itemAlltotals = [],
			remarks = [],
			expensesUserID = [],
			cashierUserID = approval.config.cashierWrap.querySelector("li.cashier").dataset["cashieruserid"],
			producttypeDomArr = approval.config.inWrap.querySelectorAll(".product"),
			itemAlltotalDomArr = approval.config.inWrap.querySelectorAll(".itemAlltotals"),
			remarksDomArr = approval.config.inWrap.querySelectorAll(".remarks"),
			expensesUserDomArr = approval.config.approverWrap.querySelectorAll(".nowrap"),

		producttypeDomArr = Array.prototype.slice.apply(producttypeDomArr);
		itemAlltotalDomArr = Array.prototype.slice.apply(itemAlltotalDomArr);
		remarksDomArr = Array.prototype.slice.apply(remarksDomArr);

		Array.prototype.forEach.call(expensesUserDomArr,function(item){
			expensesUserID.push(item.dataset["userid"]);
		})

		for (var i = 0,len = producttypeDomArr.length; i < len; i++) {
			if (producttypeDomArr[i].dataset["productid"] == "") {
				$my.messageInfo.html("请完善报销类型").fadeIn("fast").delay("1000").fadeOut("slow"); 
				return;
			};

			if (itemAlltotalDomArr[i].value == "") {
				$my.messageInfo.html("请完善报销金额").fadeIn("fast").delay("1000").fadeOut("slow"); 
				return;
			};

			producttypeIDs.push(producttypeDomArr[i].dataset["productid"]);
			itemAlltotals.push(itemAlltotalDomArr[i].value);
			remarks.push(remarksDomArr[i].value);
		};

		if (departmentID == "") {
			$my.messageInfo.html("请选择报销部门").fadeIn("fast").delay("1000").fadeOut("slow"); 
			return;
		};

		if (bankAccount == "" || accountName == "" || accounNumber == "") {
			$my.messageInfo.html("请完善收款信息").fadeIn("fast").delay("1000").fadeOut("slow"); 
			return;
		};

		if (expenseTotal == "") {
			$my.messageInfo.html("报销总金额为空").fadeIn("fast").delay("1000").fadeOut("slow"); 
			return;
		};

		if (approval.expenseImageUrl.length === 0) {
			$my.messageInfo.html("请完善报销凭证").fadeIn("fast").delay("1000").fadeOut("slow"); 
			return;
		};

		if (expensesUserID.length === 0) {
			$my.messageInfo.html("请完善审批人").fadeIn("fast").delay("1000").fadeOut("slow"); 
			return;
		};

		if (cashierUserID == "") {
			$my.messageInfo.html("出纳人信息为空").fadeIn("fast").delay("1000").fadeOut("slow"); 
			return;
		};

		producttypeIDs = producttypeIDs.join();
		itemAlltotals = itemAlltotals.join();
		remarks = remarks.join();
		expensesUserID = expensesUserID.join();

		for (var i = 0,len = approval.expenseImageUrl.length; i < len; i++) {//拼接图片域名
			imageUrlArr.push(clouddnImgStr+"/"+approval.expenseImageUrl[i]);
		};

		$.ajax({
		    url: getRoothPath+'/ddExpenses/expense/save.do',
		    // async: false, //同步
		    data: {
		    	"departmentID":departmentID,
		    	"expenseTotal": expenseTotal,
		    	"submitUserID": $my.userID,
		    	"bankAccount": bankAccount,
		    	"accountName": accountName,
		    	"accounNumber": accounNumber,
		    	"producttypeIDs": producttypeIDs,
		    	"itemAlltotals": itemAlltotals,
		    	"remarks": remarks,
		    	"expensesUserIDs": expensesUserID,
		    	"cashierUserID": cashierUserID,
		    	"expenseImageUrl": imageUrlArr.join(),
		    	"expenseImageName": approval.expenseImageName.join()
		    },
		    success:function(data){
		        console.log(data)
		        if (JSON.stringify(data) !== "{}") 
		        {
		            var status = data.status;

		            switch(status){
		                case 1:
		                	var timer = null;
	                   		$my.messageInfo.html(data.msg).fadeIn("fast").delay("1000").fadeOut("slow"); 

	                   		!function(){
	                   		    localStorage.removeItem("sessionTouchData_mySponser");
	                   		    localStorage.removeItem("pageNum_mySponser");
	                   		    localStorage.removeItem("dataCount_mySponser");
	                   		    localStorage.removeItem("sessionTouchData_myApproval");
	                   		    localStorage.removeItem("pageNum_myApproval");
	                   		    localStorage.removeItem("dataCount_myApproval");
	                   		}();

	                   		clearTimeout(timer);
	                   		timer = setTimeout(function(){
	                   			window.location.href = "index.html";
	                   		}, 1200);
		                	break;
		                case 0:
		                	$my.messageInfo.html("保存失败").fadeIn("fast").delay("1000").fadeOut("slow"); 
		                	break;
		                default:
		                    break;
		            }           
		        } else
		        {
		            $my.messageInfo.html("暂无数据").fadeIn("fast").delay("1000").fadeOut("slow");
		            return false;
		        };
		    }
		})
		
		+function(){ // 释放内存
			imageUrlArr = null;
			producttypeIDs = null;
			itemAlltotals = null;
			remarks = null;
			expensesUserID = null;
		}();
	},
	addImage: function(){ //添加图片
		var self = this;

		self.config.uploadBtn.addEventListener("click", function(){ // 添加照片trigger
			$(myFile).trigger('click');
		}, false);

		//图片预览FileReader
		var handleImageFile = function(file) {
			var img = document.createElement('img');
			var li = document.createElement("li");

			li.classList.add("newUploadImg");
			img.setAttribute("alt", file.name);

			img.file = file;
			li.appendChild(img);
			$(self.config.uploadWrap).prepend(li);

			var reader = new FileReader();
			reader.onload = (function(aImg) {
				return function(e) {
					aImg.src = e.target.result;
				}
			})(img);
			reader.readAsDataURL(file);
		}

		self.config.myFile.addEventListener("change", function(e){
			e.stopPropagation();
			e.preventDefault();

			var formdata = new FormData();
			var files = this.files;
			if (files.length <= 9) {
				var hasSelectLength = self.config.uploadWrap.querySelectorAll("li");
				hasSelectLength = Array.prototype.slice.apply(hasSelectLength);

				if (files.length <= 10-hasSelectLength.length) {
					for(var i = 0,len = files.length; i < len; i++) {
					    var file = files[i];
					    var type = file.name.replace(/.+\./,"").toLowerCase();
					    if (type !== "jpg" && type !== "jpeg" && type !== "png") {
					    	$my.messageInfo.html("请选择扩展名.jpg/.jpeg/.png图片").fadeIn("fast").delay("1500").fadeOut("slow"); 
					    	return;
					    };

					    if (file.size > 5*1024*1024) {
					    	$my.messageInfo.html("单张图片大小不可超过5M").fadeIn("fast").delay("1000").fadeOut("slow"); 
					    	return;
					    };
					    formdata.append('files', file);
					    handleImageFile(file);
					}
					
					if (files.length != 0) {
					    $.ajax({ 
					        url: 'http://www.ehaofangwang.com/publicshow/qiniuUtil/fileToQiniu.do',  
					        type: 'POST',  
					        data: formdata,
					        timeout: "", 
					        dataType: "json",
					        // async: false,  
					        cache: false,  
					        contentType: false,  // 告诉jQuery不要去设置Content-Type请求头
					        processData: false,  // 告诉jQuery不要去处理发送的数据
					        beforeSend: function(){
					        	$("#imgModalWrap").modal("show");
					        	$('#imgModalWrap').modal({backdrop: 'static', keyboard: false});
					        	$("#imgModalWrap").on('touchmove', function(event) {
					        		event.preventDefault();
					        		event.stopPropagation();
					        	});
					        },
					        success: function (data) {  
					            console.log(data);
			        	        if (JSON.stringify(data) !== "{}") 
			        	        {
			        	            var status = data.statas;
			        	            var imageUrl = "";
			        	            var imageNmae = "";
			        	            switch(status){
			        	                case "true":
			                           		imageUrl = data.pathUrls.split(",");
			                           		imageNmae = data.fileNames.split(",");

			                           		Array.prototype.unshift.apply(self.expenseImageUrl,imageUrl);
			                           		Array.prototype.unshift.apply(self.expenseImageName,imageNmae);

			                           		$my.messageInfo.html(data.message).fadeIn("fast").delay("1000").fadeOut("slow"); 
			        	                	break;
			        	                case "false":
			        	                	$my.messageInfo.html("上传失败,请重新上传").fadeIn("fast").delay("2000").fadeOut("slow"); 
			        	                	formdata = null;
			        	                	imageUrl = [];
			        	                	imageNmae = [];
			        	                	$(self.config.uploadWrap).find('li.newUploadImg').remove();
			        	                	break;
			        	                default:
			        	                    break;
			        	            }           
			        	        } else
			        	        {
			        	            $my.messageInfo.html("返回信息为空").fadeIn("fast").delay("1000").fadeOut("slow");
			        	            return;
			        	        };
					        },
					        complete: function(){
					        	$("#imgModalWrap").modal("hide");
					        },  
					        error: function (returndata) { 
					        	$("#imgModalWrap").modal("hide");
					        	formdata = null;
					        	$(self.config.uploadWrap).find('li.newUploadImg').remove();
					        }  
					    });
					};
				    
				} else{
					$my.messageInfo.html("单次图片最多上传9张").fadeIn("fast").delay("1000").fadeOut("slow"); 
					return;
				};
			} else{
				$my.messageInfo.html("单次图片最多上传9张").fadeIn("fast").delay("1000").fadeOut("slow"); 
				return;
			};
			
		}, false);
	},
	deleteEpUser: function(){ //删除已选审批人
		var self = this;		
		var getIndex = function(i){
			return function(){
				this.parentNode.removeChild(this);
			};
		};

		slideout.on("close",function(){
			new Promise(function(resolve,reject){
				resolve(self.config.approverWrap.querySelectorAll(".nowrap"));
			}).then(function(epUserList){
				epUserList = Array.prototype.slice.call(epUserList);
				for (var i = 0; i < epUserList.length; i++) {
					epUserList[i].onclick = getIndex(i);
				};
			}).catch(function(err){
				$my.messageInfo.html("异常错误:"+err).fadeIn("fast").delay("2000").fadeOut("slow"); 
			});
		});
	},
	deleteImg: function(){ //删除图片
		var self = this;
		$(self.config.uploadWrap).on('click', 'li.newUploadImg', function(event) {
			event.preventDefault();
			event.stopPropagation();

			var nowIndex = $(this).index();
			var fileName = $(this).children('img').attr("alt");
			var imgName = fileName.substring(0,fileName.lastIndexOf(".")); //获取点击删除图片的文件名(不包含后缀名)

			for (var i = 0,len = self.expenseImageName.length; i < len; i++) {
				if (self.expenseImageName[i] === imgName) {
					console.log(self.expenseImageName[i]);
					self.expenseImageName.splice(i, 1);
					deleteUrl(i);
				};
			};

			function deleteUrl(i){
				return function(){
					self.expenseImageUrl.splice(i, 1);
				}(i);
			};

			$(this).remove();
		});
	},
	expenseDepart: function(userID){ //默认获取报销部门
		var self = this;
		if (userID != null && userID != "null") {
			$.ajax({
			    url: getRoothPath+'/ddExpenses/userController/expenseDepart.do',
			    data: {"userID":userID},
			    // async: false, //同步
			    success:function(data){
			        console.log(data)
			        if (JSON.stringify(data) !== "{}") 
			        {
			            var status = data.status;

			            switch(status){
			                case "true":
		                   		var info = data.info;
		                   		
								if (JSON.stringify(info) !== "{}") {
									var dataArr = info.data;
									if (dataArr.length) {
										self.config.departWrapID.value = dataArr[0].departName;
										self.config.departWrapID.dataset.departmentinputid = dataArr[0].departmentID;
									};

								} else{
									$my.messageInfo.html("返回信息为空").fadeIn("fast").delay("1000").fadeOut("slow"); 
									return;
								};
			                	break;
			                case "failure":
			                	$my.messageInfo.html("报销部门查询错误").fadeIn("fast").delay("1000").fadeOut("slow"); 
			                	break;
			                default:
			                    break;
			            }           
			        } else
			        {
			            $my.messageInfo.html("暂无数据").fadeIn("fast").delay("1000").fadeOut("slow");
			            return false;
			        };
			    }
			})
		}else{
			$my.messageInfo.html("用户ID丢失").fadeIn("fast").delay("1000").fadeOut("slow");
            return false;
		};
	},
	_renderDepart: function(name,parentID){ //render报销部门
		var self = this;
		$.ajax({
		    url: getRoothPath+'/ddExpenses/userController/expenseDepartSearch.do',
		    data: {"name":name,"parentID":parentID},
		    // async: false, //同步
		    success:function(data){
		        console.log(data)
		        if (JSON.stringify(data) !== "{}") 
		        {
		            var status = data.status;

		            switch(status){
		                case "true":
	                   		var info = data.info;
	                   		
							if (JSON.stringify(info) !== "{}") {
								var dataArr = info.data;
								var str = "";

								if (dataArr.length && dataArr.length != 0) {
									for (var i = 0,len = dataArr.length; i < len; i++) {
										str += '<div class="row my-row" data-departmentwrapid='+dataArr[i].departmentID+'>';
										str += '<div class="col-xs-9 col-sm-9 col-md-9 my-col nowrap searchDepartName">';
										str += '<span>'+dataArr[i].departName+'</span>';
										str += '</div>';
										str += '<div class="col-xs-3 col-sm-3 col-md-3 my-col text-right departConfirmBtn">';
										str += '<p><span class="glyphicon glyphicon-ok my-icon" aria-hidden="true"></span></p>';
										str += '</div>';
										str += '</div>';
									};
									self.config.departmentContent.innerHTML = str;
								}else{
									str += '<div class="row my-row">';
									str += '<div class="col-xs-9 col-sm-9 col-md-9 my-col nowrap">';
									str += '<span>查询信息为空</span>';
									str += '</div>';
									str += '<div class="col-xs-3 col-sm-3 col-md-3 my-col text-right">';
									str += '<p></p>';
									str += '</div>';
									str += '</div>';

									self.config.departmentContent.innerHTML = str;
								};
							} else{
								$my.messageInfo.html("返回信息为空").fadeIn("fast").delay("1000").fadeOut("slow"); 
								return;
							};
		                	break;
		                case "failure":
		                	$my.messageInfo.html("报销部门查询错误").fadeIn("fast").delay("1000").fadeOut("slow"); 
		                	break;
		                default:
		                    break;
		            }           
		        } else
		        {
		            $my.messageInfo.html("暂无数据").fadeIn("fast").delay("1000").fadeOut("slow");
		            return false;
		        };
		    },
		    complete:function(){
		    	if (self.config.departmentContent.querySelectorAll(".row")) {
		    		var rowList = self.config.departmentContent.querySelectorAll(".row");
		    	};
		    	self.expenseDepartEvent(rowList);
		    }
		})
	},
	expenseDepartSearch: function(){ //搜索查询报销部门
		var self = this;
		var _searchDepartBuffer = function(){
			var val = this.value;
			self._renderDepart(val);
		};
		self.config.departSearch.addEventListener("input", self.throttleInput(_searchDepartBuffer, 500, 1000), false);
	},
	expenseDepartEvent: function(arr){ //报销部门点击/选择
		var self = this;
		var getTarget = function(target,that){ //获取target
			if(target.className.indexOf('my-col')!==-1){return target;}
			if(target == that){return false;}
			while (target.className.indexOf('my-col') === -1) {
				target = target.parentNode;
			}
			return target;
		};
		var hasClass = function(el, className) { //判断class
			return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
		};

		if (arr) {
			[].forEach.call(arr,function(item){
				item.addEventListener("click", function(event){
					event.preventDefault();
					event.stopPropagation();

					var departmentwrapid = this.dataset.departmentwrapid;
					var searchDepartNameVal = "";
					if (this.querySelector(".searchDepartName")) {
						searchDepartNameVal = this.querySelector(".searchDepartName").querySelector("span").innerHTML;
					};
					
					var that = this;
					var target = event.target;
					var eleName = getTarget(target,that);
					if (eleName) {
						var booleanStr = hasClass(eleName,"searchDepartName");
						if (booleanStr) {
							self._renderDepart("",departmentwrapid);
						}else{ //选中此部门
							if (that.querySelector(".departConfirmBtn")) {
								that.querySelector(".departConfirmBtn").querySelector(".my-icon").classList.add("hasselect");
							};
							
							if (searchDepartNameVal && departmentwrapid) {
								self.config.departWrapID.value = searchDepartNameVal;
								self.config.departWrapID.dataset["departmentinputid"] = departmentwrapid;
							};
							slideout.close();
						};
					};
				}, false);
			});
		};
	},
	asideEvent: function(){ //slideout
		var self = this;
		// open slideout
		self.config.addApprover.addEventListener("click", function(event){
			event.preventDefault();
			event.stopPropagation();

			self.config.menu.getElementsByClassName("content")[0].classList.remove("hide");
			self.config.menu.getElementsByClassName("content")[0].classList.add("show");
			self.config.menu.querySelector(".depart").classList.remove("show");
			self.config.menu.querySelector(".depart").classList.add("hide");
			slideout.open();		
		}, false);

		self.config.departWrapID.addEventListener("click", function(event){
			event.preventDefault();
			event.stopPropagation();

			self.config.menu.getElementsByClassName("content")[0].classList.remove("show");
			self.config.menu.getElementsByClassName("content")[0].classList.add("hide");
			self.config.menu.querySelector(".depart").classList.remove("hide");
			self.config.menu.querySelector(".depart").classList.add("show");
			slideout.open();		
		}, false);

		// close slideout
		self.config.closeBtn.addEventListener("touchend",function(event){
			event.preventDefault();
			event.stopPropagation();

			slideout.close();	
		},false);

		self.config.closeBtn_depart.addEventListener("touchend",function(event){
			event.preventDefault();
			event.stopPropagation();

			slideout.close();	
		},false);
	},
	jobNumEvent: function(){ //报销人工号输入
		var self = this,
			reg = /^[0-9]*$/,
			reg2 = /^\d{7}$/,
			inputFn = function(){
				if(reg.test(this.value)){
					if (!reg2.test(this.value)){
						$my.messageInfo.html("请输入7位数字").fadeIn("fast").delay("1000").fadeOut("slow"); 
						return;
					}else{
						var loginName = this.value;
						$.ajax({
						    url: getRoothPath+'/ddExpenses/userController/expenseUser.do',
						    data: {"loginName":loginName},
						    // async: false, //同步
						    success:function(data){
						        console.log(data)
						        if (JSON.stringify(data) !== "{}") 
						        {
						            var status = data.status;

						            switch(status){
						                case "true":
					                   		var info = data.info;
					                   		
											if (JSON.stringify(info) !== "{}") {
												var dataArr = info.data;
												if (dataArr.length) {
													self.config.bankAccount.value = dataArr[0].bankAccount;
													self.config.accountName.value = dataArr[0].accountName;
													self.config.accounNumber.value = dataArr[0].accounNumber;
												}else{
													$my.messageInfo.html("返回信息为空,请重新输入").fadeIn("fast").delay("1500").fadeOut("slow");
													self.config.jobNum.value = "";
													return;
												};

											} else{
												$my.messageInfo.html("返回信息为空").fadeIn("fast").delay("1000").fadeOut("slow"); 
												return;
											};
						                	break;
						                case "failure":
						                	$my.messageInfo.html("查询错误").fadeIn("fast").delay("1000").fadeOut("slow"); 
						                	break;
						                default:
						                    break;
						            }           
						        } else
						        {
						            $my.messageInfo.html("暂无数据").fadeIn("fast").delay("1000").fadeOut("slow");
						            return false;
						        };
						    }
						})
					};
				}else{
					$my.messageInfo.html("输入不合法").fadeIn("fast").delay("1000").fadeOut("slow"); 
					this.value = "";
					return;
				}
			};

		self.config.jobNum.addEventListener("input", self.throttle(inputFn, 1500), false);
	},
	expenseAName: function(){ //检索开户名
		var self = this,
			reg = /^[\u4e00-\u9fa5]{0,}$/,
			flag = true,
			inGroupWrap = self.config.groupWrap.querySelector("#inGroupWrap");

		var inputFn = function(){
			var val = this.value;
			if (val == "") {
				inGroupWrap.innerHTML = "";
				self.config.groupWrap.classList.remove("show");
				self.config.groupWrap.classList.add("hide");
			};

			if (flag) {
				if (reg.test(val)) {
					var len = val.length;
					if (len >= 2) {
						$.ajax({
							url: getRoothPath + '/ddExpenses/userController/expenseAName.do',
							data: {
								"name": val
							},
							// async: false, //同步
							success: function(data) {
								console.log(data)
								if (JSON.stringify(data) !== "{}") {
									var status = data.status;
									switch (status) {
										case "true":
											var info = data.info;

											if (JSON.stringify(info) !== "{}") {
												var dataArr = info.data;
												if (dataArr.length) {
													var str = "";
													for (var i = 0, len = dataArr.length; i < len; i++) {
														str += '<li class="list-group-item" data-accountnameid=' + dataArr[i].id + '>' + dataArr[i].accountName + '</li>';
													};

													inGroupWrap.innerHTML = str;
													self.config.groupWrap.classList.remove("hide");
													self.config.groupWrap.classList.add("show");
												} else {
													$my.messageInfo.html("返回信息为空,请重新输入").fadeIn("fast").delay("1500").fadeOut("slow");
													inGroupWrap.innerHTML = "";
													self.config.groupWrap.classList.remove("show");
													self.config.groupWrap.classList.add("hide");
													return;
												};

											} else {
												$my.messageInfo.html("返回信息为空").fadeIn("fast").delay("1000").fadeOut("slow");
												return;
											};
											break;
										case "failure":
											$my.messageInfo.html("查询错误").fadeIn("fast").delay("1000").fadeOut("slow");
											break;
										default:
											break;
									}
								} else {
									$my.messageInfo.html("暂无数据").fadeIn("fast").delay("1000").fadeOut("slow");
									return false;
								};
							}
						})
					};
				} else {
					$my.messageInfo.html("请输入中文汉字").fadeIn("fast").delay("1500").fadeOut("slow");
					// this.value = "";
					return;
				};
			};
			
		};

		self.config.accountName.addEventListener("compositionstart", function(){
			console.log("开始");
			inGroupWrap.innerHTML = "";
			self.config.groupWrap.classList.remove("show");
			self.config.groupWrap.classList.add("hide");
			flag = false;
		}, false);

		self.config.accountName.addEventListener("compositionend", function(){
			console.log("结束");
			flag = true;
		}, false);	
		
		self.config.accountName.addEventListener("input",self.throttle(inputFn, 1000), false);

		self.config.accountName.addEventListener("blur",function(){
			inGroupWrap.innerHTML = "";
			self.config.groupWrap.classList.add("hide");
		}, false);
	},
	expenseANameEvent: function(){ //开户名检索账号
		var self =this;
		var inGroupWrap = self.config.groupWrap.querySelector("#inGroupWrap");
		// 怂了，用jQuery了 ^-^
		$(inGroupWrap).on('touchend', 'li', function(event) {
			event.preventDefault();
			event.stopPropagation();

			self.config.groupWrap.classList.remove("show");
			self.config.groupWrap.classList.add("hide");
			
			var accountnameid = this.dataset.accountnameid;
			var val = this.innerHTML;

			self.config.accountName.value = val;

			$.ajax({
				url: getRoothPath + '/ddExpenses/userController/expenseBank.do',
				data: {
					"id": accountnameid
				},
				// async: false, //同步
				success: function(data) {
					console.log(data)
					if (JSON.stringify(data) !== "{}") {
						var status = data.status;
						switch (status) {
							case "true":
								var info = data.info;

								if (JSON.stringify(info) !== "{}") {
									var dataArr = info.data;
									if (dataArr.length) {
										self.config.bankAccount.value = dataArr[0].bankAccount;
										self.config.accounNumber.value = dataArr[0].accounNumber;
									} else {
										$my.messageInfo.html("返回信息为空").fadeIn("fast").delay("1500").fadeOut("slow");
										return;
									};

								} else {
									$my.messageInfo.html("返回信息为空").fadeIn("fast").delay("1000").fadeOut("slow");
									return;
								};
								break;
							case "failure":
								$my.messageInfo.html("查询错误").fadeIn("fast").delay("1000").fadeOut("slow");
								break;
							default:
								break;
						}
					} else {
						$my.messageInfo.html("暂无数据").fadeIn("fast").delay("1000").fadeOut("slow");
						return false;
					};
				}
			})
		});
	},
	init: function(){ //init封装
		this.getProductType(); //获取报销类型
		this.getCashierUser(); //获取出纳人	
		this.getOldBank($my.userID); //获取历史收款信息	
		this.addEvents(); //添加报销事件
		this.calcExpenseTotal(); //计算总金额
		this.getDepart(0); // 默认获取部门及联系人
		this.asyncGetDepart(); //异步加载部门及联系人
		this.getEpUser($my.userID); //获取常用审批人
		this.crumbsEvent(); //面包屑点击事件
		this.selectEpUser(); //常用审批人点击事件
		this.addImage(); //添加图片
		this.deleteEpUser(); //删除审批人
		this.deleteImg(); //删除图片
		this._deleteProductType(); //删除报销类型
		this.asideEvent(); //slideout
		this.expenseDepart($my.userID); //默认获取报销部门
		this.expenseDepartSearch(); //搜索查询报销部门
		this.expenseDepartEvent(); //报销部门点击事件
		this.jobNumEvent(); //报销人工号输入
		this.expenseAName(); //检索开户名
		this.expenseANameEvent(); //开户名检索账号
	}
}

var approval = new Approval();


$(function() {
	window.$my = {
	    messageInfo: $(".messageInfo"),
	    userID: sessionStorage.getItem("ddUserID")
	}

	approval.init(); //调用init

	// 加载进度模态框居中
	var $modal = $('#imgModalWrap');
	$modal.on('show.bs.modal', function() {
		var $this = $(this);
		var $modal_dialog = $this.find('.modal-dialog');
		// 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
		$this.css('display', 'block');
		$modal_dialog.css({
			'margin-top': Math.max(0, ($(window).height() - $modal_dialog.height()) / 2)
		});
	});	

	 //提交保存事件
	var submitBtn = document.querySelector("#submitBtn");
	// submitBtn.addEventListener("click", function(event){
	// 	event.preventDefault();
	// 	event.stopPropagation();

	// 	approval.throttle(approval.submitEvent, 200);
	// }, false);

	submitBtn.addEventListener("click",approval.throttle(approval.submitEvent, 200), false);

});

	