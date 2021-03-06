/**
 * Created by PC on 2016/4/15.
 */
/**
 * 原飞船的升级版，第二代
 * @param message
 * @constructor
 */
SpaceShip2 = function(message){
    SpaceShip.call(this,message);
    this.speed = message.speed/this.radius;
    this.consume = message.consume;
    this.supplyRate = message.supplyRate;
};

Util.inherits(SpaceShip2,SpaceShip);

/**
 * 升级飞船的接收函数，使其能够接收二进制码
 * @constructor
 */
SpaceShip2.prototype.ReceiveCommand = function(message){
    //消息解码
    message = Adapter.Decode(message);
    //调用父类的此方法
    SpaceShip.prototype.ReceiveCommand.call(this,message);
};

/**
 * 升级飞船的飞行函数
 * @constructor
 */
SpaceShip2.prototype.Fly = function(){
    if(this.energy<=0){
        this.status = 'stop';
    }
    if(this.status == 'fly' && this.energy>0){
        this.degree += this.speed;
        this.node.style.transform = 'rotate('+this.degree+'rad)';

        this.energy = this.energy-this.consume;
    }else if(this.energy<100){
        this.energy = this.energy+this.supplyRate;
    }

    this.node.firstElementChild.firstElementChild.innerHTML =this.id + '号-' + Math.floor(this.energy) +'%';
    this.node.firstElementChild.lastElementChild.style.width =(100-this.energy) +'%';
};