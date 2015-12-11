var changed=[];
var yearArray=[];
var addCount=0;
var preDate="", nextDate="";
var nowMode=""; //'D' is Date Mode, 'M' is Month Mode
var language = "zh-tw";

$(window).load(function(){
    // datePicker setting
    $(function () {
        $('#datePicker').datepicker({
            format: "mm / dd",
            todayBtn: "linked",
            autoclose: true,
            todayHighlight: true
        }).datepicker('setDate', new Date());
    });
    
    // monthPicker setting
    $(function () {
        $('#monthPicker').datepicker({
            format: "yyyy / mm",
            autoclose: true,
            todayHighlight: true,
            startView: 1,
            minViewMode: 1,
            todayHighlight: true
        }).datepicker('setDate', new Date());
        changeLanguage();
        getDiary();
    });
    
    $(function () {
        $('#DATE, #MONTH').on('change', function(){
            if(nowMode=="D"){
                getDiary();
            }
            else{
                getDiaryByMonth();
            }
        });
        
        $('#LANGUAGE_SELECT').on('change', function(){
            language=$('#LANGUAGE_SELECT').val();
            changeLanguage();
        });
        
        $('#ADD').click(function(){
            addDiary();
        });
        $('#SAVE').click(function(){
			if(changed.length!==0){
				saveDiary();
				if(nowMode=="D"){
                    getDiary();
                }
                else{
                    getDiaryByMonth();
                }
			}
        });
        $('#CLEAR').click(function(){
            if(nowMode=="D"){
                getDiary();
            }
            else{
                getDiaryByMonth();
            }
        });
        
        $('#TOP').click(function(){
            goto("pageTop");
        });
        $(window).scroll(function() {
            if ( $(this).scrollTop() > 100){
                $('#TOP').show();
            } else {
                $('#TOP').hide();
            }
        });
        
        $('#PRE_DATE').click(function(){
            $('#DATE').val(preDate);
            $('#datePicker').datepicker('updateActive');
            getDiary();
        });
        $('#NEXT_DATE').click(function(){
            $('#DATE').val(nextDate);
            $('#datePicker').datepicker('updateActive');
            getDiary();
        });
        
        $('#PRE_MONTH').click(function(){
            $('#MONTH').val(preDate);
            $('#monthPicker').datepicker('updateActive');
            getDiaryByMonth();
        });
        $('#NEXT_MONTH').click(function(){
            $('#MONTH').val(nextDate);
            $('#monthPicker').datepicker('updateActive');
            getDiaryByMonth();
        });
        
        $('#DATE_MODE').click(function(){
            $('#DATE_MODE').addClass("active");
            $('#MONTH_MODE').removeClass("active");
            $('#DATE_NAV, #PRE_DATE, #NEXT_DATE').show();
            $('#MONTH_NAV, #PRE_MONTH, #NEXT_MONTH').hide();
            nowMode="D";
            getDiary();
        });
        $('#MONTH_MODE').click(function(){
            $('#MONTH_MODE').addClass("active");
            $('#DATE_MODE').removeClass("active");
            $('#DATE_NAV, #PRE_DATE, #NEXT_DATE').hide();
            $('#MONTH_NAV, #PRE_MONTH, #NEXT_MONTH').show();
            nowMode="M";
            getDiaryByMonth();
        });
    });
    
    //Bind with key
    $(window).keydown(function(event){
        //Ctrl+Left
		if(event.keyCode==37&&event.ctrlKey){
			$('#PRE_DATE, #PRE_MONTH').click();
		}
		//CTRL+Right
		if(event.keyCode==39&&event.ctrlKey){
			$('#NEXT_DATE, #NEXT_MONTH').click();
		}
		//CTRL+S
		if(event.keyCode==83&&event.ctrlKey){
            event.preventDefault();
			$('#SAVE').click();
		}
		//CTRL+M
		if(event.keyCode==77&&event.ctrlKey){
            event.preventDefault();
			$('#ADD').click();
		}
	});
	
	//Sidebar setting
	nowMode="D";
    $('#DATE_MODE').addClass("active");
    $('#MONTH_NAV, #PRE_MONTH, #NEXT_MONTH').hide();
});
    
function getDiary(go){
    var month=$('#DATE').val().substring(0,2);
    var date=$('#DATE').val().substring(5,7);
    $.ajax({     
        url: "getDiary.php?month="+month+"&date="+date,
        type: "GET",
        dataType: "json",     
        success: function(json) {
            initialData();
            
            var yearList='';
			if(json[0]=="0 results"){
				yearList='<li><div id="NO_RECORD"></div></li>';
				document.getElementById('YEAR_LIST').innerHTML = yearList;
				document.getElementById('DIARY_CONTENT').innerHTML = "";
			}
			else{
				//Year List
				yearArray=[];
				for(i=0;i<json.length;i++){
					yearList+='<li class="text" onclick="goto('+json[i].year+');"><div id="#'+json[i].year+'" class="title">'+json[i].year+'</div></li>';
					yearArray.push(json[i].year);
				}
				document.getElementById('YEAR_LIST').innerHTML = yearList+'<li><div><br/></div></li>';
				
				//Diary Content
				var diaryContent="";
				var length=json.length-1;
				for(j=length;j>=0;j--){
                    var dayClass=getDay(json[j].year, month, date);
					diaryContent+='<br/><div id="'+json[j].year+'"> <div class="year-title">'+json[j].year+'</div> <div class="'+dayClass+' day-title"></div>　<span onclick="deleteDiary(this);" style="font-size:14px; line-height:34px;" class="glyphicon glyphicon-remove"></span> </div>';
					diaryContent+='<textarea id="DIARY_'+json[j].year+'" class="form-control" rows="'+getRow(json[j].diary_content)+'" cols="100%" onchange="changeNote(this);">'+json[j].diary_content+'</textarea><br/>';
				}
				document.getElementById('DIARY_CONTENT').innerHTML = diaryContent;
				
				goto($('#datePicker').datepicker('getDate').getFullYear());
			}
			
            changeLanguage();
            refreshScrollSpy();
			
			//Previous Date, Next Date
			var now=new Date();
			now.setFullYear('2012', month-1, date);
			now.setTime(now.getTime() - 86400000);
			preDate=(now.getMonth()+1<10?'0'+(now.getMonth()+1):now.getMonth()+1)+' / '+(now.getDate()<10?'0'+now.getDate():now.getDate());
            var perDateText='<span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span>'+preDate;
			document.getElementById('PRE_DATE').innerHTML = perDateText;
			
			now.setTime(now.getTime() + 86400000*2);
			nextDate=(now.getMonth()+1<10?'0'+(now.getMonth()+1):now.getMonth()+1)+' / '+(now.getDate()<10?'0'+now.getDate():now.getDate());
            var nextDateText=nextDate+'<span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>';
			document.getElementById('NEXT_DATE').innerHTML = nextDateText;
        }   
    });
}

function getDiaryByMonth(go){
    var year=$('#MONTH').val().substring(0,4);
    var month=$('#MONTH').val().substring(7,9);
    $.ajax({     
        url: "getDiaryByMonth.php?year="+year+"&month="+month,
        type: "GET",
        dataType: "json",     
        success: function(json) {
            initialData();
            
            var dateList='';
			if(json[0]=="0 results"){
				dateList='<li><div>No Record :(</div></li>';
				document.getElementById('DATE_LIST').innerHTML = dateList;
				document.getElementById('DIARY_CONTENT').innerHTML = "";
			}
			else{
			    // Date List
				for(i=0;i<json.length;i++){
                    var dayClass=getDay(year, month, json[i].date);
					dateList+='<li class="text" onclick="goto(\''+json[i].date+'\');"><div id="#'+json[i].date+'" class="date-list title">'+month+' / '+json[i].date+'</div>　<div class="'+dayClass+' day-list"></div></li>';
				}
				document.getElementById('DATE_LIST').innerHTML = dateList+'<li><div><br/></div></li>';
				
				//Diary Content
				var diaryContent="";
				
				for(j=0;j<json.length;j++){
                    var dayClass=getDay(year, month, json[j].date);
					diaryContent+='<br/><div id="'+json[j].date+'"> <div class="date-title">'+year+' / '+month+' / '+json[j].date+'</div> <div class="'+dayClass+' day-title"></div>　<span onclick="deleteDiary(this);" style="font-size:14px; line-height:34px;" class="glyphicon glyphicon-remove"></span></div>'
					diaryContent+='<textarea id="DIARY_'+json[j].date+'" class="form-control" rows="'+getRow(json[j].diary_content)+'" cols="100%" onchange="changeNote(this);">'+json[j].diary_content+'</textarea><br/>';
				}
				document.getElementById('DIARY_CONTENT').innerHTML = diaryContent;
				
				goto("pageTop");
			}
            
            refreshScrollSpy();
            changeLanguage();
			
			//Previous Month, Next month
			var now=new Date();
			now.setFullYear(year, month-1, '1');
			now.setTime(now.getTime() - 86400000*28);
			preDate=now.getFullYear()+' / '+(now.getMonth()+1<10?'0'+(now.getMonth()+1):now.getMonth()+1);
            var perDateText='<span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span>'+preDate;
			document.getElementById('PRE_MONTH').innerHTML = perDateText;
			
			now.setTime(now.getTime() + 86400000*31*2);
			nextDate=now.getFullYear()+' / '+(now.getMonth()+1<10?'0'+(now.getMonth()+1):now.getMonth()+1);
            var nextDateText=nextDate+'<span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>';
			document.getElementById('NEXT_MONTH').innerHTML = nextDateText;
        }   
    });
}

function getRow(content){
    var count=0;
    if(content!==null){
        while(content.indexOf("\n")!=-1){
            count++;
            content=content.substring((content.indexOf("\n")+1), content.length);
        }
    }
    //return (count<10)?10:count+2;
    return count+2;
}
    
function addDiary(){
    var newCode="";
    if(nowMode=="D"){
        newCode+='<div id="yearPicker" class="input-group date add-year-title">';
        newCode+='<input id="YEAR_'+addCount+'" type="text" class="form-control input-lg" placeholder="'+$.i18n( "year" )+'" onchange="changeNote(this);">';
        newCode+='<span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>';
        newCode+='</div>';
        newCode+='<textarea id="DIARY_'+addCount+'" class="form-control" rows="10" cols="100%" placeholder="'+$.i18n( "diaryContent" )+'" onchange="changeNote(this);"></textarea><br/>';
        
        $("#DIARY_CONTENT").prepend(newCode);
        $('#YEAR_'+addCount).focus();
        addCount++;
        
        $('#yearPicker').datepicker({
            format: "yyyy",
            autoclose: true,
            startView: 2,
            minViewMode: 2
        });
    }
    else{
        newCode+='<div id="diaryDatePicker" class="input-group date add-date-title">';
        newCode+='<input id="DATE_'+addCount+'" type="text" class="form-control input-lg" placeholder="'+$.i18n( "date" )+'" onchange="changeNote(this);">';
        newCode+='<span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>';
        newCode+='</div>';
        newCode+='<textarea id="DIARY_'+addCount+'" class="form-control" rows="10" cols="100%" placeholder="'+$.i18n( "diaryContent" )+'" onchange="changeNote(this);"></textarea><br/>';
        
        $("#DIARY_CONTENT").prepend(newCode);
        //$('#DATE_'+addCount).focus();
        addCount++;
        
        
        var year=$('#MONTH').val().substring(0,4);
        var month=$('#MONTH').val().substring(7,9);
        var end = new Date();
        end.setFullYear(year, month, '1');
        end.setTime(end.getTime() - 86400000);
        $('#diaryDatePicker').datepicker({
            format: "yyyy / mm / dd",
            autoclose: true,
            startDate: year+"/"+month+"/01",
            endDate: year+"/"+month+"/"+end.getDate(),
            maxViewMode: 0,
            todayHighlight: true
        });
    }
}

function saveDiary(){
    var year, month, date, diary_content, type;
    if(nowMode=="D"){
        month=$('#DATE').val().substring(0,2);
        date=$('#DATE').val().substring(5,7);
        for(i=0;i<changed.length;i++){
            year=(parseInt(changed[i])<parseInt("1911"))?$('#YEAR_'+changed[i]).val() : changed[i];
            diary_content=$('#DIARY_'+changed[i]).val();
            type=(parseInt(changed[i])<parseInt("1911"))?"I":"U";
            
            $.ajax({
                type: "POST",
                url: "saveDiary.php",
                data : {"year" : year, "month" : month, "date" : date, "diary_content" : diary_content, "type" : type},
                dataType: "json",     
                //success: function(json) {
                //},
                error: function(xhr,status,error) {
                    console.log("ERROR!!!  "+error);
                }
            });
        }
    }
    else{
        year=$('#MONTH').val().substring(0,4);
        month=$('#MONTH').val().substring(7,9);
        for(i=0;i<changed.length;i++){
            date=(parseInt(changed[i])>=parseInt("50"))?$('#DATE_'+changed[i]).val().substring(12) : changed[i];
            diary_content=$('#DIARY_'+changed[i]).val();
            type=(parseInt(changed[i])>=parseInt("50"))?"I":"U";
            
            $.ajax({
                type: "POST",
                url: "saveDiary.php",
                data : {"year" : year, "month" : month, "date" : date, "diary_content" : diary_content, "type" : type},
                dataType: "json",     
                //success: function(json) {
                //},
                error: function(xhr,status,error) {
                    console.log("ERROR!!!  "+error);
                }
            });
        }
    }
    
    initialData();
}

function deleteDiary(id){
    var year, month, date;
    if(nowMode=="D"){
        month=$('#DATE').val().substring(0,2);
        date=$('#DATE').val().substring(5,7);
        year=id.parentNode.id;
        
        $.ajax({
            type: "POST",
            url: "deleteDiary.php",
            data : {"year" : year, "month" : month, "date" : date},
            dataType: "json",     
            success: function(json) {
                getDiary();
            }
        });
    }
    else{
        year=$('#MONTH').val().substring(0,4);
        month=$('#MONTH').val().substring(7,9);
        date=id.parentNode.id;
        
        $.ajax({
            type: "POST",
            url: "deleteDiary.php",
            data : {"year" : year, "month" : month, "date" : date},
            dataType: "json",     
            success: function(json) {
                getDiaryByMonth();
            }
        });
    }
}

function changeNote(id){
    var input=id.id.replace("DIARY_", "").replace("YEAR_", "").replace("DATE_", "");
    if(changed.indexOf(input)<0){
        changed.push(input);
    }
}

function initialData(){
    changed=[];
    if(nowMode=="D"){
        addCount=0;
    }
    else{
        addCount=50;
    }
}

function goto(position){
    if(position=="pageTop"){
        $("html,body").animate({scrollTop: $("#page-content-wrapper").offset().top});
        //$(document).scrollTop( $("#page-content-wrapper").offset().top ); 
    }
    else{
        if(typeof($("#"+position).offset()) === "undefined"){
            $("html,body").animate({scrollTop: $("#page-content-wrapper").offset().top});
        }
        else{
            $("html,body").animate({scrollTop: $("#"+position).offset().top});
            //$(document).scrollTop( $("#"+position).offset().top ); 
        }
    }
}

function refreshScrollSpy() {
    $('[data-spy="scroll"]').each(function () {
        $(this).scrollspy('refresh');
    }); 
}

function changeLanguage() {
	var i18n = $.i18n();
	
	i18n.locale = language;
	i18n.load( './js/i18n/' + i18n.locale + '.json', i18n.locale ).done(
		function() {
            $('.sidebar-brand').html('<a href="">'+$.i18n( "title" )+'</a>');
            $('#VIEW_MODE').html($.i18n( "viewMode" ));
            $('#DATE_MODE').html('<a>　'+$.i18n( "viewByDate" )+'</a>');
            $('#MONTH_MODE').html('<a>　'+$.i18n( "viewByMonth" )+'</a>');
            $('#DATE_TITLE').html($.i18n( "date" ));
            $('#YEARS').html($.i18n( "years" ));
            $('#MONTH_TITLE').html($.i18n( "month" ));
            $('#DATES').html($.i18n( "dates" ));
            $('#ADD').html($.i18n( "add" ));
            $('#SAVE').html($.i18n( "save" ));
            $('#CLEAR').html($.i18n( "clear" )+' / '+$.i18n( "refresh" ));
            $('#NO_RECORD').html($.i18n( "noRecord" ));
            $('#LANGUAGE').html($.i18n( "language" ));
            $('#TOP_BTN').html($.i18n( "top" ));
            $('.DAY0').html($.i18n( "day0" ));
            $('.DAY1').html($.i18n( "day1" ));
            $('.DAY2').html($.i18n( "day2" ));
            $('.DAY3').html($.i18n( "day3" ));
            $('.DAY4').html($.i18n( "day4" ));
            $('.DAY5').html($.i18n( "day5" ));
            $('.DAY6').html($.i18n( "day6" ));
		} );
}

function getDay(year, month, date){
    var today=new Date();
	today.setFullYear(year, month-1, date);
	
	return 'DAY'+today.getDay();
}
