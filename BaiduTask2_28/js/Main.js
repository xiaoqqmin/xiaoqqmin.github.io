/**
 * Created by PC on 2016/4/14.
 */

function Init(){
    //Mediator.Make(Commander);
    //ʹ��BUS��չCommander
    BUS.Make(Commander);
    Commander.Init();
    Util.Animation();
}

Init();