# Mastra Türkçe Hava Durumu Agent'ı

Bu proje, Mastra framework kullanılarak geliştirilmiş Türkçe hava durumu asistanıdır. OpenWeatherMap API'sini kullanarak gerçek zamanlı hava durumu bilgilerini sağlar.

## 🌟 Özellikler

- **Türkçe Destek**: Tam Türkçe konuşma ve hava durumu açıklamaları
- **Çoklu Sorgulama**: Şehir adı veya koordinatlarla hava durumu
- **Mastra Framework**: Modern TypeScript agent framework
- **Tool Integration**: Native Mastra tool'ları
- **Streaming Support**: Gerçek zamanlı yanıtlar
- **Error Handling**: Kapsamlı hata yönetimi

## 📋 Gereksinimler

- Node.js 18+ 
- TypeScript
- OpenWeatherMap API key (ücretsiz)
- OpenAI API key

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Environment Variables Ayarlayın

```bash
# .env dosyası oluşturun
cp .env.example .env

# API key'lerinizi ekleyin
OPENWEATHER_API_KEY=your_openweathermap_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. API Key'leri Alın

**OpenWeatherMap:**
1. [OpenWeatherMap](https://openweathermap.org/api) sitesine gidin
2. Ücretsiz hesap oluşturun
3. API Keys bölümünden key'inizi alın

**OpenAI:**
1. [OpenAI Platform](https://platform.openai.com/api-keys) sitesine gidin
2. API key oluşturun

## 🛠️ Kullanım

### Development Server

```bash
npm run dev
```

Server `http://localhost:4111` adresinde çalışacak.

### Agent'ı Test Etme

```bash
npm run test
```

### API Kullanımı

```bash
# Şehir ile hava durumu
curl -X POST http://localhost:4111/api/agents/turkishWeatherAgentNative/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "İstanbul'\''un hava durumu nasıl?" }
    ]
  }'

# Koordinatlarla hava durumu
curl -X POST http://localhost:4111/api/agents/turkishWeatherAgentNative/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "41.0082, 28.9784 koordinatlarının hava durumu" }
    ]
  }'
```

## 📊 Örnek Kullanım

### Programatik Kullanım

```typescript
import { getWeatherResponse } from "./mastra-weather-agent-native";

// Basit kullanım
const response = await getWeatherResponse("Ankara'nın hava durumu nasıl?");
console.log(response);

// Streaming kullanım
const stream = await getWeatherStreamResponse("İstanbul hava durumu");
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

### Örnek Çıktı

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

### Mastra Config

`mastra.config.ts` dosyasında agent konfigürasyonunu özelleştirebilirsiniz:

```typescript
export default defineConfig({
  name: "Turkish Weather Agent",
  dev: {
    port: 4111, // Development port
  },
  // ... diğer ayarlar
});
```

### Agent Ayarları

Agent'ın davranışını `mastra-weather-agent-native.ts` dosyasında özelleştirebilirsiniz:

```typescript
export const turkishWeatherAgentNative = new Agent({
  name: "Turkish Weather Assistant Native",
  instructions: "...", // Agent talimatları
  model: openai("gpt-4o-mini"), // Model seçimi
  tools: weatherTools, // Kullanılacak araçlar
});
```

## 🔄 Python MCP Server ile Entegrasyon

Mevcut Python MCP server'ınızı da kullanabilirsiniz:

```typescript
import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    weatherServer: {
      url: new URL("https://server.smithery.ai/@iremaltunay55/son3/mcp?api_key=..."),
    },
  },
});

// Python server'ınızdan araçları kullan
const tools = await mcp.getTools();
```

## 🐛 Hata Ayıklama

### Yaygın Hatalar

1. **API Key Hatası**
   ```
   ❌ Konfigürasyon hatası: OPENWEATHER_API_KEY environment variable gerekli
   ```
   Çözüm: `.env` dosyasında API key'inizi kontrol edin

2. **Şehir Bulunamadı**
   ```
   ❌ 'XYZ' şehri için hava durumu verisi bulunamadı.
   ```
   Çözüm: Şehir adını doğru yazın veya ülke kodu ekleyin

3. **Koordinat Hatası**
   ```
   ❌ Hata: Enlem -90 ile 90 arasında olmalıdır.
   ```
   Çözüm: Geçerli koordinat değerleri girin

## 📝 Lisans

MIT License

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 🔗 Bağlantılar

- [Mastra Framework](https://mastra.ai/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Smithery Platform](https://smithery.ai/)
