// Mastra Weather Agent - MCP Client Entegrasyonu
import { Agent } from "@mastra/core/agent";
import { MCPClient } from "@mastra/mcp";
import { openai } from "@ai-sdk/openai";

// MCP Client konfigürasyonu - Python server'ınızı kullanır
const mcp = new MCPClient({
  servers: {
    weatherServer: {
      // Python MCP server'ınızın HTTP endpoint'i
      url: new URL("https://server.smithery.ai/@iremaltunay55/son3/mcp?api_key=179b8005-e61c-4265-919a-3e05dd92f7e4&profile=fundamental-bee-QNUkdz"),
      requestInit: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    },
  },
});

// Türkçe Hava Durumu Agent'ı
export const turkishWeatherAgent = new Agent({
  name: "Turkish Weather Assistant",
  description: "Türkçe hava durumu asistanı - şehir adı veya koordinatlarla hava durumu bilgilerini getirir",
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
  `,
  model: openai("gpt-4o-mini"),
  tools: await mcp.getTools(), // Python MCP server'ınızdan araçları alır
});

// Agent'ı kullanım örneği
export async function getWeatherResponse(userMessage: string) {
  try {
    const response = await turkishWeatherAgent.generate([
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
    const stream = await turkishWeatherAgent.stream([
      { role: "user", content: userMessage }
    ], {
      maxSteps: 3,
      onStepFinish: ({ text, toolCalls, toolResults }) => {
        console.log("Adım tamamlandı:", { text, toolCalls, toolResults });
      },
    });

    return stream;
  } catch (error) {
    console.error("Streaming hava durumu bilgisi alınırken hata:", error);
    throw error;
  }
}
