class WeatherApp {
    constructor() {
      this.apiKey = 'a0b5909709c14ff68e063218251003'; // Should be moved to environment variables in production
      this.initialize();
    }
  
    initialize() {
      this.cacheDOM();
      this.bindEvents();
      this.getWeather('Mumbai'); // Default location
    }
  
    cacheDOM() {
      this.weatherForm = document.getElementById('weatherForm');
      this.locationInput = document.getElementById('locationInput');
      this.weatherInfo = document.getElementById('weatherInfo');
      this.forecastInfo = document.getElementById('forecastInfo');
      this.historyList = document.getElementById('historyList');
      this.unitToggleInputs = document.querySelectorAll('.unit-toggle input');
    }
  
    bindEvents() {
      this.weatherForm.addEventListener('submit', this.handleFormSubmit.bind(this));
      this.unitToggleInputs.forEach(input => {
        input.addEventListener('change', this.handleUnitChange.bind(this));
      });
    }
  
    handleFormSubmit(event) {
      event.preventDefault();
      const location = this.locationInput.value.trim();
      if (location) {
        this.getWeather(location);
        this.addToSearchHistory(location);
        this.locationInput.value = ''; // Clear input after search
      }
    }
  
    handleUnitChange() {
      const location = this.locationInput.value.trim() || 'Mumbai';
      this.getWeather(location);
    }
  
    async getWeather(location) {
      try {
        const unit = document.querySelector('input[name="unit"]:checked').value;
        const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${encodeURIComponent(location)}&days=5`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.displayWeather(data);
        this.displayForecast(data.forecast.forecastday, unit);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        this.showError('Unable to fetch weather data. Please try again.');
      }
    }
  
    displayWeather(data) {
      if (!data.location || !data.current) {
        this.showError('Location not found.');
        return;
      }
  
      const { location, current } = data;
      const unit = document.querySelector('input[name="unit"]:checked').value;
      const unitSymbol = unit.toUpperCase();
  
      this.weatherInfo.innerHTML = `
        <h2>${location.name}, ${location.country}</h2>
        <p><i class="wi wi-${this.getWeatherIcon(current.condition.code)}"></i> ${current.condition.text}</p>
        <p><strong>Temperature:</strong> ${unit === 'c' ? current.temp_c : current.temp_f}°${unitSymbol}</p>
        <p><strong>Feels Like:</strong> ${unit === 'c' ? current.feelslike_c : current.feelslike_f}°${unitSymbol}</p>
        <p><strong>Humidity:</strong> ${current.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${unit === 'c' ? current.wind_kph : current.wind_mph} ${unit === 'c' ? 'km/h' : 'mph'}</p>
      `;
  
      this.animateElement(this.weatherInfo);
    }
  
    displayForecast(forecastDays, unit) {
      if (!forecastDays || forecastDays.length === 0) return;
  
      const unitSymbol = unit.toUpperCase();
      let forecastHTML = '<h2>5-Day Forecast</h2><div class="forecast-container">';
  
      forecastDays.forEach(day => {
        const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        forecastHTML += `
          <div class="forecast-card">
            <p><strong>${date}</strong></p>
            <p><i class="wi wi-${this.getWeatherIcon(day.day.condition.code)}"></i></p>
            <p>${unit === 'c' ? day.day.avgtemp_c : day.day.avgtemp_f}°${unitSymbol}</p>
            <p>${day.day.condition.text}</p>
          </div>
        `;
      });
  
      forecastHTML += '</div>';
      this.forecastInfo.innerHTML = forecastHTML;
      this.animateElement(this.forecastInfo);
    }
  
    addToSearchHistory(location) {
      // Prevent duplicate entries
      const existingItems = Array.from(this.historyList.children);
      if (existingItems.some(item => item.textContent.toLowerCase() === location.toLowerCase())) {
        return;
      }
  
      const listItem = document.createElement('li');
      listItem.className = 'search-history__item';
      listItem.textContent = location;
      listItem.addEventListener('click', () => this.getWeather(location));
      
      // Add to top and limit history
      this.historyList.prepend(listItem);
      if (this.historyList.children.length > 5) {
        this.historyList.removeChild(this.historyList.lastChild);
      }
    }
  
    getWeatherIcon(code) {
      const iconMap = {
        1000: 'day-sunny',
        1003: 'day-cloudy',
        1006: 'cloudy',
        1009: 'cloudy',
        1030: 'fog',
        1063: 'rain',
        1066: 'snow',
        1069: 'sleet',
        1072: 'sleet',
        1087: 'thunderstorm',
        1114: 'snow',
        1117: 'snow',
        1135: 'fog',
        1147: 'fog',
        1150: 'rain',
        1153: 'rain',
        1168: 'sleet',
        1171: 'sleet',
        1180: 'rain',
        1183: 'rain',
        1186: 'rain',
        1189: 'rain',
        1192: 'rain',
        1195: 'rain',
        1198: 'rain',
        1201: 'rain',
        1204: 'sleet',
        1207: 'sleet',
        1210: 'snow',
        1213: 'snow',
        1216: 'snow',
        1219: 'snow',
        1222: 'snow',
        1225: 'snow',
        1237: 'snow',
        1240: 'rain',
        1243: 'rain',
        1246: 'rain',
        1249: 'sleet',
        1252: 'sleet',
        1255: 'snow',
        1258: 'snow',
        1261: 'sleet',
        1264: 'sleet',
        1273: 'thunderstorm',
        1276: 'thunderstorm',
        1279: 'snow',
        1282: 'snow',
      };
      return iconMap[code] || 'day-sunny';
    }
  
    showError(message) {
      this.weatherInfo.innerHTML = `<p class="error">${message}</p>`;
      this.animateElement(this.weatherInfo);
    }
  
    animateElement(element) {
      element.style.opacity = 0;
      element.style.transform = 'translateY(20px)';
      setTimeout(() => {
        element.style.opacity = 1;
        element.style.transform = 'translateY(0)';
      }, 10);
    }
  }
  
  // Initialize the app when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
  });