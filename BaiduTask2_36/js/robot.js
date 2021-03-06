/**
 * Created by PC on 2016/4/18.
 */
//朝向，上、右、下、左
var Direction = {
    TOP:0,
    RIG:1,
    BOT:2,
    LEF:3
};

var Robot = function(){
    this.node = document.getElementById('robot');
    this.direction = Direction.TOP;
    this.X = 0;
    this.Y = 0;
    this.rotate = 0;
    this.taskQueue = [];
    this.isRunning = false;
    this.duration = 250;
    this.map = new RobotMap();
    this.rotate = 0;

    document.getElementById('duration').addEventListener('change',this.changeDuration.bind(this));
};

//指令执行完毕之后更新界面状态
Robot.prototype.updateRobot = function(){
    //更改旋转状态
    var currentDir = (this.rotate/90)%4;
    var dDir = this.direction - currentDir;
    if(dDir == -3){
        dDir = 1;
    }else if(dDir == 3){
        dDir = -1;
    }
    this.rotate += dDir*90;
    this.node.style.transform = 'rotate('+this.rotate+'deg)';

    if(this.X<0){
        this.X=0;
    }else if(this.X>19){
        this.X = 19;
    }
    if(this.Y<0){
        this.Y=0;
    }else if(this.Y>19){
        this.Y = 19;
    }
    this.node.style.left = this.X * 40+'px';
    this.node.style.top = this.Y * 40+'px';
};

//执行指令
Robot.prototype.exec = function(order,callback){
    var that = this;
    function task() {
        //判断是否包含注释，以“//”这个形式
        if (order.match(/\/\//)) {
            order = order.split(/\/\//)[0];
        }

        //分割指令并且转为英文大写
        var orders = order.trim().split(/\s+/).map(function (d) {
            return d.toUpperCase()
        });
        var arg = [];


        //判断数组最后一项是否为数字或者坐标，如果是则取出
        if (orders[orders.length - 1].match(/^[1-9]?[0-9]$|^\d+,\d+$/)) {
            var temp = orders.splice(orders.length - 1, 1);
            arg = temp[0].split(',').map(function (t) {
                return parseInt(t);
            })
        } else if (orders[0] === 'BRU') {//判断是不是涂色命令
            arg = orders.splice(orders.length - 1, 1);
        }

        var method = that.method;
        for(var n=0;n<orders.length;n++){
            method = method[orders[n]];
            if(!method){
                throw('error 未找到命令"'+orders.join(' ')+'"');
            }
        }

        if(typeof method === 'function'){
            //执行函数
            try{
                method.apply(that,arg);
            }finally{
                that.updateRobot();
            }

        }else{
            throw('error 未找到命令"'+orders.join(' ')+'"');
        }
    }

    this.taskQueue.push({
        func: task, callback: function (exception) {
            if(callback){
                if (exception) {
                    callback.fail(exception)
                } else {
                    callback.success();
                }
            }
        }
    });

    if(!this.isRunning){
        this.execAll();
    }
};

Robot.prototype.execAll = function(){
    if(this.isRunning){
        var task = this.taskQueue.shift();
    }else{
        //首次执行先延迟400ms
        setTimeout(this.execAll.bind(this), this.duration);
        this.isRunning = true;
        return;
    }

    if(task){
        try{
            task.func();
            task.callback();
            setTimeout(this.execAll.bind(this), this.duration);
        }catch(err){
            if(typeof err === "object"){
                err = err.message;
            }
            if(err && err.match('warning')){
                task.callback(err);
                setTimeout(this.execAll.bind(this), this.duration);
            }else{
                this.isRunning = false;
                this.taskQueue = [];
                task.callback(err);
            }
        }
    }else {
        this.isRunning = false
    }
};

//检测是否碰到边框
Robot.prototype.checkBorder = function(){
    if(this.X<0 || this.X>19 || this.Y<0 || this.Y>19){
        throw('warning 方块碰撞到了边框');
    }
};

//检测是否碰到边框
Robot.prototype.checkWall = function(direction,step){
    step = step || 1;
    for(var i=1;i<=step;i++){
        var xy = this.calPosition(direction,this.X,this.Y,i);
        if(this.map.isWall.apply(this.map,xy)){
            throw('warning 路径上有墙体，无法到达');
        }
    }
};

//根据方向计算位置
Robot.prototype.calPosition =function(direction,x,y,step){
    step = step || 1;
    var dx = [0,1,0,-1];
    var dy = [-1,0,1,0];
    x += dx[direction]*step;
    y += dy[direction]*step;

    return [x,y];
};

//指令
Robot.prototype.method = {
    //前进
    GO:function (step){
        this.checkWall(this.direction,step);
        var xy = this.calPosition(this.direction,this.X,this.Y,step);
        this.X = xy[0];
        this.Y = xy[1];
        this.checkBorder();
    },
    //旋转
    TUN:{
        LEF:function (){
            this.direction =  (--this.direction+4)%4;
        },
        RIG:function (){
            this.direction =  (++this.direction)%4;
        },
        BAC:function (){
            this.method.TUN.LEF.call(this);
            this.method.TUN.LEF.call(this);
        }
    },
    //移动，方向不变
    TRA:{
        LEF:function (step){
            this.checkWall(Direction.LEF,step);
            this.X -= step || 1;
            this.checkBorder();
        },
        RIG:function (step){
            this.checkWall(Direction.RIG,step);
            this.X += step || 1;
            this.checkBorder();
        },
        TOP:function (step){
            this.checkWall(Direction.TOP,step);
            this.Y -= step || 1;
            this.checkBorder();
        },
        BOT:function (step){
            this.checkWall(Direction.BOT,step);
            this.Y += step || 1;
            this.checkBorder();
        }
    },
    //移动，方向改变
    MOV:{
        LEF:function (step){
            this.checkWall(Direction.LEF,step);
            this.direction = Direction.LEF;
            this.X -= step || 1;
            this.checkBorder();
        },
        RIG:function (step){
            this.checkWall(Direction.RIG,step);
            this.direction = Direction.RIG;
            this.X += step || 1;
            this.checkBorder();
        },
        TOP:function (step){
            this.checkWall(Direction.TOP,step);
            this.direction = Direction.TOP;
            this.Y -= step || 1;
            this.checkBorder();
        },
        BOT:function (step){
            this.checkWall(Direction.BOT,step);
            this.direction = Direction.BOT;
            this.Y += step || 1;
            this.checkBorder();
        },
        TO:function(x,y){
            var finder = new RobotFinder(20,20,this.map);
            var path = finder.BreadthFirstFinder(this.X,this.Y,x-1,y-1);
            var firstNode = path.splice(0,1)[0];

            path.forEach((function(p){
                var dx = firstNode[0] - p[0];
                var dy = firstNode[1] - p[1];
                if(dx == -1){
                     this.exec('MOV RIG');
                }else if(dx == 1){
                    this.exec('MOV LEF');
                }else if(dy == -1){
                    this.exec('MOV BOT');
                }else if(dy == 1){
                    this.exec('MOV TOP');
                }
                firstNode = p;
            }).bind(this));
        }
    },
    //修墙
    BUILD:function(){
        var x = this.X+1;
        var y = this.Y+1;
        switch (this.direction){
            case Direction.TOP:
                y--;
                break;
            case Direction.RIG:
                x++;
                break;
            case Direction.BOT:
                y++;
                break;
            case Direction.LEF:
                x--;
                break;
        }
        this.map.setWall(x,y);
    },
    //涂色
    BRU:function(value){
        var x = this.X+1;
        var y = this.Y+1;
        switch (this.direction){
            case Direction.TOP:
                y--;
                break;
            case Direction.RIG:
                x++;
                break;
            case Direction.BOT:
                y++;
                break;
            case Direction.LEF:
                x--;
                break;
        }
        this.map.setColor(x,y,value);
    }
};

Robot.prototype.changeDuration = function(){
    var value = event.target.value;
    this.duration = parseInt(value);
    this.node.style.transitionDuration = this.duration + 'ms';
};