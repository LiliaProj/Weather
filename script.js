$(document).ready(()=>{
    jsonFunc(apiUrl("weather", "Kyiv, UA"), apiUrl("forecast", "Kyiv, UA"));

    $('#cityInp').keyup((event)=>{
        if(event.keyCode == 13){
            let cityInp = $('#cityInp').val();
            jsonFunc(apiUrl("weather", cityInp), apiUrl("forecast", cityInp))
        }
    });
});

function jsonFunc(urlW, urlF){
    $.getJSON(urlW, (data)=>{
        console.log(data);

        weatherToday(data);
    }).fail(()=>{
        let divErr = $('<div>').addClass("divErr");
        divErr.append($('<span>').text("404"));
        divErr.append($('<p>').text("Error"));

        $('main').html(divErr);
    });
    $.getJSON(urlF, (data)=>{
        console.log(data.list[0].main.temp);
    })
}
function apiUrl(format, city){
    return `http://api.openweathermap.org/data/2.5/${format}?q=${city}&units=metric&appid=7477f819d6921e9897673c8c6ae3542d`;
}
function formatOfDate(time) {
    return +time < 10 ? '0' + time : time;
}
function timeForm(date){
    return formatOfDate(date.getHours())+":"+formatOfDate(date.getMinutes())+":"+formatOfDate(date.getSeconds());
}
function dayForm(date){
    return formatOfDate(date.getDate())+"."+formatOfDate(date.getMonth()+1)+"."+date.getFullYear();
}
function createImg(imgSrc){
    return $('<img>').attr("src", `http://openweathermap.org/img/wn/${imgSrc}@2x.png`);
}
function weatherToday(data){
    let currDate = new Date();
    let date = new Date((data.dt + data.timezone + currDate.getTimezoneOffset() * 60) * 1000);
    
    let divCurrent = $('<div>').addClass("divCurrent");

    let divH = $('<div>').addClass("divH");
    divH.append($('<h2>').text("current weather"));
    divH.append($('<h2>').text(data.name +", "+ data.sys.country));
    
    let hTimeDay = $('<h2>').html($('<br>'));
    hTimeDay.prepend(dayForm(date));
    hTimeDay.append(timeForm(date));
    divH.append(hTimeDay);
    
    divCurrent.append(divH);

    let divCurrWeather = $('<div>').addClass("divCurrWeather");
    divCurrWeather.append(createImg(data.weather[0].icon));
    divCurrent.append(divCurrWeather);

    $('main').html(divCurrent);
}