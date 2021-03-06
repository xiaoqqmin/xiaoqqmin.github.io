/**
 * Created by PC on 2016/4/18.
 */

var rob = new Robot();
var edit = new RobotEdit();

function Init(){
    var startBtn = document.getElementById('start');
    startBtn.addEventListener('click',function(){
        var codes = edit.getCodes();
        edit.updateLine();

        codes.forEach((function(code,i){
            //命令执行成功或失败的回调函数
            var callback ={
                success:(function(i){
                    return function(){
                        edit.setFlag(i, 'success');
                        edit.clearPreFlag(i);
                    };
                })(i),
                fail: (function(i){
                    return function(err){
                        console.log(err);
                        if(err && err.match('warning')){
                            edit.setFlag(i, 'warning',err);
                        }else{
                            edit.setFlag(i, 'error',err);
                        }
                    };
                })(i)
            };

            if (code) {
                rob.exec(code,callback);
            }
        }).bind(this));
    });
}


Init();