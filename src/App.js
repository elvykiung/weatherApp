import React from 'react';
import './App.css';
import Weather from '../src/app_component/weather.component';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'weather-icons/css/weather-icons.css';
import Form from '../src/app_component/form.component';
const APIKEY = 'db42a1ee0a661bddd1fbd073f4d25a52';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: undefined,
      temp_min: undefined,
      description: '',
      error: false
    };

    this.weatherIcon = {
      Thunderstorm: 'wi-thunderstorm',
      Drizzle: 'wi-sleet',
      Rain: 'wi-rain',
      Snow: 'wi-snow',
      Atmosphere: 'wi-fog',
      Clear: 'wi-day-sunny',
      Clouds: 'wi-day-fog'
    };
  }

  getWeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId <= 232:
        this.setState({ icon: this.weatherIcon.Thunderstorm });
        break;

      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon: this.weatherIcon.Drizzle });
        break;

      case rangeId >= 500 && rangeId <= 531:
        this.setState({ icon: this.weatherIcon.Rain });
        break;

      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon: this.weatherIcon.Snow });
        break;

      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon: this.weatherIcon.Atmosphere });
        break;

      case rangeId >= 800:
        this.setState({ icon: this.weatherIcon.Clear });
        break;

      case rangeId >= 801 && rangeId <= 804:
        this.setState({ icon: this.weatherIcon.Clouds });
        break;

      default:
        this.setState({ icon: this.weatherIcon.Clouds });
        break;
    }
  }

  getWeather = async e => {
    e.preventDefault();

    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;
    const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${APIKEY}`);

    if (city && country) {
      const response = await api_call.json();

      console.log(response);
      this.setState({
        city: `${response.name} , ${response.country}`,

        celsius: this.calculateCelsius(response.main.temp),
        temp_max: this.calculateCelsius(response.main.temp_max),
        temp_min: this.calculateCelsius(response.main.temp_min),
        description: response.weather[0].description,
        error: false
      });

      this.getWeatherIcon(this.weatherIcon, response.weather[0].id);
    } else {
      this.setState({ error: true });
    }
  };

  calculateCelsius(temp) {
    let cell = Math.floor(temp - 273.15);
    return cell;
  }

  render() {
    return (
      <div className="App">
        <Form loadWeather={this.getWeather} error={this.state.error}></Form>
        <Weather
          city={this.state.city}
          temp_celsius={this.state.celsius}
          temp_min={this.state.temp_min}
          temp_max={this.state.temp_max}
          description={this.state.description}
          weatherIcon={this.state.icon}
        ></Weather>
      </div>
    );
  }
}

export default App;
