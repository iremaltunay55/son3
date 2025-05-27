// Mastra Weather Tools - TypeScript Native Implementation
import { createTool } from "@mastra/core";
import { z } from "zod";

// OpenWeatherMap API konfigürasyonu
const OPENWEATHER_API_BASE = "https://api.openweathermap.org/data/2.5";
const USER_AGENT = "mastra-weather-agent/1.0";

// API key'i environment variable'dan al
function getApiKey(): string {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENWEATHER_API_KEY environment variable gerekli");
  }
  return apiKey;
}

// HTTP istek fonksiyonu
async function makeWeatherRequest(url: string): Promise<any | null> {
  const headers = {
    "User-Agent": USER_AGENT,
    "Accept": "application/json"
  };

  try {
    const response = await fetch(url, { 
      headers, 
      signal: AbortSignal.timeout(30000) 
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("HTTP error:", error);
    return null;
  }
}

// Hava durumu verisini formatla
function formatWeatherData(data: any): string {
  if (!data) {
    return "Hava durumu verisi alınamadı.";
  }

  try {
    // Ana bilgiler
    const location = data.name || "Bilinmeyen konum";
    const country = data.sys?.country || "";
    const fullLocation = country ? `${location}, ${country}` : location;

    // Sıcaklık bilgileri (Kelvin'den Celsius'a çevir)
    const main = data.main || {};
    const temp = main.temp ? (main.temp - 273.15).toFixed(1) : "N/A";
    const feelsLike = main.feels_like ? (main.feels_like - 273.15).toFixed(1) : "N/A";
    const tempMin = main.temp_min ? (main.temp_min - 273.15).toFixed(1) : "N/A";
    const tempMax = main.temp_max ? (main.temp_max - 273.15).toFixed(1) : "N/A";
    const humidity = main.humidity || "N/A";
    const pressure = main.pressure || "N/A";

    // Hava durumu açıklaması
    const weather = data.weather?.[0] || {};
    const description = weather.description || "Bilinmiyor";
    const mainWeather = weather.main || "";

    // Rüzgar bilgileri
    const wind = data.wind || {};
    const windSpeed = wind.speed || null;
    const windDeg = wind.deg || null;

    // Görünürlük
    const visibility = data.visibility || null;

    // Formatlanmış çıktı
    let result = `
🌍 Konum: ${fullLocation}

🌡️ Sıcaklık Bilgileri:
• Mevcut Sıcaklık: ${temp}°C
• Hissedilen: ${feelsLike}°C
• En Düşük: ${tempMin}°C
• En Yüksek: ${tempMax}°C

☁️ Hava Durumu: ${description.charAt(0).toUpperCase() + description.slice(1)} (${mainWeather})

💧 Nem: ${humidity}%
🔽 Basınç: ${pressure} hPa`;

    if (windSpeed) {
      result += `\n💨 Rüzgar: ${windSpeed} m/s`;
      if (windDeg) {
        result += ` (${windDeg}°)`;
      }
    }

    if (visibility) {
      result += `\n👁️ Görünürlük: ${(visibility / 1000).toFixed(1)} km`;
    }

    return result;
  } catch (error) {
    return `Veri formatlanırken hata oluştu: ${error}`;
  }
}

// Koordinatlarla hava durumu aracı
export const getWeatherByCoordinates = createTool({
  id: "get_weather_by_coordinates",
  description: "Enlem ve boylam koordinatlarına göre hava durumu bilgilerini getir",
  inputSchema: z.object({
    latitude: z.number().min(-90).max(90).describe("Enlem (-90 ile 90 arası)"),
    longitude: z.number().min(-180).max(180).describe("Boylam (-180 ile 180 arası)")
  }),
  execute: async ({ latitude, longitude }) => {
    // Koordinat doğrulaması
    if (latitude < -90 || latitude > 90) {
      return "❌ Hata: Enlem -90 ile 90 arasında olmalıdır.";
    }

    if (longitude < -180 || longitude > 180) {
      return "❌ Hata: Boylam -180 ile 180 arasında olmalıdır.";
    }

    try {
      // API key'i al
      const apiKey = getApiKey();

      // API URL'ini oluştur
      const url = `${OPENWEATHER_API_BASE}/weather`;
      const params = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        appid: apiKey,
        lang: "tr" // Türkçe açıklamalar için
      });

      const fullUrl = `${url}?${params.toString()}`;

      // API'den veri al
      const weatherData = await makeWeatherRequest(fullUrl);

      if (!weatherData) {
        return "❌ Hava durumu verisi alınamadı. API'de bir sorun olabilir.";
      }

      // Veriyi formatla ve döndür
      return formatWeatherData(weatherData);
    } catch (error: any) {
      if (error.message.includes("OPENWEATHER_API_KEY")) {
        return `❌ Konfigürasyon hatası: ${error.message}`;
      }
      return `❌ Beklenmeyen hata: ${error.message}`;
    }
  }
});

// Şehir adıyla hava durumu aracı
export const getWeatherByCity = createTool({
  id: "get_weather_by_city",
  description: "Şehir adına göre hava durumu bilgilerini getir",
  inputSchema: z.object({
    cityName: z.string().describe("Şehir adı"),
    countryCode: z.string().optional().describe("Ülke kodu (opsiyonel, örn: TR, US)")
  }),
  execute: async ({ cityName, countryCode }) => {
    try {
      // API key'i al
      const apiKey = getApiKey();

      // Şehir adını hazırla
      let location = cityName;
      if (countryCode) {
        location += `,${countryCode}`;
      }

      // API URL'ini oluştur
      const url = `${OPENWEATHER_API_BASE}/weather`;
      const params = new URLSearchParams({
        q: location,
        appid: apiKey,
        lang: "tr"
      });

      const fullUrl = `${url}?${params.toString()}`;

      // API'den veri al
      const weatherData = await makeWeatherRequest(fullUrl);

      if (!weatherData) {
        return `❌ '${cityName}' şehri için hava durumu verisi bulunamadı.`;
      }

      // Veriyi formatla ve döndür
      return formatWeatherData(weatherData);
    } catch (error: any) {
      if (error.message.includes("OPENWEATHER_API_KEY")) {
        return `❌ Konfigürasyon hatası: ${error.message}`;
      }
      return `❌ Beklenmeyen hata: ${error.message}`;
    }
  }
});

// Tüm weather araçlarını export et
export const weatherTools = {
  getWeatherByCoordinates,
  getWeatherByCity
};
