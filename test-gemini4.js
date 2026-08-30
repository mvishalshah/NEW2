import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI();
async function test() {
  try {
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              price: { type: Type.NUMBER }
            },
            required: ['name', 'price']
          }
        }
      },
      required: ['items']
    };
    const res = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: [
        { inlineData: { mimeType: 'image/png', data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAANSURBVBhXY3jP4PgfAAWpA6FCAyZJAAAAAElFTkSuQmCC' } },
        { text: 'hello' }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema
      }
    });
    console.log(res.text);
  } catch (e) {
    console.error("FLASH ERROR:", e);
  }
}
test();
