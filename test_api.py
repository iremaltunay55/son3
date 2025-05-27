#!/usr/bin/env python3
"""
Weather API Test Script
OpenWeatherMap API'sini test etmek için basit script
"""

import os
import asyncio
import httpx

# API ayarları
OPENWEATHER_API_KEY = "6b2e97b1b6559436aee37b83b71412b3"
OPENWEATHER_API_BASE = "https://api.openweathermap.org/data/2.5"

async def test_weather_api():
    """OpenWeatherMap API'sini test et"""
    
    # İstanbul koordinatları
    latitude = 41.0082
    longitude = 28.9784
    
    url = f"{OPENWEATHER_API_BASE}/weather"
    params = {
        "lat": latitude,
        "lon": longitude,
        "appid": OPENWEATHER_API_KEY,
        "lang": "tr"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            print(f"🌍 API Test: İstanbul ({latitude}, {longitude})")
            print(f"🔗 URL: {url}")
            print(f"📝 Parametreler: {params}")
            print("-" * 50)
            
            response = await client.get(url, params=params, timeout=30.0)
            print(f"📊 Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ API çağrısı başarılı!")
                print(f"📍 Konum: {data.get('name')}, {data.get('sys', {}).get('country')}")
                
                # Sıcaklık bilgileri
                main = data.get('main', {})
                temp = main.get('temp', 0) - 273.15  # Kelvin'den Celsius'a
                feels_like = main.get('feels_like', 0) - 273.15
                humidity = main.get('humidity', 0)
                
                print(f"🌡️ Sıcaklık: {temp:.1f}°C")
                print(f"🌡️ Hissedilen: {feels_like:.1f}°C")
                print(f"💧 Nem: {humidity}%")
                
                # Hava durumu
                weather = data.get('weather', [{}])[0]
                description = weather.get('description', 'Bilinmiyor')
                print(f"☁️ Hava Durumu: {description}")
                
                return True
            else:
                print(f"❌ API hatası: {response.status_code}")
                print(f"📄 Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Hata: {str(e)}")
            return False

if __name__ == "__main__":
    print("🚀 OpenWeatherMap API Test Başlıyor...")
    print("=" * 50)
    
    result = asyncio.run(test_weather_api())
    
    print("=" * 50)
    if result:
        print("🎉 Test başarılı! API çalışıyor.")
    else:
        print("💥 Test başarısız! API'de sorun var.")
