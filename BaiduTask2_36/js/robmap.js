/**
 * Created by PC on 2016/4/18.
 * 地图
 */
var RobotMap = function(){
    this.mapNode = document.getElementById('rob-map').children[0];
    this.mapNode.addEventListener('mousemove',this.mouseMove.bind(this));
    this.mapNode.addEventListener('mouseout',this.mouseOut.bind(this));
    this.mapNode.addEventListener('click',this.click.bind(this));

    document.getElementById('clear-wall').addEventListener('click',this.clearWall.bind(this));

    //屏蔽右键菜单
    this.mapNode.oncontextmenu = function (){
        return false;
    };
};

RobotMap.prototype.mouseMove = function(){
    var td = event.target;
    if(td.tagName !== 'TD'){
        return;
    }

    var x = [].indexOf.call(td.parentElement.children,td);
    var y = [].indexOf.call(td.parentElement.parentElement.children,td.parentElement);
    if(x == 0 || y ==0){
        return;
    }
    if(!td.dataset.wall)
        td.style.backgroundColor = '#bbb';
    else{
        td.style.opacity = '0.7';
    }
};

RobotMap.prototype.mouseOut = function(){
    var td = event.target;
    if(td.tagName !== 'TD'){
        return;
    }

    var x = [].indexOf.call(td.parentElement.children,td);
    var y = [].indexOf.call(td.parentElement.parentElement.children,td.parentElement);
    if(x == 0 || y ==0){
        return;
    }
    if(!td.dataset.wall)
        td.style.backgroundColor = '';
    else{
        td.style.opacity = '';
    }
};

RobotMap.prototype.click = function(){
    var td = event.target;
    if(td.tagName !== 'TD'){
        return;
    }

    var x = [].indexOf.call(td.parentElement.children,td);
    var y = [].indexOf.call(td.parentElement.parentElement.children,td.parentElement);
    if(x == 0 || y ==0){
        return;
    }

    if(td.dataset.wall === '1'){
        td.dataset.wall = '0';
        td.style.backgroundColor = '';
    }else{
        td.dataset.wall = '1';
        td.style.backgroundColor = '#5cb85c';
    }

/*    //鼠标左键，标记为墙体
    if(event.button === 0){

    }else if(event.button === 2){//鼠标右键，去除墙体标记

    }*/
};

//根据坐标寻找单元格
RobotMap.prototype.findCell = function(x,y){
    if(x==0 || y==0){
        throw('warning  未找到单元格');
    }
    var cell = this.mapNode.children[y].children[x];
    if(!cell){
        throw('warning  未找到单元格');
    }
    return cell;
};

//设置单元格为墙
RobotMap.prototype.setWall = function(x,y){
    var cell = this.findCell(x,y);

    if(cell.dataset.wall){
        throw('warning  单元格已经为墙体！');
    }else{
        cell.dataset.wall = '1';
        cell.style.backgroundColor = '#bbb';
    }
};

//查询x,y处是否为墙体
RobotMap.prototype.isWall = function(x,y){
    x++;
    y++;
    var cell = this.findCell(x,y);
    return cell.dataset.wall;
};

RobotMap.prototype.getWall = function(){
    var walls = [];
    for(var i=0;i<20;i++){
        walls[i] = [];
        for(var j=0;j<20;j++) {
            var cell =  this.findCell(j+1,i+1);
            if(cell.dataset.wall === '1'){
                walls[i][j] = 1;
            }else{
                walls[i][j] = 0;
            }
        }
    }
    return walls;
};

//给墙体上色
RobotMap.prototype.setColor = function(x,y,color){
    var cell = this.findCell(x,y);

    if(!cell.dataset.wall){
        throw('warning 单元格不为墙体！');
    }else{
        cell.style.backgroundColor = color;
    }
};

//清除所有墙
RobotMap.prototype.clearWall = function(){
    for(var i=1;i<21;i++){
        for(var j=1;j<21;j++) {
            var td =  this.findCell(j,i);
            td.style.background = '';
            td.dataset.wall = '0';
        }
    }
};


















