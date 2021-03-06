/**
 * Created by PC on 2016/4/12.
 */


var queue = [];

function Render(){
/*    var dom = document.getElementsByClassName('outer')[0];
    var text = '';
    for(var i=0;i<queue.length;i++){
        text += '<div>'+queue[i]+'</div>';
    }
    dom.innerHTML = text;*/
    //使用数组的map函数构造html
    document.getElementsByClassName('outer')[0].innerHTML=
        queue.map(function(d){return '<div>'+d+'</div>';}).join('');
}

function getNum(){
    var dom = document.getElementById('number');
    return dom.value;
}

function leftIn(){
    var value = getNum();
    if(!value.match(/^[0-9]+$/)){
        alert('必须输入数字！');
        return;
    }
    queue.unshift(Number(value));
    Render();
}

function rightIn(){
    var value = getNum();
    if(!value.match(/^[0-9]+$/)){
        alert('必须输入数字！');
        return;
    }
    queue.push(Number(value));
    Render();
}

function leftOut(){
    queue.shift();
    Render();
}

function rightOut(){
    queue.pop();
    Render();
}

function clickOut(index){
    queue.splice(index,1);
    Render();
}

function Init(){
    //测试数据
    queue.push(2);
    queue.push(5);
    queue.push(87);

    //事件绑定
    document.getElementById('left-in').addEventListener('click',leftIn);
    document.getElementById('right-in').addEventListener('click',rightIn);
    document.getElementById('left-out').addEventListener('click',leftOut);
    document.getElementById('right-out').addEventListener('click',rightOut);
    document.getElementsByClassName('outer')[0].addEventListener('click',function(e){
        var node = e.target;
        if(!node.className.match('outer')){
            clickOut(Array.prototype.indexOf.call(node.parentNode.childNodes,node));
        }
    });

    Render();
}

Init();