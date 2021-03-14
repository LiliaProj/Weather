$(document).ready(()=>{
    jsonFunc(apiUrl("weather", "Kyiv, UA"), apiUrl("forecast", "Kyiv, UA"), "Kyiv, UA");

    $('#cityInp').keyup((event)=>{
        if(event.keyCode == 13){
            let cityInp = $('#cityInp').val();
            jsonFunc(apiUrl("weather", cityInp), apiUrl("forecast", cityInp), cityInp);
        }
    });
});

function jsonFunc(urlW, urlF, cityInp){
    $.getJSON(urlW, (data)=>{
        weatherToday(data);
        $('#weatherBtn').on("click", ()=>{
            weatherToday(data);
        });
    }).fail(()=>{
        let divErr = $('<div>').addClass("divErr");
        divErr.append($('<span>').text("404"));
        divErr.append($('<p>').html(`<em>${cityInp}</em> could not be found.<br>Please enter different location`));
        divErr.append($('<img>').attr("src", "panda.png"));

        $('#forecastBtn').prop("disabled", true);
        $('#weatherBtn').prop("disabled", true);

        $('main').html(divErr);
    });
    $.getJSON(urlF, (data)=>{
        console.log(data);
        let todayData = data.list.slice(0, 7);
        $('.divCurrent').append(createTable(todayData, data.city.timezone, "Today"));
        $('#weatherBtn').click(()=>{
            $('.divCurrent').append(createTable(todayData, data.city.timezone, "Today"));
        })
        $('#forecastBtn').on("click", ()=>{
            forecastPage(data);
        });
    })
}
function apiUrl(format, city){
    return `http://api.openweathermap.org/data/2.5/${format}?q=${city}&units=metric&appid=7477f819d6921e9897673c8c6ae3542d`;
}
function formatOfDate(time) {
    return +time < 10 ? '0' + time : time;
}
function timeForm(date){
    return formatOfDate(date.getHours())+":"+formatOfDate(date.getMinutes());
}
function dayForm(date){
    return formatOfDate(date.getDate())+"."+formatOfDate(date.getMonth()+1)+"."+date.getFullYear();
}
function dayForm2(date){
    let month = '';
    switch(date.getMonth()){
        case 0:
            month = 'Jan';
            break;
        case 1:
            month = 'Feb';
            break;
        case 2:
            month = 'Mar';
            break;
        case 3:
            month = 'Apr';
            break;
        case 4:
            month = 'May';
            break;
        case 5:
            month = 'June';
            break;
        case 6:
            month = 'July';
            break;
        case 7:
            month = 'Aug';
            break;
        case 8:
            month = 'Sept';
            break;
        case 9:
            month = 'Oct';
            break;
        case 10:
            month = 'Nov';
            break;
        case 11:
            month = 'Dec';
            break;
    }
    return month + " " + formatOfDate(date.getDate());
}
function dayOfWeek(date){
    let day = "";
    switch (date.getDay()){
        case 0:
            day = 'Sunday';
            break;
        case 1:
            day = 'Monday';
            break;
        case 2:
            day = 'Tuesday';
            break;
        case 3:
            day = 'Wednesday';
            break;
        case 4:
            day = 'Thursday';
            break;
        case 5:
            day = 'Friday';
            break;
        case 6:
            day = 'Saturday';
            break;
    }
    return day;
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
    $('#weatherBtn').addClass("activBtn");
    $('#weatherBtn').prop("disabled", true);
    $('#forecastBtn').removeClass("activBtn");
    $('#forecastBtn').prop("disabled", false);

    let date = localTime(data.dt, data.timezone);
    
    let divCurrent = $('<div>').addClass("divCurrent");

    let divH = $('<div>').addClass("divH");
    divH.append($('<h2>').html("current <br> weather"));
    divH.append($('<h2>').text(data.name +", "+ data.sys.country));
    divH.append($('<h2>').html(dayForm(date)+"<br>"+timeForm(date)));
    
    divCurrent.append(divH);

    let divCurrWeather = $('<div>').addClass("divCurrWeather");
    divCurrWeather.html($('<div>')
    .html(createImg(data.weather[0].icon))
    .append($('<p>').text(data.weather[0].main)));

    divCurrWeather.append($('<div>')
    .html($('<p>').addClass("currTemp").html(Math.trunc(data.main.temp) + "&deg;C"))
    .append($('<p>').html("Real Feel "+ Math.trunc(data.main.feels_like)+ "&deg;C")));

    divCurrWeather.append($('<div>')
    .html($('<p>').text("Sunrice: "+ timeForm(localTime(data.sys.sunrise, data.timezone))))
    .append($('<p>').text("Sunset: "+ timeForm(localTime(data.sys.sunset, data.timezone))))
    .append($('<p>').text("Duration: "+ timeForm(localTime(data.sys.sunset - data.sys.sunrise, -3600)))));

    divCurrent.append(divCurrWeather);

    $('main').html(divCurrent);
}
function filterForTable(data, n){
    let dataOneDay = data.list.filter(item => {
        let newDay = dayForm(localTime(item.dt, data.city.timezone));
        let filterDay = dayForm(localTime(data.list[0].dt + 24*60*60*n, data.city.timezone));
        if(newDay === filterDay){
            return true;
        }
    });
    return dataOneDay;
}
function createTable(data, timeZ, day){
    let divTable = $('<div>').addClass("forecastTable");
    let scrollTable = $('<div>').addClass("scrollBox");
    divTable.append(scrollTable);
    scrollTable.html($('<h2>').text("Hourly"));
    let forecastTable = $('<table>');
    scrollTable.append(forecastTable);    

    let timeTr = $('<tr>').attr("id", "timeTr");
    forecastTable.append(timeTr.html($('<td>').text(day)));
    let imgTr = $('<tr>').attr("id", "imgTr");
    forecastTable.append(imgTr.html($('<td>').text(" ")));
    let forTr = $('<tr>').attr("id", "forTr");
    forecastTable.append(forTr.html($('<td>').text("Forecast")))
    let tempTr = $('<tr>').attr("id", "tempTr");
    forecastTable.append(tempTr.html($('<td>').html("Temp (&deg;C)")));
    let feelTr = $('<tr>').attr("id", "feelTr");
    forecastTable.append(feelTr.html($('<td>').html("Real Fell")));
    let windTr = $('<tr>').attr("id", "windTr");
    forecastTable.append(windTr.html($('<td>').html("Wind (km/h)")));

    console.log(data);
    $.each(data, (key, value)=>{
        timeTr.append($('<td>').text(timeForm(localTime(value.dt, timeZ))));
        imgTr.append($('<td>').html(createImg(value.weather[0].icon)));
        forTr.append($('<td>').text(value.weather[0].main));
        tempTr.append($('<td>').html(Math.trunc(value.main.temp) + "&deg;"));
        feelTr.append($('<td>').html(Math.trunc(value.main.feels_like) + "&deg;"));
        windTr.append($('<td>').text(Math.trunc(value.wind.speed*3.6)));
    });

    return divTable;
}
function forecastPage(data){
    $('#forecastBtn').addClass("activBtn");
    $('#forecastBtn').prop("disabled", true);
    $('#weatherBtn').removeClass("activBtn");
    $('#weatherBtn').prop("disabled", false);

    let divForecast = $('<div>').addClass("divForecast");
    let mainBoxF = $('<div>').addClass("mainForecast").html($('<h2>').text(data.city.name +", "+ data.city.country));
    divForecast.html(mainBoxF);
    let scrollFor = $('<div>').addClass("scrollBox");
    mainBoxF.append(scrollFor);

    for(let i=0; i<5; i++){
        let boxOneDay = $('<div>').addClass("boxOneDay");
        let oneDayData = filterForTable(data, i);
        scrollFor.append(boxOneDay);

        if(i == 0){
            oneDayData = data.list.slice(0, 7);
            boxOneDay.addClass("activBox");
            divForecast.append(createTable(oneDayData, data.city.timezone, "Today"));
        }
        boxOneDay.html($('<h2>').text(dayOfWeek(localTime(oneDayData[0].dt ,data.city.timezone))))
        .append($('<p>').text(dayForm2(localTime(oneDayData[0].dt ,data.city.timezone))))
        .append(createImg(oneDayData[4].weather[0].icon))
        .append($('<p>').addClass("currTemp").html(Math.trunc(oneDayData[4].main.temp) + "&deg;C"))
        .append($('<p>').text(oneDayData[4].weather[0].description))

        boxOneDay.click(()=>{
            $('.forecastTable').remove();
            if(i == 0){
                divForecast.append(createTable(oneDayData, data.city.timezone, "Today"));
            }
            else{
                divForecast.append(createTable(oneDayData, data.city.timezone, dayOfWeek(localTime(oneDayData[0].dt ,data.city.timezone))));
            }
            $('.boxOneDay').removeClass("activBox");
            boxOneDay.addClass("activBox");
        })
    }

    $('main').html(divForecast);
}