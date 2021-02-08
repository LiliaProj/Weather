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
function localTime(dt, timezone){
    let currDate = new Date();
    let newDate = new Date((dt + timezone + currDate.getTimezoneOffset() * 60) * 1000);
    return newDate;
}
function weatherToday(data){
    let date = localTime(data.dt, data.timezone);
    
    let divCurrent = $('<div>').addClass("divCurrent");

    let divH = $('<div>').addClass("divH");
    divH.append($('<h2>').html("current <br> weather"));
    divH.append($('<h2>').text(data.name +", "+ data.sys.country));
    
    let hTimeDay = $('<h2>').html(dayForm(date)+"<br>"+timeForm(date));
    divH.append(hTimeDay);
    
    divCurrent.append(divH);

    let divCurrWeather = $('<div>').addClass("divCurrWeather");
    divCurrWeather.html($('<div>')
    .html(createImg(data.weather[0].icon))
    .append($('<p>').text(data.weather[0].main)));

    divCurrWeather.append($('<div>')
    .html($('<p>').addClass("currTemp").html(data.main.temp + "&deg;C"))
    .append($('<p>').html("Real Feel "+data.main.feels_like+ "&deg;C")));

    divCurrWeather.append($('<div>')
    .html($('<p>').text("Sunrice: "+ timeForm(localTime(data.sys.sunrise, data.timezone))))
    .append($('<p>').text("Sunset: "+ timeForm(localTime(data.sys.sunset, data.timezone))))
    .append($('<p>').text("Duration: "+ timeForm(localTime(data.sys.sunset - data.sys.sunrise, -3600)))));

    divCurrent.append(divCurrWeather);

    $('main').html(divCurrent);
}