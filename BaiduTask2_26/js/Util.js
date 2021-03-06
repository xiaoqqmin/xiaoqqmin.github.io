/**
 * Created by PC on 2016/4/15.
 */
Util = {
    //飞船飞行动画
    Animation:function(){
        setInterval(function(){
            for(var i=0;i<Mediator.ships.length;i++){
                if(Mediator.ships[i]!=null){
                    Mediator.ships[i].Fly();
                }
            }
        },100);
    },
    //记录日志
    Log:function(message,color,type){
        var logWindow = document.getElementById('log');
        var mes = document.createElement('P');
        mes.innerHTML =  '<span>'+this.GetNowTime()+":</span>  "+type+" "+message.cmd+" "+message.id+"号飞船";
        mes.style.color = color;
        logWindow.appendChild(mes);
        logWindow.scrollTop = logWindow.scrollHeight;
    },
    //获取当前时间
    GetNowTime:function(){
        var dtCur = new Date();
        var yearCur = dtCur.getFullYear();
        var monCur = dtCur.getMonth() + 1;
        var dayCur = dtCur.getDate();
        var hCur = dtCur.getHours();
        var mCur = dtCur.getMinutes();
        var sCur = dtCur.getSeconds();
        timeCur = yearCur + "-" + (monCur < 10 ? "0" + monCur : monCur) + "-"
            + (dayCur < 10 ? "0" + dayCur : dayCur) + " " + (hCur < 10 ? "0" + hCur : hCur)
            + ":" + (mCur < 10 ? "0" + mCur : mCur) + ":" + (sCur < 10 ? "0" + sCur : sCur);
        //alert(timeCur);// 输出时间
        return timeCur;
    }

};