$(function(){
    var ladder;
    var ladder_canvas;    
    var heightNode = 10;
    var widthNode =  0;
    var LADDER_NODE = {};
    var row =0;
    var GLOBAL_FOOT_PRINT= {};
    var GLOBAL_CHECK_FOOT_PRINT= {};
    var working = false;
        
    const WORD_KR = {
        title:"사다리게임",
        join:"참가자수",
        min_msg:"게임을 하기위해서는 2이상을 입력해야합니다.",
        max_msg:"입력가능한 갯수는 10개까지 입니다.",
        noNumber_msg:"숫자를 입력해주세요."
    };
    
    const WORD_JP = {
        title:"あみだくじ",
        join:"参加者数",
        min_msg:"ゲームをするためには、２以上の数字を入力してください。",
        max_msg:"入力可能な個数は１０個までです。",
        noNumber_msg:"数字を入力してください。"
    };
    
    var WORD = WORD_JP;
    initWord(WORD);

    function initWord(word){
        $('#join').html(word.join);
        $('#title').html(word.title);
    }
    function init(){
        heightNode = 10;
        LADDER_NODE = {};
        row =0;
        GLOBAL_FOOT_PRINT= {};
        GLOBAL_CHECK_FOOT_PRINT= {};
        working = false;
        canvasDraw();
    }
    $('.language').click(function(){
        let id = $(this).attr('id'); 
        if(id === "jp"){
            WORD = WORD_JP;
        } else {
            WORD = WORD_KR;
        }
        initWord(WORD);
    });
    $('#start').click(function(){
        let member = $('input[name=member]').val();
        if(isNaN(member)){
            return alert(WORD.noNumber_msg)
        }
        if(member < 2){
            return alert(WORD.min_msg);
        }
        if(member > 10){
            return alert(WORD.max_msg);   
        }
        widthNode = member;
        console.log("member:"+widthNode);
        setTimeout(function(){
            $('#back').show();
            $('#landing').hide();
            init();
        }, 310);

    });
    $('#back').click(function(){
        ladder.html('');
        setTimeout(function(){
            $("#ladder").hide();
            $('#landing').show();
        }, 310);
    });

    function canvasDraw(){
        ladder = $('#ladder');
        ladder.show();
        ladder.html('<div class="dim"></div><canvas class="ladder_canvas" id="ladder_canvas"></canvas>');        
        ladder_canvas = $('#ladder_canvas');
        ladder.css({
            'width' :( widthNode-1) * 100 + 6,
            'height' : (heightNode -1 ) * 25 + 6,
            'background-color' : '#fff'
        });
       ladder_canvas
       .attr('width' , ( widthNode-1) * 100 + 6)
       .attr('height' , ( heightNode-1) * 25 + 6);

        setDefaultFootPrint();
        reSetCheckFootPrint();
        setDefaultRowLine();
        setRandomNodeData();
        drawDefaultLine();
        drawNodeLine();
        userSetting();
        resultSetting();
        
    }
    var userName = "";
    $(document).on('click', 'button.ladder-start', function(e){
        if(working){
            return false;
        }
        $('.dim').remove();
        working = true;
        reSetCheckFootPrint();
        var _this = $(e.target);
        _this.attr('disabled' ,  true).css({
            'color' : '#000',
            'border' : '1px solid #F2F2F2',
            'opacity' : '0.3'
        })
        var node = _this.attr('data-node');
        var color =  _this.attr('data-color');
        startLineDrawing(node, color);
        userName =  $('input[data-node="'+node+'"]').val();
    })
    
    function startLineDrawing(node , color){

        var node = node;
        var color = color;
        
        var x = node.split('-')[0]*1;
        var y = node.split('-')[1]*1;
        var nodeInfo = GLOBAL_FOOT_PRINT[node];

        GLOBAL_CHECK_FOOT_PRINT[node] = true;
        
        var dir = 'r'
        if(y ==heightNode ){
            reSetCheckFootPrint();
            var target = $('input[data-node="'+node+'"]');
            target.css({
                'background-color' : color
            })
            $('#' + node + "-user").text(userName)
             working = false;
            return false;
        }
        if(nodeInfo["change"] ){
            var leftNode = (x-1) + "-" +y;
            var rightNode = (x+1) + "-" +y;
            var downNode = x +"-"+ (y + 1);
            var leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
            var rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
                
            if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                var leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
                var rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
                if(  (leftNodeInfo["change"] &&  leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (rightNodeInfo["change"])&&  leftNodeInfo["draw"]  && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    //Left우선 
                    console.log("중복일때  LEFT 우선");
                    stokeLine(x, y, 'w' , 'l' , color ,3)
                     setTimeout(function(){ 
                         return startLineDrawing(leftNode, color)
                     }, 100);
                }
                else if(  (leftNodeInfo["change"] &&  !!!leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (rightNodeInfo["change"]) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    console.log('RIGHT 우선')
                    stokeLine(x, y, 'w' , 'r' , color ,3)
                    console.log("right")
                    setTimeout(function(){ 
                        return startLineDrawing(rightNode, color)
                     }, 100);
                }
                else if(  (leftNodeInfo["change"] &&  leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (!!!rightNodeInfo["change"]) ){
                    //Left우선 
                    console.log("LEFT 우선");
                    stokeLine(x, y, 'w' , 'l' , color ,3)
                     setTimeout(function(){ 
                         return startLineDrawing(leftNode, color)
                     }, 100);
                }
                 else if(  !!!leftNodeInfo["change"]  &&  (rightNodeInfo["change"]) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    //Right우선 
                    console.log("RIGHT 우선");
                    stokeLine(x, y, 'w' , 'r' , color ,3)
                     setTimeout(function(){ 
                         return startLineDrawing(rightNode, color)
                     }, 100);
                }
                else{
                    console.log('DOWN 우선')
                    stokeLine(x, y, 'h' , 'd' , color ,3)
                    setTimeout(function(){ 
                       return startLineDrawing(downNode, color)
                    }, 100);
                }
            }else{
                console.log('else')
               if(!!!GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                    /// 좌측라인
                    console.log('좌측라인')
                    if(  (rightNodeInfo["change"] && !!!rightNodeInfo["draw"] ) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                        //Right우선 
                        console.log("RIGHT 우선");
                        stokeLine(x, y, 'w' , 'r' , color ,3)
                        setTimeout(function(){ 
                            return startLineDrawing(rightNode, color)
                        }, 100);
                    }else{
                        console.log('DOWN')
                        stokeLine(x, y, 'h' , 'd' , color ,3)
                        setTimeout(function(){ 
                           return startLineDrawing(downNode, color)
                        }, 100);
                    }
                    
               }else if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && !!!GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                    /// 우측라인
                    console.log('우측라인')
                    if(  (leftNodeInfo["change"] && leftNodeInfo["draw"] ) && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ){
                        //Right우선 
                        console.log("LEFT 우선");
                        stokeLine(x, y, 'w' , 'l' , color ,3)
                        setTimeout(function(){ 
                            return startLineDrawing(leftNode, color)
                        }, 100);
                    }else{
                        console.log('DOWN')
                        stokeLine(x, y, 'h' , 'd' , color ,3)
                        setTimeout(function(){ 
                           return startLineDrawing(downNode, color)
                        }, 100);
                    }
               }
            }


        }else{
            console.log("down")
            var downNode = x +"-"+ (y + 1);
            stokeLine(x, y, 'h' , 'd' , color ,3)
            setTimeout(function(){ 
                return startLineDrawing(downNode, color)
             }, 100);
        }
    }



    function userSetting(){
        var userList = LADDER_NODE[0];
        console.log('userList:'+userList);
        var html = '';
        for(var i=0; i <  userList.length; i++){
            var color = '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] + (c && lol(m,s,c-1));})(Math,'0123456789ABCDEF',4);

            var x = userList[i].split('-')[0]*1;
            var y = userList[i].split('-')[1]*1;
            var left = x * 100  -30
            html += '<div class="user-wrap" style="left:'+left+'"><input type="text" data-node="'+userList[i]+'"><button class="ladder-start" style="background-color:'+color+'" data-color="'+color+'" data-node="'+userList[i]+'"></button>';
            html +='</div>'
        }
        ladder.append(html);
    }
    function resultSetting(){
         var resultList = LADDER_NODE[heightNode-1];
         console.log(resultList )

        var html = '';
        for(var i=0; i <  resultList.length; i++){
            
            var x = resultList[i].split('-')[0]*1;
            var y = resultList[i].split('-')[1]*1 + 1;
            var node = x + "-" + y;
            var left = x * 100  -30
            html += '<div class="answer-wrap" style="left:'+left+'"><input type="text" data-node="'+node+'">';
            html +='<p id="'+node+'-user"></p>'
            html +='</div>'
        }
        ladder.append(html);
    }

    function drawNodeLine(){

        for(var y =0; y < heightNode; y++){
            for(var x =0; x <widthNode ; x++){
                var node = x + '-' + y;
                var nodeInfo  = GLOBAL_FOOT_PRINT[node];
                if(nodeInfo["change"] && nodeInfo["draw"] ){
                     stokeLine(x, y ,'w' , 'r' , '#ddd' , '2')
                }else{

                }
            }
        }
    }

    function stokeLine(x, y, flag , dir , color , width){
        var canvas = document.getElementById('ladder_canvas');
        var ctx = canvas.getContext('2d');
        var moveToStart =0, moveToEnd =0, lineToStart =0 ,lineToEnd =0; 
        var eachWidth = 100; 
        var eachHeight = 25;
        if(flag == "w"){
            //가로줄
           
           
            if(dir == "r"){
                ctx.beginPath();
                moveToStart = x * eachWidth ;
                moveToEnd = y * eachHeight ;
                lineToStart = (x+ 1) * eachWidth;
                lineToEnd = y * eachHeight;
                
            }else{
                // dir "l"
                 ctx.beginPath();
                moveToStart = x * eachWidth;
                moveToEnd = y * eachHeight;
                lineToStart = (x- 1) * eachWidth;
                lineToEnd = y * eachHeight;
            }
        }else{
                ctx.beginPath();
                moveToStart = x * eachWidth ;
                moveToEnd = y * eachHeight;
                lineToStart = x * eachWidth ;
                lineToEnd = (y+1) * eachHeight;
        }

        ctx.moveTo(moveToStart + 3 ,moveToEnd  + 2);
        ctx.lineTo(lineToStart  + 3 ,lineToEnd  + 2 );
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.closePath();
    }

    function drawDefaultLine(){
        var html = '';
        html += '<table>'
         for(var y =0; y < heightNode-1; y++){
            html += '<tr>';
            for(var x =0; x <widthNode-1 ; x++){
                html += '<td style="width:98px; height:25px; border-left:2px solid #ddd; border-right:2px solid #ddd;"></td>';
            }
            html += '</tr>';
        }
        html += '</table>'
        ladder.append(html);
    }

    function setRandomNodeData(){
         for(var y =0; y < heightNode; y++){
            for(var x =0; x <widthNode ; x++){
                var loopNode = x + "-" + y;
                var rand = Math.floor(Math.random() * 2);
                if(rand == 0){
                    GLOBAL_FOOT_PRINT[loopNode] = {"change" : false , "draw" : false}
                }else{
                    if(x == (widthNode - 1)){
                        GLOBAL_FOOT_PRINT[loopNode] = {"change" : false , "draw" : false} ;    
                    }else{
                        GLOBAL_FOOT_PRINT[loopNode] =  {"change" : true , "draw" : true} ;  ;
                        x = x + 1;
                         loopNode = x + "-" + y;
                         GLOBAL_FOOT_PRINT[loopNode] =  {"change" : true , "draw" : false} ;  ;
                    }
                }
            }
         }
    }

    function setDefaultFootPrint(){
      
        for(var r = 0; r < heightNode; r++){
            for(var column =0; column < widthNode; column++){
                GLOBAL_FOOT_PRINT[column + "-" + r] = false;
            }
        }
    }
    function reSetCheckFootPrint(){

        for(var r = 0; r < heightNode; r++){
            for(var column =0; column < widthNode; column++){
                GLOBAL_CHECK_FOOT_PRINT[column + "-" + r] = false;
            }
        }
    }

    function setDefaultRowLine(){

        for(var y =0; y < heightNode; y++){
            var rowArr = [];
            for(var x =0; x <widthNode ; x++){
                var node = x + "-"+ row;
                rowArr .push(node);
                // 노드그리기
                var left = x * 100;
                var top = row * 25;
                var node = $('<div></div>')
                .attr('class' ,'node')
                .attr('id' , node)
                .attr('data-left' , left)
                .attr('data-top' , top)
                .css({
                    'position' : 'absolute',
                    'left' : left,
                    'top' : top
                });
                ladder.append(node);
             }
             LADDER_NODE[row] =  rowArr;
             row++;
        }
    }



});
