/**
 * Created by PC on 2016/4/16.
 */
/**
 * 封装需要验证的控件
 * @param id
 * @constructor
 */
function ValControl(id){
    Util.extend(this,Validator);

    //表单控件和提示控件
    this.inputCtl = document.getElementById(id);
    this.tipCtl = this.inputCtl.parentElement.lastElementChild;

    //验证类型
    this.type =this.inputCtl.dataset.type;
    //验证名称
    this.name = this.inputCtl.dataset.name;
    //提示
    this.tipText = this.inputCtl.dataset.tiptext;

    //事件绑定
    this.inputCtl.addEventListener('focus',this.showTip());
    this.inputCtl.addEventListener('blur',this.loseFocus());
}

/**
 * 控件获得焦点，显示提示
 * @returns {Function}
 */
ValControl.prototype.showTip = function(){
    var inputCtl = this.inputCtl;
    var tipCtl = this.tipCtl;
    var tipText = this.tipText;

    return function () {
        tipCtl.innerText = tipText;
        tipCtl.style.display = 'block';
        tipCtl.style.color = 'rgba(102,175,233,1)';

        inputCtl.style.borderColor = 'rgba(102,175,233,1)';
        inputCtl.style.boxShadow='inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)';
    }
};

ValControl.prototype.check = function(){
    var data = {
        type:this.type,
        value:this.inputCtl.value.trim()
    };
    var compare = this.inputCtl.dataset.compare;
    if(compare != null){
        var compareValue = document.getElementById(compare).value.trim();
        data.value = [this.inputCtl.value.trim(), compareValue];
    }

    return message = this.validate(data);
};

ValControl.prototype.getResult = function(){
    var message = this.check();

    if(this.canBeEmpty(message)){
        return true;
    }else{
        return !this.hasErrors(message);
    }
};

/**
 * 控件失去焦点，验证数据
 * @returns {Function}
 */
ValControl.prototype.loseFocus = function(){
    var that = this;

    return function(){
        var inputCtl = that.inputCtl;
        var tipCtl = that.tipCtl;
        var message = that.check();

        var canEmpty = that.canBeEmpty(message);
        if(canEmpty){
            tipCtl.style.display = 'none';

            inputCtl.style.borderColor = '#aaa';
            inputCtl.style.boxShadow='inset 0 1px 1px rgba(0,0,0,.075)';
            return;
        }

        var isError = that.hasErrors(message);
        if(!isError){
            tipCtl.innerText =  that.config[that.type].text+ " 格式正确";
            tipCtl.style.display = 'block';
            tipCtl.style.color = 'rgba(99, 185, 77,1)';

            inputCtl.style.borderColor = 'rgba(99, 185, 77,1)';
            inputCtl.style.boxShadow="inset 0 1px 1px rgba(0,0,0,.075)";
        }else{
            tipCtl.innerText = message;
            tipCtl.style.display = 'block';
            tipCtl.style.color = 'rgba(219, 6, 30,1)';

            inputCtl.style.borderColor = 'rgba(219, 6, 30,1)';
            inputCtl.style.boxShadow="inset 0 1px 1px rgba(0,0,0,.075)";
        }
    };
};


