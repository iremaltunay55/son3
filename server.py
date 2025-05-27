#!/usr/bin/env python3
"""
Weather Forecast MCP Server

Bu MCP server enlem ve boylam koordinatlarını alarak
OpenWeatherMap API'sinden hava durumu bilgilerini getirir.
"""

import os
import asyncio
import json
from typing import Any, Dict
import httpx
from mcp.server.fastmcp import FastMCP

# MCP server'ı başlat
mcp = FastMCP("weather-forecast")

# API ayarları
OPENWEATHER_API_BASE = "https://api.openweathermap.org/data/2.5"
USER_AGENT = "weather-forecast-mcp/1.0"

def get_api_key() -> str:
    """OpenWeatherMap API key'ini environment variable'dan al"""
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        raise ValueError("OPENWEATHER_API_KEY environment variable gerekli")
    return api_key

async def make_weather_request(url: str) -> Dict[str, Any] | None:
    """OpenWeatherMap API'sine istek gönder"""
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            print(f"HTTP error: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error: {e}")
            return None

def format_weather_data(data: Dict[str, Any]) -> str:
    """Hava durumu verisini okunabilir formata çevir"""
    if not data:
        return "Hava durumu verisi alınamadı."
    
    try:
        # Ana bilgiler
        location = data.get("name", "Bilinmeyen konum")
        country = data.get("sys", {}).get("country", "")
        if country:
            location += f", {country}"
        
        # Sıcaklık bilgileri (Kelvin'den Celsius'a çevir)
        main = data.get("main", {})
        temp = main.get("temp")
        feels_like = main.get("feels_like")
        temp_min = main.get("temp_min")
        temp_max = main.get("temp_max")
        humidity = main.get("humidity")
        pressure = main.get("pressure")
        
        # Hava durumu açıklaması
        weather = data.get("weather", [{}])[0]
        description = weather.get("description", "Bilinmiyor")
        main_weather = weather.get("main", "")
        
        # Rüzgar bilgileri
        wind = data.get("wind", {})
        wind_speed = wind.get("speed")
        wind_deg = wind.get("deg")
        
        # Görünürlük
        visibility = data.get("visibility")
        
        # Formatlanmış çıktı
        result = f"""
🌍 Konum: {location}

🌡️ Sıcaklık Bilgileri:
• Mevcut Sıcaklık: {temp - 273.15:.1f}°C
• Hissedilen: {feels_like - 273.15:.1f}°C
• En Düşük: {temp_min - 273.15:.1f}°C
• En Yüksek: {temp_max - 273.15:.1f}°C

☁️ Hava Durumu: {description.title()} ({main_weather})

💧 Nem: {humidity}%
🔽 Basınç: {pressure} hPa"""

        if wind_speed:
            result += f"\n💨 Rüzgar: {wind_speed} m/s"
            if wind_deg:
                result += f" ({wind_deg}°)"
        
        if visibility:
            result += f"\n👁️ Görünürlük: {visibility/1000:.1f} km"
        
        return result
        
    except Exception as e:
        return f"Veri formatlanırken hata oluştu: {str(e)}"

@mcp.tool()
async def get_weather_by_coordinates(latitude: float, longitude: float) -> str:
    """
    Enlem ve boylam koordinatlarına göre hava durumu bilgilerini getir.
    
    Args:
        latitude: Enlem (-90 ile 90 arası)
        longitude: Boylam (-180 ile 180 arası)
    """
    # Koordinat doğrulaması
    if not (-90 <= latitude <= 90):
        return "❌ Hata: Enlem -90 ile 90 arasında olmalıdır."
    
    if not (-180 <= longitude <= 180):
        return "❌ Hata: Boylam -180 ile 180 arasında olmalıdır."
    
    try:
        # API key'i al
        api_key = get_api_key()
        
        # API URL'ini oluştur
        url = f"{OPENWEATHER_API_BASE}/weather"
        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": api_key,
            "lang": "tr"  # Türkçe açıklamalar için
        }
        
        # URL'i parametrelerle birleştir
        param_string = "&".join([f"{k}={v}" for k, v in params.items()])
        full_url = f"{url}?{param_string}"
        
        # API'den veri al
        weather_data = await make_weather_request(full_url)
        
        if not weather_data:
            return "❌ Hava durumu verisi alınamadı. API'de bir sorun olabilir."
        
        # Veriyi formatla ve döndür
        return format_weather_data(weather_data)
        
    except ValueError as e:
        return f"❌ Konfigürasyon hatası: {str(e)}"
    except Exception as e:
        return f"❌ Beklenmeyen hata: {str(e)}"

@mcp.tool()
async def get_weather_by_city(city_name: str, country_code: str = "") -> str:
    """
    Şehir adına göre hava durumu bilgilerini getir.
    
    Args:
        city_name: Şehir adı
        country_code: Ülke kodu (opsiyonel, örn: TR, US)
    """
    try:
        # API key'i al
        api_key = get_api_key()
        
        # Şehir adını hazırla
        location = city_name
        if country_code:
            location += f",{country_code}"
        
        # API URL'ini oluştur
        url = f"{OPENWEATHER_API_BASE}/weather"
        params = {
            "q": location,
            "appid": api_key,
            "lang": "tr"
        }
        
        # URL'i parametrelerle birleştir
        param_string = "&".join([f"{k}={v}" for k, v in params.items()])
        full_url = f"{url}?{param_string}"
        
        # API'den veri al
        weather_data = await make_weather_request(full_url)
        
        if not weather_data:
            return f"❌ '{city_name}' şehri için hava durumu verisi bulunamadı."
        
        # Veriyi formatla ve döndür
        return format_weather_data(weather_data)
        
    except ValueError as e:
        return f"❌ Konfigürasyon hatası: {str(e)}"
    except Exception as e:
        return f"❌ Beklenmeyen hata: {str(e)}"

if __name__ == "__main__":
    # Server'ı başlat
    mcp.run(transport='stdio')
