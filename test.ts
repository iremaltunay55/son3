// Test Script for Mastra Weather Agent
import { checkEnvironment, testWeatherAgent } from "./mastra-weather-agent-native";

async function main() {
  console.log("🌤️ Mastra Türkçe Hava Durumu Agent'ı Test Scripti");
  console.log("=" * 60);
  
  // Environment variables kontrolü
  if (!checkEnvironment()) {
    console.log("\n❌ Test durduruluyor. Lütfen environment variables'ları ayarlayın.");
    process.exit(1);
  }
  
  console.log("\n🚀 Agent testleri başlıyor...");
  
  try {
    await testWeatherAgent();
    console.log("\n✅ Tüm testler tamamlandı!");
  } catch (error) {
    console.error("\n❌ Test sırasında hata oluştu:", error);
    process.exit(1);
  }
}

// Script'i çalıştır
main().catch(console.error);
