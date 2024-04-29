import React, { useEffect, useState } from 'react'
import searchIcon from "../public/assets/search.png"
import windIcon from "../public/assets/wind.png"
import humidityIcon from "../public/assets/humidity.png"
import PropsType from "prop-types"


const WeatherDetails = ({icon,temp,city,country,lat,log,wind,humidity}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">Logitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="" className='icon' />
          <div className="data">
            <div className="humidity-percentage">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="" className='icon' />
          <div className="data">
            <div className="wind-percentage">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
}



const App = () => {
  let apiKey                            = "840ddfa92719e0b79aedc97ab05bc87a";
  
  const [icon, setIcon]                 = useState();
  const [temp, setTemp]                 = useState(0);
  const [city, setCity]                 = useState('');
  const [country, setCountry]           = useState('');
  const [lat,setLat]                    = useState(0);
  const [log,setLog]                    = useState(0);
  const [wind,setWind]                  = useState(0);
  const [humidity,setHumidity]          = useState(0);
  const [text,setText]                  = useState("Chennai");
  const [cityNotFount, setCityNotFound] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error,setError]                = useState(null)
 
  const Search = async() => {    
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=Metric`
    try{
      let res = await fetch(url);
      let data = await res.json();
      //console.log("data",data);
      if(data.cod == '404'){
        console.log("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      // console.log(data.weather[0].icon)
      let weatherIcon = "../public/assets/"+data.weather[0].icon+".png"
      setIcon(weatherIcon)
      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLog(data.coord.lon)
      setCityNotFound(false)

    }catch(error){
      console.log("error occured :",error.message)
      setError("An error occured while fetching weather data....")
    }finally{     
      setLoading(false)
    }
  }
  useEffect(() => {
    Search();
  },[])

  const HandleCity = (e) => {
    setText(e.target.value);
  }

  const HandleKeyDown = (e) => {
    if(e.key === 'Enter'){
      Search()
    }
  }

  return (
    <div className='container'>
      <div className='input-container'>
        <input type="text" className='cityInput' placeholder='Enter the city' onChange={HandleCity} value={text} onKeyDown={HandleKeyDown} />
        <div className="search-icon" onClick={()=>Search()}>
          <img src={searchIcon} alt="" />
        </div>
      </div>
      
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {cityNotFount && <div className="city-not-found">City Not Found</div>}

      {!loading && !cityNotFount && <WeatherDetails 
        icon={icon} 
        temp={temp} 
        city={city} 
        country={country} 
        lat={lat} 
        log={log} 
        wind={wind} 
        humidity={humidity} 
      />}
      
      <p className="copyright">
        Designed by &copy;<span>Nandhakrishnan</span>
      </p>
    </div>
  )
}

WeatherDetails.PropsType = {
  icon : PropsType.string.isRequired,
  temp : PropsType.number.isRequired,
  city : PropsType.string.isRequired,
  country : PropsType.string.isRequired,
  humidity : PropsType.number.isRequired,
  wind : PropsType.number.isRequired,
  lat : PropsType.number.isRequired,
  log : PropsType.number.isRequired,
}

export default App