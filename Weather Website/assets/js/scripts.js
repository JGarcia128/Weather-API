var key = '08a25f22517c9cd99801724c593bf900';

//Demonstates the current time and date
var date = moment().format('dddd, MMMM Do YYYY');
var dateTime = moment().format('YYYY-MM-DD HH:MM:SS')

var searchCity = [];
//Saves the Search city in an array and storage
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
	if (city === "") {
		return;
	};
	searchCity.push(city);

	localStorage.setItem('city', JSON.stringify(searchCity));
	fiveDayForcastE1.empty();
	getHistory();
	getWeatherToday();
});

//Create buttons based on search history
var contHistEl = $('.cityHist');
function getHistory() {
	contHistEl.empty();

	for (let i = 0; i < searchCity.length; i++) {

		var formRow = $('<row>');
		var formButton = $('<button>').text(`${searchCity[i]}`)

		formRow.addClass('row histBtnRow');
		formButton.addClass('btn btn-outline-secondary histBtn');
		formButton.attr('type', 'button');

		contHistEl.prepend(formRow);
		formRow.append(formButton);
	} if (!city) {
		return;
	}
	//The button starts a search 
	$('.histBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		fiveDayForcastE1.empty();
		getWeatherToday();
	});
};

//Today's weather will appear
var bodyUpToDateCard = $('.sectionSizeBodyToday')
//The current day will appear and then the first five days will appear.
function getWeatherToday() {
	var getWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(bodyUpToDateCard).empty();

	$.ajax({
		url: getWeatherUrl,
		method: 'GET',
	}).then(function (response) {
		$('.sectionSizeTodayCityName').text(response.name);
		$('.sectionSizeTodayDate').text(date);
		//Icons pictures
		$('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		// Temperature
		var temE1 = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		bodyUpToDateCard.append(temE1);
		//Waht it feels like 
		var tempFeel = $('<p>').text(`It Feels Like: ${response.main.feels_like} °F`);
		bodyUpToDateCard.append(tempFeel);
		//How humid it is 
		var humidE1 = $('<p>').text(`The Humidity is at: ${response.main.humidity} %`);
		bodyUpToDateCard.append(humidE1);
		//The speed wind
		var speedWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		bodyUpToDateCard.append(speedWind);
		//Set the lat and long from the searched city
		var cityLon = response.coord.lon;
		
		var cityLat = response.coord.lat;
	

		var getUrlUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,daily,minutely&appid=${key}`;

		$.ajax({
			url: getUrlUvi,
			method: 'GET',
		}).then(function (response) {
			var pElUvi = $('<p>').text(`UV Index: `);
			var uviSpan = $('<span>').text(response.current.uvi);
			var uvi = response.current.uvi;
			pElUvi.append(uviSpan);
			bodyUpToDateCard.append(pElUvi);
			//set the UV index to match an exposure chart severity based on color 
			if (uvi >= 0 && uvi <= 2) {
				uviSpan.attr("class");
			} else if (uvi > 2 && uvi <= 5) {
				uviSpan.attr("class")
			} else if (uvi > 5 && uvi <= 7) {
				uviSpan.attr("class")
			} else if (uvi > 7 && uvi <= 10) {
				uviSpan.attr("class")
			} else {
				uviSpan.attr("class")
			}
		});
	});
	getFiveDayForecast();
};

var fiveDayForcastE1 = $('.fiveForecast');

function getFiveDayForecast() {
	var getUrlFiveDays = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

	$.ajax({
		url: getUrlFiveDays,
		method: 'GET',
	}).then(function (response) {
		var arrayFiveDays = response.list;
		var theWeather = [];

		$.each(arrayFiveDays, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				feels_like: value.main.feels_like,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
			}

			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				theWeather.push(testObj);
			}
		})
		//The Five Day weather will appear on screen
		for (let i = 0; i < theWeather.length; i++) {

			var cardDivE1 = $('<div>');
			cardDivE1.attr('class', 'sectionSize text-weather border-div-five-day-forecast mb-3 sectionSizeOne');
			cardDivE1.attr('style', 'max-width: 200px;');
			fiveDayForcastE1.append(cardDivE1);

			var headerDivE1 = $('<div>');
			headerDivE1.attr('class', 'sectionSize-header')
			var m = moment(`${theWeather[i].date}`).format('MM-DD-YYYY');
			headerDivE1.text(m);
			cardDivE1.append(headerDivE1)

			var bodyDivE1 = $('<div>');
			bodyDivE1.attr('class', 'sectionSize-body');
			cardDivE1.append(bodyDivE1);

			var iconDivE1 = $('<img>');
			iconDivE1.attr('class', 'icons');
			iconDivE1.attr('src', `https://openweathermap.org/img/wn/${theWeather[i].icon}@2x.png`);
			bodyDivE1.append(iconDivE1);

			//Temp
			var pElTemp = $('<p>').text(`Temperature: ${theWeather[i].temp} °F`);
			bodyDivE1.append(pElTemp);
			//Feels Like
			var pElFeel = $('<p>').text(`Feels Like: ${theWeather[i].feels_like} °F`);
			bodyDivE1.append(pElFeel);
			//Humidity
			var pElHumid = $('<p>').text(`Humidity: ${theWeather[i].humidity} %`);
			bodyDivE1.append(pElHumid);
		}
	});
};


function initLoad() {

	var cityHistStore = JSON.parse(localStorage.getItem('city'));

	if (cityHistStore !== null) {
		searchCity = cityHistStore
	}
	getHistory();
	getWeatherToday();
};

initLoad();