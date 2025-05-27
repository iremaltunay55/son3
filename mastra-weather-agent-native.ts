// Mastra Weather Agent - Native TypeScript Implementation
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { weatherTools } from "./mastra-weather-tools";

// Türkçe Hava Durumu Agent'ı - Native TypeScript
export const turkishWeatherAgentNative = new Agent({
  name: "Turkish Weather Assistant Native",
  description: "Türkçe hava durumu asistanı - şehir adı veya koordinatlarla hava durumu bilgilerini getirir (Native TypeScript)",
  instructions: `
Sen bir Türkçe hava durumu asistanısın. Kullanıcıların belirli bir konum için hava durumu bilgilerini almalarına yardımcı olursun.

Görevlerin:
1. Kullanıcıdan konum bilgisi iste (şehir adı veya koordinatlar)
2. Verilen konuma göre hava durumu bilgilerini getir
3. Sonuçları kullanıcıya anlaşılır bir şekilde sun

Kullanabileceğin araçlar:
- get_weather_by_city: Şehir adına göre hava durumu bilgilerini getirir
- get_weather_by_coordinates: Enlem ve boylam koordinatlarına göre hava durumu bilgilerini getirir

Önemli notlar:
- Kullanıcı bir şehir adı verdiğinde get_weather_by_city aracını kullan
- Kullanıcı koordinat verdiğinde get_weather_by_coordinates aracını kullan
- Sonuçları her zaman okunaklı ve düzenli bir şekilde sun
- Hava durumu bilgilerini Türkçe olarak açıkla
- Kullanıcıya her zaman yardımcı ve nazik davran

Kullanıcı belirsiz bir konum verirse, daha spesifik bilgi iste.
Örneğin: "İstanbul", "Ankara", "41.0082, 28.9784" gibi.
  `,
  model: openai("gpt-4o-mini"),
  tools: weatherTools, // Native TypeScript araçları
});

// Mastra instance'ı
import { Mastra } from "@mastra/core";

export const mastra = new Mastra({
  agents: { 
    turkishWeatherAgentNative 
  },
});

// Agent'ı kullanım örnekleri
export async function getWeatherResponse(userMessage: string) {
  try {
    const response = await turkishWeatherAgentNative.generate([
      { role: "user", content: userMessage }
    ], {
      maxSteps: 3, // Tool kullanımı için adım sayısı
    });

    return response.text;
  } catch (error) {
    console.error("Hava durumu bilgisi alınırken hata:", error);
    return "Üzgünüm, hava durumu bilgisini şu anda alamıyorum. Lütfen daha sonra tekrar deneyin.";
  }
}

// Streaming response örneği
export async function getWeatherStreamResponse(userMessage: string) {
  try {
    const stream = await turkishWeatherAgentNative.stream([
      { role: "user", content: userMessage }
    ], {
      maxSteps: 3,
      onStepFinish: ({ text, toolCalls, toolResults }) => {
        console.log("Adım tamamlandı:", { text, toolCalls, toolResults });
      },
      onFinish: ({ steps, text, finishReason, usage }) => {
        console.log("Stream tamamlandı:", {
          totalSteps: steps.length,
          finishReason,
          usage,
        });
      },
    });

    return stream;
  } catch (error) {
    console.error("Streaming hava durumu bilgisi alınırken hata:", error);
    throw error;
  }
}

// Test fonksiyonu
export async function testWeatherAgent() {
  console.log("🚀 Türkçe Hava Durumu Agent'ı test ediliyor...");
  
  const testMessages = [
    "İstanbul'un hava durumu nasıl?",
    "Ankara için hava durumu bilgisi ver",
    "41.0082, 28.9784 koordinatlarının hava durumu",
    "London'un hava durumu"
  ];

  for (const message of testMessages) {
    console.log(`\n📝 Test: "${message}"`);
    try {
      const response = await getWeatherResponse(message);
      console.log("🤖 Agent Yanıtı:", response);
    } catch (error) {
      console.error("❌ Hata:", error);
    }
    console.log("-".repeat(50));
  }
}

// Environment variables kontrolü
export function checkEnvironment() {
  const requiredEnvVars = [
    'OPENWEATHER_API_KEY',
    'OPENAI_API_KEY'
  ];

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error("❌ Eksik environment variables:", missing);
    console.log("📝 .env dosyanızda şunları tanımlayın:");
    missing.forEach(envVar => {
      console.log(`${envVar}=your_${envVar.toLowerCase()}_here`);
    });
    return false;
  }
  
  console.log("✅ Tüm environment variables tanımlı");
  return true;
}
