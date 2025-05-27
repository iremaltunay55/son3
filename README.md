# Weather Forecast MCP Server

Bu Model Context Protocol (MCP) server, enlem ve boylam koordinatlarını kullanarak OpenWeatherMap API'sinden gerçek zamanlı hava durumu bilgilerini getirir.

## 🌟 Özellikler

- **Koordinat bazlı hava durumu**: Enlem ve boylam ile hassas konum bilgisi
- **Şehir bazlı hava durumu**: Şehir adı ile kolay sorgulama
- **Detaylı bilgiler**: Sıcaklık, nem, basınç, rüzgar, görünürlük
- **Türkçe destek**: Hava durumu açıklamaları Türkçe
- **Smithery entegrasyonu**: Kolay deployment ve konfigürasyon

## 📋 Gereksinimler

- Python 3.10 veya üzeri
- OpenWeatherMap API key (ücretsiz)

## 🚀 Kurulum

### 1. OpenWeatherMap API Key Alma

1. [OpenWeatherMap](https://openweathermap.org/api) sitesine gidin
2. Ücretsiz hesap oluşturun
3. API Keys bölümünden API key'inizi alın

### 2. Yerel Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/yourusername/weather-forecast-mcp.git
cd weather-forecast-mcp

# Sanal ortam oluşturun
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Environment variable ayarlayın
export OPENWEATHER_API_KEY="your_api_key_here"

# Server'ı test edin
python server.py
```

### 3. Smithery ile Deployment

1. [Smithery](https://smithery.ai/) hesabınıza giriş yapın
2. "Deploy Server" butonuna tıklayın
3. GitHub repository URL'inizi girin
4. API key'inizi konfigürasyonda belirtin

## 🛠️ Kullanım

### Koordinatlarla Hava Durumu

```python
# İstanbul koordinatları
latitude = 41.0082
longitude = 28.9784

# Fonksiyon çağrısı
get_weather_by_coordinates(latitude=41.0082, longitude=28.9784)
```

### Şehir Adıyla Hava Durumu

```python
# Şehir adı ile
get_weather_by_city(city_name="Istanbul", country_code="TR")

# Sadece şehir adı
get_weather_by_city(city_name="London")
```

## 📊 Örnek Çıktı

```
🌍 Konum: Istanbul, TR

🌡️ Sıcaklık Bilgileri:
• Mevcut Sıcaklık: 15.2°C
• Hissedilen: 14.8°C
• En Düşük: 12.1°C
• En Yüksek: 18.3°C

☁️ Hava Durumu: Parçalı Bulutlu (Clouds)

💧 Nem: 65%
🔽 Basınç: 1013 hPa
💨 Rüzgar: 3.2 m/s (245°)
👁️ Görünürlük: 10.0 km
```

## 🔧 Konfigürasyon

### Environment Variables

- `OPENWEATHER_API_KEY`: OpenWeatherMap API anahtarınız (zorunlu)

### API Limitleri

OpenWeatherMap ücretsiz plan limitleri:
- Dakikada 60 çağrı
- Ayda 1,000,000 çağrı
- Sadece mevcut hava durumu (geçmiş veriler yok)

## 🐛 Hata Ayıklama

### Yaygın Hatalar

1. **API Key Hatası**
   ```
   ❌ Konfigürasyon hatası: OPENWEATHER_API_KEY environment variable gerekli
   ```
   Çözüm: API key'inizi doğru şekilde ayarlayın

2. **Koordinat Hatası**
   ```
   ❌ Hata: Enlem -90 ile 90 arasında olmalıdır.
   ```
   Çözüm: Geçerli koordinat değerleri girin

3. **Şehir Bulunamadı**
   ```
   ❌ 'XYZ' şehri için hava durumu verisi bulunamadı.
   ```
   Çözüm: Şehir adını doğru yazın veya ülke kodu ekleyin

## 📝 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 Destek

- Issues: [GitHub Issues](https://github.com/yourusername/weather-forecast-mcp/issues)
- Email: your-email@example.com

## 🔗 Bağlantılar

- [OpenWeatherMap API](https://openweathermap.org/api)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Smithery Platform](https://smithery.ai/)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
