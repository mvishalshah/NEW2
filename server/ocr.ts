import { GoogleGenAI, Type } from '@google/genai';
import { OCRReceiptResult, OCRItem } from '../src/types.js';

// Pre-built sample receipts for instant 1-click test
export const sampleReceiptTemplates: Record<string, OCRReceiptResult> = {
  cafe: {
    merchantName: 'Campus Bistro & Cafe',
    date: '2026-02-25',
    receiptNumber: 'CBC-9402',
    category: 'Food',
    currency: 'INR',
    items: [
      { id: 'it_c1', name: 'Paneer Tikka Sandwich', quantity: 2, unitPrice: 160, totalPrice: 320, confidence: 'high', assignedUserIds: [] },
      { id: 'it_c2', name: 'Iced Caramel Frappe', quantity: 2, unitPrice: 140, totalPrice: 280, confidence: 'high', assignedUserIds: [] },
      { id: 'it_c3', name: 'Peri-Peri French Fries Large', quantity: 1, unitPrice: 150, totalPrice: 150, confidence: 'high', assignedUserIds: [] },
      { id: 'it_c4', name: 'Chocolate Brownie with Ice Cream', quantity: 1, unitPrice: 120, totalPrice: 120, confidence: 'high', assignedUserIds: [] }
    ],
    subtotal: 870,
    discount: 50,
    tax: 41,
    serviceCharge: 0,
    roundOff: 0,
    total: 861,
    confidenceOverall: 'high',
    rawText: 'CAMPUS BISTRO & CAFE\nBill No: CBC-9402  Date: 25-02-2026\nPaneer Tikka Sandwich x2 = 320.00\nIced Caramel Frappe x2 = 280.00\nPeri-Peri Fries Large x1 = 150.00\nChoco Brownie Sundae x1 = 120.00\nSubtotal: 870.00\nDiscount: -50.00\nGST 5%: 41.00\nGrand Total: INR 861.00\nThank You Visit Again!',
    isAiParsed: true,
    modelUsed: 'gemini-3.7-flash'
  },
  groceries: {
    merchantName: 'Hostel Mart & Supermarket',
    date: '2026-02-24',
    receiptNumber: 'HM-88124',
    category: 'Hostel',
    currency: 'INR',
    items: [
      { id: 'it_g1', name: 'Maggi 2-Minute Noodles (12-Pack)', quantity: 2, unitPrice: 168, totalPrice: 336, confidence: 'high', assignedUserIds: [] },
      { id: 'it_g2', name: 'Amul Taaza Milk 1L (x3)', quantity: 3, unitPrice: 68, totalPrice: 204, confidence: 'high', assignedUserIds: [] },
      { id: 'it_g3', name: 'Nescafe Classic Jar 100g', quantity: 1, unitPrice: 295, totalPrice: 295, confidence: 'high', assignedUserIds: [] },
      { id: 'it_g4', name: 'Lays & Kurkure Combo Pack', quantity: 4, unitPrice: 40, totalPrice: 160, confidence: 'high', assignedUserIds: [] },
      { id: 'it_g5', name: 'Britannia Good Day Cookies (x4)', quantity: 4, unitPrice: 35, totalPrice: 140, confidence: 'high', assignedUserIds: [] },
      { id: 'it_g6', name: 'Handwash & Room Spray', quantity: 1, unitPrice: 215, totalPrice: 215, confidence: 'medium', assignedUserIds: [] }
    ],
    subtotal: 1350,
    discount: 30,
    tax: 0,
    serviceCharge: 0,
    roundOff: 0,
    total: 1320,
    confidenceOverall: 'high',
    rawText: 'HOSTEL MART & SUPERMARKET\nInv #HM-88124  24-Feb-2026\nMaggi 12pk x2 336\nAmul Milk 1L x3 204\nNescafe 100g 295\nSnacks Combo x4 160\nBiscuits Pack x4 140\nRoom Sanitizer & Spray 215\nTotal Items: 6\nDiscount: 30\nNET AMOUNT: Rs. 1,320.00',
    isAiParsed: true,
    modelUsed: 'gemini-3.7-flash'
  },
  stationery: {
    merchantName: 'Sri Balaji University Xerox & Book Depot',
    date: '2026-02-23',
    receiptNumber: 'SBU-3109',
    category: 'Education',
    currency: 'INR',
    items: [
      { id: 'it_s1', name: 'Engineering Drawing Spiral Notes', quantity: 3, unitPrice: 180, totalPrice: 540, confidence: 'high', assignedUserIds: [] },
      { id: 'it_s2', name: 'Lab Practical Record Books (x4)', quantity: 4, unitPrice: 95, totalPrice: 380, confidence: 'high', assignedUserIds: [] },
      { id: 'it_s3', name: 'Color A3 Project Prints (x15)', quantity: 15, unitPrice: 20, totalPrice: 300, confidence: 'high', assignedUserIds: [] },
      { id: 'it_s4', name: 'Binder Clips & Hardboard files', quantity: 2, unitPrice: 65, totalPrice: 130, confidence: 'medium', assignedUserIds: [] }
    ],
    subtotal: 1350,
    discount: 50,
    tax: 0,
    serviceCharge: 0,
    roundOff: 0,
    total: 1300,
    confidenceOverall: 'high',
    rawText: 'SRI BALAJI UNIVERSITY XEROX\n23/02/2026\nEngg Notes Spiral x3: 540\nLab Record x4: 380\nColor A3 Prints x15: 300\nStationery Binder: 130\nTotal: 1350. Disc: 50. Total: Rs 1300',
    isAiParsed: true,
    modelUsed: 'gemini-3.7-flash'
  }
};

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

export async function parseReceiptWithGemini(
  base64Image: string,
  mimeType: string = 'image/jpeg',
  sampleKey?: string
): Promise<OCRReceiptResult> {
  // If user explicitly picked a sample mock receipt for test/demo mode
  if (sampleKey && sampleReceiptTemplates[sampleKey]) {
    return JSON.parse(JSON.stringify(sampleReceiptTemplates[sampleKey]));
  }

  if (!base64Image) {
    throw new Error('No receipt image data provided for OCR analysis.');
  }

  const ai = getGenAI();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your environment variables or Secrets in AI Studio.');
  }

  try {
    // Clean base64 string if data URI header exists
    let cleanBase64 = base64Image.trim();
    if (cleanBase64.includes('base64,')) {
      const parts = cleanBase64.split('base64,');
      const match = parts[0].match(/data:(.*?);/);
      if (match && match[1]) {
        mimeType = match[1];
      }
      cleanBase64 = parts[1];
    }
    cleanBase64 = cleanBase64.replace(/\s+/g, '');
    if (mimeType === 'image/jpg') {
      mimeType = 'image/jpeg';
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: cleanBase64
      }
    };

    const promptText = `Analyze this receipt or image. Extract each product/item name and its exact numerical price. Output ONLY structured JSON containing an array of these items.`;

    let response: any;
    let modelUsed = 'gemini-3.6-flash';

    const systemInstruction = "You are an OCR data extractor. Output ONLY JSON. Extract the product names and their prices from the image.";

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          description: 'List of all extracted items and their prices',
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Product or item name' },
              price: { type: Type.NUMBER, description: 'Exact numerical price' }
            },
            required: ['name', 'price']
          }
        }
      },
      required: ['items']
    };

    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          imagePart,
          { text: promptText }
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema
        }
      });
    } catch (primaryErr: any) {
      console.warn('gemini-3.6-flash call failed, attempting gemini-pro:', primaryErr.message);
      modelUsed = 'gemini-pro';
      response = await ai.models.generateContent({
        model: 'gemini-pro',
        contents: [
          imagePart,
          { text: promptText }
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema
        }
      });
    }

    const rawOutput = response?.text?.trim() || '{}';
    let cleanJson = rawOutput;
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsedJson: any = {};
    try {
      parsedJson = JSON.parse(cleanJson);
    } catch (parseErr) {
      const match = cleanJson.match(/\{[\s\S]*\}/);
      if (match) {
        parsedJson = JSON.parse(match[0]);
      } else {
        throw new Error(`Failed to parse OCR response: ${cleanJson.slice(0, 120)}`);
      }
    }

    // Normalize and sanitize items
    let rawItems = Array.isArray(parsedJson.items) ? parsedJson.items : [];

    const items: OCRItem[] = rawItems.map((item: any, idx: number) => {
      const price = Math.round(Number(item.price || 0) * 100) / 100;

      return {
        id: `ocr_it_${Date.now()}_${idx}`,
        name: String(item.name || `Item ${idx + 1}`).trim(),
        quantity: 1,
        unitPrice: price,
        totalPrice: price,
        confidence: 'high',
        assignedUserIds: []
      };
    });

    const itemsSum = items.reduce((acc, cur) => acc + (cur.totalPrice || 0), 0);
    const subtotal = Math.round(itemsSum * 100) / 100;
    const discount = 0;
    const tax = 0;
    const serviceCharge = 0;
    const roundOff = 0;
    const total = subtotal;

    const category = 'Other';

    const result: OCRReceiptResult = {
      merchantName: '',
      date: new Date().toISOString().split('T')[0],
      receiptNumber: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      category: category as any,
      currency: 'INR',
      items,
      subtotal,
      discount,
      tax,
      serviceCharge,
      roundOff,
      total,
      confidenceOverall: 'high',
      rawText: 'Simple Table Parsing Mode',
      isAiParsed: true,
      modelUsed
    };

    return result;
  } catch (err: any) {
    console.error('Gemini Multimodal OCR Error:', err);
    throw err;
  }
}

