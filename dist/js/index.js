function Approval(){this.mySponsoredCount="",this.myExpenseCount="",Object.defineProperty(this,"mySponsoredCount",{get:function(){return/^[0-9]*$/.test(mySponsoredCount)&&""!=mySponsoredCount?mySponsoredCount:mySponsoredCount="--"},set:function(e){e>99?mySponsoredCount="99+":e>=0&&e<=99&&(mySponsoredCount=e)}}),Object.defineProperty(this,"myExpenseCount",{get:function(){return/^[0-9]*$/.test(myExpenseCount)&&""!=myExpenseCount?myExpenseCount:myExpenseCount="--"},set:function(e){e>99?myExpenseCount="99+":e>=0&&e<=99&&(myExpenseCount=e)}}),this.config={mySponsoredCount:document.querySelector("#mySponsoredCount"),myExpenseCount:document.querySelector("#myExpenseCount"),content:document.getElementById("content"),footer:document.querySelector(".footer")}}Approval.prototype={throttle:function(e,n){clearTimeout(e.tId),e.tId=setTimeout(function(){e.call(n)},200)},bindDom:function(){this.config.mySponsoredCount.innerHTML=this.mySponsoredCount,this.config.myExpenseCount.innerHTML=this.myExpenseCount},getUnreadNum:function(e){var n=this;if(null==e||"null"==e)return void $my.messageInfo.html("用户ID丢失").fadeIn("fast").delay("1000").fadeOut("slow");$.ajax({url:getRoothPath+"/ddExpenses/expenseInfo/sum.do",data:{userID:e},success:function(e){if("{}"===JSON.stringify(e))return $my.messageInfo.html("暂无数据").fadeIn("fast").delay("1000").fadeOut("slow"),!1;switch(e.status){case"true":var t=e.info,o=t.myExpenseCount,s=t.mySponsoredCount;n.myExpenseCount=o,n.mySponsoredCount=s,n.bindDom();break;case"failure":$my.messageInfo.html("查询错误").fadeIn("fast").delay("1000").fadeOut("slow")}}})},buffer:function(){switch($(this).index()){case 0:window.location.href="myApproval.html";break;case 1:window.location.href="mySponser.html"}},bindEvents:function(){var e=this,n=e.config.content.querySelectorAll("li"),t=function(){window.location.href="sponsor.html"};Array.prototype.forEach.call(n,function(n,t){n.addEventListener("touchend",function(n){n.preventDefault(),n.stopPropagation(),e.throttle(e.buffer,this)},!1)}),this.config.footer.addEventListener("touchend",function(n){n.preventDefault(),n.stopPropagation(),e.throttle(t,this)},!1)}};var approval=new Approval;$(function(){window.$my={messageInfo:$(".messageInfo"),ddUserID:sessionStorage.getItem("ddUserID")},approval.getUnreadNum($my.ddUserID),approval.bindEvents()});