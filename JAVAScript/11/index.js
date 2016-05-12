function input_text()
{
    s=document.getElementById("AQI").value;
    document.getElementById("cont").innerHTML=s;
}
document.getElementById("submit").onclick= input_text;