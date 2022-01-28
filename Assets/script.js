// add a clear search button
// Current conditions for the city
//City added to search history
// Current weather shows city name, date, icon of weather conditions, temp, humidity, wind speed, uv index.
//uv index displays color indicators for favorable, moderate, or severe
// future weather shows 5-day forecast shows date, icon rep of weather conditions, temp, wind speed, humidity. 
// In search history, when clicking  a city- it displays current and future conditons for the city.



let searchEl = document.getElementById("searchInput");
let submitEl = document.getElementById("searchBtn");


function citySearch(){
        const weather = document.getElementById("weather");
        weather.removeAttribute("class", "hidden");
};

        submitEl.onclick = citySearch;
});

