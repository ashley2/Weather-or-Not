'use strict';


var apiKey = '4f02a83e5f8e6271e86110e9ab2440e7'
var zipcodes;


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
    // console.log('s', localStorage.zipcodes)
    getZipInfo(newZip)

  }

  function getZipInfo(newZip){
    console.log("getZipInfo");
    var url = `http://api.openweathermap.org/data/2.5/weather?zip=${newZip},us&units=imperial&APPID=${apiKey}`
    $.get(url)
    .success(function(data){
      console.log('data', data);

      $('#weatherContainer').append(weatherCard(data));

    })
    .error(function(err){
      console.log(err);
    })
  }


  function  populateZips() {

    for (var i=0; i < zipcodes.length; i++){
      console.log("popZips");
      var url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipcodes[i]},us&units=imperial&APPID=${apiKey}`
      $.get(url)
      .success(function(data){
        console.log('data', data);


        // var $results = $('<div>');
        
          // var card = weatherCard(data);
          // console.log('card', card)

        // $results.append(card)
        // console.log('l', localStorage.zipcodes.length)
        // console.log('res', $results);
        $('#weatherContainer').append(weatherCard(data));

      })
      .error(function(err){
        console.log(err);
      })
    }


  }

  function weatherCard(data){
    console.log("weatherCard");
    var $card = $('.infoContainer').first().clone();

    var city = data.name;
    var temperature = data.main.temp
    var icon = data.weather[0].icon + ".png"
    var description = data.weather[0].description

    $card.find(".cityName").text(city)
    $card.find(".temperature").text(temperature + "˚F")
    $card.find(".icon").attr('src', "http://openweathermap.org/img/w/" + icon)
    $card.find(".description").text(description)
    $card.attr("id", "");




    console.log('card', $card);


    return $card;
  }

  function deleteCity(){
    console.log('click')
    var $thisContainer = $(this).closest('.infoContainer');

    var index = $thisContainer.index();
    zipcodes.splice(index, 1);
    saveToLocalStorage();
    $thisContainer.remove();


  }

  $('#weatherContainer').on("click", ".seeMore", function(){
   console.log('hi hi');

    var $thisContainer = $(this).closest('.infoContainer');

    var index = $thisContainer.index();

    $('.forecastContainer').append('hi')

    // var url = `http://api.openweathermap.org/data/2.5/forecast?zip=${zipcodes},us&units=imperial&APPID=${apiKey}`
  //   $.get(url)
  //   .success(function(data){

  //     // $('#weatherContainer').append(weatherCard(data));

  //   })
  //   .error(function(err){
  //     console.log(err);
  //   })
  
  });


};








