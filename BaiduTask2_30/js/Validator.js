/**
 * Created by PC on 2016/4/16.
 * 利用策略模式
 */
var Validator = {
    types: {},
    config: {},

    /**
     * 验证数据
     * @param data
     * data.type: 数据类型
     * data.value: 被验证的数据
     * @returns 不服从验证规则的参数，如果正确则返回空
     */
    validate: function(data){
        var msg, item, validators, validatorItem, checker, result;
        msg = '';
        item = this.config[data.type];
        if(!item){
            return msg;
        }
        validators = item.validators;
        for(var v = 0; v < validators.length; v++){
            validatorItem = validators[v];

            //获取验证函数checker
            if(typeof validatorItem == 'string'){
                checker = this.types[validatorItem];
                if(!checker){
                    throw {
                        name: "ValidationError",
                        message: "No handler to validate type " + validators[v]
                    };
                }
            }else if(Array.isArray(validatorItem)){
                checker = this.types[validatorItem[0]];
                if(!checker){
                    throw {
                        name: "ValidationError",
                        message: "No handler to validate type " + validators[v]
                    };
                }
            }else{
                throw {
                    name: "ValidationError",
                    message: "No such validator *" + validatorItem + "* found."
                };
            }

            //判断传入对象是否为数组
            if(Array.isArray(data.value)){
                result = checker.validate.apply(null,data.value);
            }else{
                result = checker.validate(data.value);
            }

            if(!result){
                var msgType = typeof checker.message;
                if(msgType == 'string'){
                    msg = item.text + checker.message;
                }else if(msgType == 'function'){
                    msg = item.text + checker.message.call(null, this.config[validatorItem[1]].text);
                }
                break;
            }
        }
        return msg;
    },
    //检查是否有错误
    hasErrors: function(message){
        return message !== "";
    },
    //检查是否可以为空
    canBeEmpty:function(message){
        return /可以为空/.test(message);
    }
};

/**
 * 校验类型，包括校验函数和校验信息
 */
Validator.types = {

    isNotEmpty: {
        validate: function(value){
            return value !== "";
        },
        message: '不得为空'
    },

    isEmpty: {
        validate: function(value){
            return value !== "";
        },
        message: '可以为空'
    },

    isNotEqualTo: {
        validate: function(value1,value2){
            return value1 !== value2;
        },
        message: function(fieldText){
            return "不得与" + fieldText + "相同，请重新输入 ";
        }
    },

    isEqualTo: {
        validate: function(value1,value2){
            return value1 === value2;
        },
        message: function(fieldText){
            return "必须与" + fieldText + "相同，请重新输入 ";
        }
    },

    isValidName: {
        validate: function(value){
            var realLength = 0, len = value.length, charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = value.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) realLength += 1;
                else realLength += 2;
            }

            return realLength>=4 && realLength<=16;
        },
        message: "只能为 4-16 个字符"
    },

    isValidPassword:{
        validate:function(value){
            var length = value.length;
            return length>=8 && length<=20;
        },
        message: "长度必须在8~20之间"
    },

    isValidIdentity: {
        validate: function(value){
            return (/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i).test(value);
        },
        message: "输入不正确·"
    },

    isBirthEqualTo: {
        validate: function(value1,value2){
            return value1.replace(/-/g, '') === value2.substr(6, 8);
        },
        message: function(fieldText){
            return "只能为" + fieldText + "????”??—?????è?????è?·????”?";
        }
    },

    isValidDate: {
        validate: function(value){
            var t = new Date(value),
                paddingZero = function(value){
                    return value < 10 ? ('0' + value) : value;
                },
                transStr = [t.getFullYear(), paddingZero(t.getMonth() + 1), paddingZero(t.getDate())].join('-');
            return transStr === value;
        },
        message: '输入不正确'
    },

    isValidMobile: {
        validate: function(value){
            return (/^0?(13[0-9]|15[012356789]|18[02356789]|14[57])[0-9]{8}$/).test(value);
        },
        message: "输入不正确"
    },

    isValidEmail: {
        validate: function(value){
            return (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/).test(value);
        },
        message: "输入不正确！"
    }
};

/**
 * 校验规则
 * @type {{name: {text: string, validators: string[]}, password: {text: string, validators: string[]}, repassword: {text: string, validators: *[]}, identity: {text: string, validators: string[]}, birthday: {text: string, validators: string[]}, mobile: {text: string, validators: string[]}, spareMobile: {text: string, validators: *[]}, email: {text: string, validators: string[]}}}
 */
Validator.config = {
    name: {
        text: '姓名',
        validators: ['isNotEmpty', 'isValidName']
    },
    password:{
        text:'密码',
        validators:['isNotEmpty','isValidPassword']
    },
    repassword:{
        text:'重复密码',
        validators:['isNotEmpty','isValidPassword', ['isEqualTo', 'password']]
    },
    identity: {
        text: ' 身份证号',
        validators: ['isNotEmpty','isValidIdentity']
    },
    birthday: {
        text: ' 生日',
        validators: [['isBirthEqualTo','identity'],'isValidDate']
    },
    mobile: {
        text: ' 手机号码',
        validators: ['isEmpty','isValidMobile']
    },
    spareMobile: {
        text: ' 备用手机号码',
        validators: ['isValidMobile', ['isNotEqualTo', 'mobile']]
    },
    email: {
        text: '邮箱',
        validators: ['isEmpty','isValidEmail']
    }
};