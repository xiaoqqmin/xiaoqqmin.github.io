/**
 * Created by PC on 2016/4/15.
 */

/**
 * 获取textarea中的配置文件，生成对应的表单
 * @param id 表单id
 * @constructor
 */
function CreateForm(id){
    var createFormBtn = document.getElementById(id+'-create');
    createFormBtn.addEventListener('click',function(){
        var test = document.getElementById(id+'-config').value;
        try{
            var testCtl = JSON.parse(test);
        }catch(err){
            alert('JSON格式错误，请修改！')
            return;
        }

        var formFactory1 = new FormFactory(id+'-factory');
        formFactory1.wapper.innerText = "";
        var testCtls = [];
        for(var i in testCtl){
            var ctl = formFactory1.createForm(testCtl[i]);
            if(i !== 'submit'){
                testCtls.push(ctl);
            }else{
                ctl.addEventListener('click',function(){
                    var result = true;
                    for(var i =0;i<testCtls.length;i++){
                        testCtls[i].inputCtl.focus();
                        testCtls[i].inputCtl.blur();
                        result = result && testCtls[i].getResult();
                    }
                    if(result){
                        alert(event.target.dataset.success);
                    }else{
                        alert(event.target.dataset.fail);
                    }
                });
            }
        }
        console.log(id+'生成成功！')
    });
    createFormBtn.click();
}

function Init(){
    CreateForm('form1');
    CreateForm('form2');
}

Init();