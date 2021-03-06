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
    },
    isPlainObject: function (obj) {
        var key;
        var class2type = {};
        var hasOwn = class2type.hasOwnProperty;

        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || typeof obj !== 'object' || obj.nodeType) {
            return false;
        }

        // Not own constructor property must be Object
        var hasNoOwn = !hasOwn.call(obj, 'constructor');
        var hasNoOwnPrototypeOf = !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
        if (obj.constructor && hasNoOwn && hasNoOwnPrototypeOf) {
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        for (key in obj) {}

        return key === undefined || hasOwn.call(obj, key);
    },
    /**
     * 深度扩展一个对象
     */
    extend: function (destination, source) {
        var i,
            toStr = Object.prototype.toString,
            astr = '[object Array]';
        destination = destination || {};
        for (i in source) {
            if (source.hasOwnProperty(i)) {
                if (Util.isPlainObject(source[i])) {
                    destination[i] = (toStr.call(source[i]) === astr) ? [] : {};
                    Util.extend(destination[i], source[i]);
                    destination[i] = source[i];
                } else {
                    destination[i] = source[i];
                }
            }
        }
        return destination;
    },
    /**
     * 为类型构造器建立继承关系
     * @name baidu.lang.inherits
     * @function
     * @grammar baidu.lang.inherits(subClass, superClass[, className])
     * @param {Function} subClass 子类构造器
     * @param {Function} superClass 父类构造器
     * @remark
     *
     使subClass继承superClass的prototype，因此subClass的实例能够使用superClass的prototype中定义的所有属性和方法。<br>
     这个函数实际上是建立了subClass和superClass的原型链集成，并对subClass进行了constructor修正。<br>
     <strong>注意：如果要继承构造函数，需要在subClass里面call一下，具体见下面的demo例子</strong>
     * @shortcut inherits
     * @meta standard
     */
    inherits: function (subClass, superClass) {
        var key;
        var proto;
        var selfProps = subClass.prototype;
        var Clazz = new Function();
        Clazz.prototype = superClass.prototype;
        proto = subClass.prototype = new Clazz();
        for (key in selfProps) {
            proto[key] = selfProps[key];
        }
        subClass.prototype.constructor = subClass;
        subClass.superClass = superClass.prototype;
    }

};