
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()
const apiKey = 'a378e0753bc9cb048606cd07d209faee';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) 
  {
  res.render('index', {weather: null, error: null});
  }
)
app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`


  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please enter a valid city.'});
      } else {

        var tempcelcius = Math.round((weather.main.temp - 32) * (5/9));
        var windspeed = Math.round(weather.wind.speed * (1.609));
        var condition = weather.weather[0].description;

        let weatherTemp = `It is ${(tempcelcius)} degrees Celsius in ${weather.name}\n`;
        let weatherWind = `with wind speeds of ${(windspeed)}km/h!`;
        let weatherCondition = `\nConditions are ${(condition)} .`
        res.render('index', {weather: weatherTemp + weatherWind + weatherCondition, error: null});
    
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Weather Reported launched on port 3000!')
})
