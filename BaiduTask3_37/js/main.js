/**
 * Created by PC on 2016/4/22.
 */
var PopupLayer = function(config){
    this.popupNode = document.getElementById(config.id);
    this.popupNode.addEventListener('click',(function(){
        var className = event.target.className;
        if(className === 'popup' || className === 'close'){
            this.close();
        }else if(className === 'ok'){
            config.success();
            this.close();
        }else if(className === 'cancel'){
            config.fail();
            this.close();
        }
    }).bind(this));
};

PopupLayer.prototype.popup = function(){
    this.popupNode.style.display = 'block';
};

PopupLayer.prototype.close = function(){
    this.popupNode.style.display = 'none';
};

function Init(){
    var popup = new PopupLayer({
        id:'popup',
        success:function(){
            alert('成功！');
        },
        fail:function(){
            alert('失败')
        }
    });
    document.getElementById('show').addEventListener('click',function(){
        popup.popup();
    });
}

Init();