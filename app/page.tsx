"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const apiKey = "a3f30594afc32b07d41d92e034e5166e";
  const [city, setCity] = useState<WeatherData | null>(null);
  const [weather, setWeather] = useState<string>("");

  useEffect(() => {
    if (city) {
      (document.getElementById("my_modal_1") as HTMLDialogElement)?.showModal();
    }
  }, [city]);

  interface WeatherData {
    name: string;
    main: {
      temp: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
  }

  async function getWeather() {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${weather}&limit=1&appid=${apiKey}`,
    );
    const data = await response.json();
    const { lat, lon } = data[0];

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    );

    const weatherData: WeatherData = await weatherResponse.json();

    console.log(weatherData);
    setCity(weatherData);
  }
  const btnHandler = (e) => {
    e.preventDefault();
    if (!weather) return;
    getWeather();
    setWeather("");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="container bg-white text-black border border-2 border-gray-300 p-4 flex flex-col items-center justify-center gap-4 max-w-md rounded-lg shadow-lg">
        <h1 className="text-3xl p-2 font-bold">Weather App</h1>
        <form action="submit" className="flex flex-col">
          <input
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            className="p-2 text-xl text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="text"
            placeholder="Enter the city"
          />
          <button
            onClick={(e) => btnHandler(e)}
            type="submit"
            className="btn btn-primary m-2"
          >
            Get Weather
          </button>
        </form>
        {city && (
          <dialog
            id="my_modal_1"
            className="modal bg-gradient-to-r from-blue-500 to-purple-500"
          >
            <div className="modal-box bg-white">
              <h3 className="font-bold text-xl flex justify-center p-2">
                Weather Details
              </h3>
              <p className="py-4 text-lg">City : {city.name}</p>
              <p className="py-4 text-lg">Temp : {city.main.temp}°C</p>
              <p className="py-4 text-lg">Humidity : {city.main.humidity}%</p>
              <p className="py-4 text-lg">Wind : {city.wind.speed}m/s</p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}
