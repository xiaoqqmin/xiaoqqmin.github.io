/**
 * Created by PC on 2016/4/14.
 */
Mediator = {
    ships:[null,null,null,null],
    BroadCast:function(message){
        setTimeout(function(){
            if(Math.random()>0.3){
                //将命令广播给所有飞船
                if(message.cmd === "Create"){
                    Mediator.AddShip(message);
                }else{
                    for(var i=0;i<Mediator.ships.length;i++){
                        if(Mediator.ships[i]!=null){
                            Mediator.ships[i].ReceiveCommand(message);
                        }
                    }
                }

                if(message.cmd === "Destroy"){
                    Mediator.RemoveShip(message);
                }
                Util.Log(message,'green','命令传送成功');
            }else{
                Util.Log(message,'#f00','命令传送失败');
            }
        },1000);
    },
    AddShip:function(message){
        this.ships[message.id-1] = new SpaceShip(message);
    },
    RemoveShip:function(message){
        this.ships[message.id-1] = null;
    },
    Make:function(o){
        for(var i in this){
            o[i]=this[i];
        }
    }
};

