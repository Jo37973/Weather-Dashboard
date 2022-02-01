
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// Assigning Variables
let submitEl = document.getElementById("searchBtn");
let searchEl = document.getElementById("searchInput");
var searchHistoryBtn = document.querySelector("#searchHistory");

var searchHistory = [];
var apiUrl = "https://api.openweathermap.org";
var apiKey = "afe09d5361f7699e655a42a0c502491a";


// Fills out information into the primary current day card with weather information
function drawTodayCard (city, weather, time) {
    let date = dayjs().tz(time).format("M/D/YYYY");
    let curDate = document.getElementById("todayDate");
    let todayIcon = document.getElementById("todayIcon");
    let todayTemp = document.getElementById("todayTemp");
    let todayWind = document.getElementById("todayWind");
    let todayHumidity = document.getElementById("todayHumidity");
    let uv = document.getElementById("uv");
    let uvcolor = document.getElementById("uvcolor");
    let weatherIcon = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    todayCity.textContent = city;
    curDate.textContent = date;
    todayIcon.setAttribute("src", weatherIcon);
    todayTemp.textContent = weather.temp;
    todayWind.textContent = weather.wind_speed;
    todayHumidity.textContent = weather.humidity;
    uv.textContent = weather.uvi;

    //UV card colors to be assigned
    if (weather.uvi < 3){
      uvcolor.setAttribute("class", "uvcard green");
    } else if (weather.uvi < 6){
      uvcolor.setAttribute("class", "uvcard yellow");
    } else if (weather.uvi < 8){
      uvcolor.setAttribute("class", "uvcard orange");
    } else{
    uvcolor.setAttribute("class", "uvcard red");
    };

    //console.log(city);
    //console.log(date);
    //console.log(weather.temp);
    //console.log(weather.wind_speed);
    //console.log(weather.humidity);
    //console.log(weather.uvi);
};


// Fills info into the 5 day forcast cards
function drawFiveDay(daily, time) {
    const day1 = dayjs().tz(time).add(1, "day").startOf("day").unix();
    const day5 = dayjs().tz(time).add(6, "day").startOf("day").unix();

    //console.log(daily);

    for (var i = 0; i < daily.length; i++) {
      if (daily[i].dt >= day1 && daily[i].dt < day5) {
          var tStamp = daily[i].dt;
          let day = dayjs.unix(tStamp).tz(time).format("MMM D");
          let date = document.getElementById(`day${i}`); 
          let dayIcon = document.getElementById(`day${i}Icon`);
          let dayTemp = document.getElementById(`day${i}Temp`);
          let dayWind = document.getElementById(`day${i}Wind`);
          let dayHumidity = document.getElementById(`day${i}Humidity`);
            
            let weatherIcon = `https://openweathermap.org/img/w/${daily[i].weather[0].icon}.png`;

            date.textContent = day;
            dayIcon.setAttribute("src", weatherIcon);
            dayTemp.textContent = daily[i].temp.max;
            dayWind.textContent = daily[i].wind_speed;
            dayHumidity.textContent = daily[i].humidity;

        };
    };
};


// Function to use the latitude and longitude when performing a city search, and make the API call with those values.
function getCityInfo(cityData) {
    //console.log(cityData);
    var lat = cityData.lat;
    var lon = cityData.lon;
    var city = cityData.name;
    
    var url = `${apiUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;
    
    fetch(url)
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          drawTodayCard(city, data.current, data.timezone);
          drawFiveDay(data.daily, data.timezone);
        })
        .catch(function (err) {
          console.error(err);
        });
    // console.log(url); 
};


// Function for an API call with the city name, to get the latitude and longitude for the weather. 
function getLatLon(search) {
    var url = apiUrl + "/geo/1.0/direct?q="+ search + "&limit=5&appid=" + apiKey;
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (!data[0]) {
                  alert("Location not found");
                } else {
                  addHistory(search)
                  getCityInfo(data[0]);
                  return;
                }
            })
            .catch(function (err) {
                console.log("error: " + err);
            });
            //console.log(url);
            const content = document.getElementById("content");
            content.removeAttribute("class", "hidden");
};


// This function starts when the search button is clicked, and gets the latitude and longitude, and saves to the search history.
function citySearch(e){
          
    if (!searchEl.value) {
        return;
    };
    e.preventDefault();      
    var search = searchEl.value.trim();
    getLatLon(search);
    searchEl.value = "";

    
};

// This function starts the search for latitude and longitude using the search history buttons. 
function useSearchHistory(e) {
  // This won't do a search if current element is not a search history button
  if (!e.target.matches("history")) {
    return;
  };

  var btn = e.target;
  var search = btn.getAttribute("data-search");
  getLatLon(search);
};


// Add the recent search to the search history and then redraw the buttons to the page
function addHistory(search) {
    if (searchHistory.indexOf(search) !== -1) {
        return;
    };
    searchHistory.push(search);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    // Call to buttons to the page after adding new search to search history
    historyButtons();
};


// Function to bring search history buttons to the page
function historyButtons() {
    let historySec = document.getElementById("searchHistory");
    historySec.innerHTML = "";
    for (var i = searchHistory.length - 1; i >= searchHistory.length - 5; i--) {
        if (i < 0){
          return;
        };

        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.classList.add('history-btn',  'btn-history');
        var space = document.createElement("br");

        // `data-search` allows access to the city name when click handler happens
        btn.setAttribute("data-search", searchHistory[i]);
        btn.textContent = searchHistory[i];
        historySec.append(btn);
        historySec.append(space);
    };
};


// This gets the list of previous searches from loacal storage and then has buttons for them on the page
function createHistory() {
    var savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      searchHistory = JSON.parse(savedHistory);
    };
    // Call to generate search history buttons
    historyButtons();
};


createHistory();
submitEl.onclick = citySearch;
searchHistoryBtn.addEventListener("click", useSearchHistory);