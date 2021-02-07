$(document).ready(()=>{
    $("#cityInp").keyup((event)=>{
        if(event.keyCode == 13){
            let cityInp = $("#cityInp").val();
            let url = `http://api.openweathermap.org/data/2.5/forecast?q=${cityInp}&appid=7477f819d6921e9897673c8c6ae3542d`;

            $.getJSON(url, (data)=>{
                console.log("ok");
                console.log(data);
            }).fail(()=>{
                console.log("error");
            })
        }
    })
})