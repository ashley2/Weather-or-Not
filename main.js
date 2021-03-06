'use strict';


var apiKey = '4f02a83e5f8e6271e86110e9ab2440e7'
var zipcodes;
var ids;

$(init);

function init() {



  $('#submitButton').click(getZip)
  $('#weatherContainer').on("click", ".close", deleteCity);



  loadFromLocalStorage();
  populateZips();

  // event.preventDeafult();

  function loadFromLocalStorage(){
    if(localStorage.zipcodes === undefined){
      localStorage.zipcodes = '[]';
    }
    zipcodes = JSON.parse(localStorage.zipcodes);
  }

  function  saveToLocalStorage(){
    localStorage.zipcodes = JSON.stringify(zipcodes);
  }

  function  getZip(){

    var newZip = $('#zipcodeInput').val();
    var zipStr = localStorage.zipcodes;
    zipcodes.push(newZip);
    var newZipStr = JSON.stringify(zipcodes);
    localStorage.zipcodes = newZipStr;
    saveToLocalStorage()
    getZipInfo(newZip)
  }

  function getZipInfo(newZip){

    $('#zipcodeInput').val(' ');
    var url = `http://api.openweathermap.org/data/2.5/weather?zip=${newZip},us&units=imperial&APPID=${apiKey}`
    $.get(url)
    .success(function(data){

      if (data.cod !== 200){
        alert("Oops! Looks like we can't find this location! Try another!");
      }
      
      $('#weatherContainer').append(weatherCard(data))
      setTimeout(function(){
        $('.infoContainer').removeClass('animated');
      }, 2000);


    })
    .error(function(err){
      console.log(err);
    })
  }

  function  populateZips() {
    for (let zip of zipcodes){
     getZipInfo(zip)
   }
 }


 function weatherCard(data){
  var $card = $('#template').clone().attr("id", "")


  var city = data.name;
  var temperature = Math.round(data.main.temp);
  var icon = data.weather[0].icon + ".png";
  var description = data.weather[0].description;
  var ID = data.id;


  $card.find(".cityName").text(city)
  $card.find(".temperature").text(temperature + "˚F")
  $card.find(".icon").attr('src', "http://openweathermap.org/img/w/" + icon)
  $card.find(".description").text(description)
  $card.data("id", ID);

  $card.addClass('animated fadeInDown');
  return $card;
}

function deleteCity(){

  var $thisContainer = $(this).closest('.infoContainer');
  // $thisContainer.removeClass('animated fadeInDown').addClass('animated fadeOut');

  // setTimeOut(function($thisContainer){
  // }), 1000;

  var index = $thisContainer.index();
  zipcodes.splice(index, 1);
  $thisContainer.remove();
  saveToLocalStorage();
}


$('#weatherContainer').on("click", ".seeMore", function(){
  var $thisContainer = $(this).closest('.infoContainer');
  $thisContainer.find(".seeButton").toggleClass("hidden")

  var $thisContainer = $(this).closest('.infoContainer');
  var $cityID = $thisContainer.data("id")

  var url = `http://api.openweathermap.org/data/2.5/forecast/daily?id=${$cityID}us&units=imperial&cnt=5&APPID=${apiKey}`
  $.get(url)
  .success(function(data){
    $thisContainer.append(fiveDayForecast(data));
  })
  .error(function(err){
    console.log(err);
  })
})


$('#weatherContainer').on("click", ".seeLess", function(){
  var $thisContainer = $(this).closest('.infoContainer');
  $thisContainer.find(".seeButton").toggleClass("hidden")
  $thisContainer.find(".forecastContainer").remove();
})
.sortable({
 cursor: 'move',
 axis: "y"
})



function fiveDayForecast(data){
  var cards = [];
  for (var i = 0; i < 5; i++){
    var $card = $('.forecastContainer').first().clone();
    var forecastTempMin = Math.round(data.list[i].temp.min)
    var forecastTempMax = Math.round(data.list[i].temp.max)
    var forecastDescription = data.list[i].weather[0].description;
    var forecastIcon = data.list[i].weather[0].icon + ".png";
    $card.find(".forecastTempMin").text('Low:' + forecastTempMin)
    $card.find(".forecastTempMax").text('High:' + forecastTempMax)
    $card.find(".forecastDescription").text(forecastDescription)
    $card.find(".forecastIcon").attr('src', "http://openweathermap.org/img/w/" + forecastIcon)
    cards.push($card);
  }
  console.log(cards)
  return cards;
} 

};








