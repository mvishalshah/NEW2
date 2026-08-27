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

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment. Please check Settings > Secrets to configure your Gemini API Key.');
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

    const promptText = `Analyze this receipt, bill, invoice, or UPI payment screenshot with high precision.
Extract all details exactly as visible in the image without hallucinating or inventing any items:
- merchantName: The exact name of the store, restaurant, vendor, or recipient printed on the receipt.
- date: The transaction date in YYYY-MM-DD format (if DD/MM/YYYY or DD-MM-YY is visible, convert accurately to YYYY-MM-DD; default to today's date if missing).
- receiptNumber: Bill number, invoice #, token #, or UPI transaction ID/UTR if visible.
- category: Appropriate category ('Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Hostel', or 'Other').
- currency: 'INR' (or corresponding currency code).
- items: Array of line items with exact name, quantity (number), unitPrice (number), totalPrice (number), and confidence ('high', 'medium', or 'verify').
- subtotal: Sum of item amounts before tax/discounts.
- discount: Any discount applied (0 if none).
- tax: Total GST/tax amount (0 if none).
- serviceCharge: Service/delivery charge (0 if none).
- roundOff: Round off amount (0 if none).
- total: The final grand total payable amount printed on the receipt.
- confidenceOverall: 'high', 'medium', or 'low'.
- rawText: A complete verbatim text transcript of the receipt.
- upiRef: UPI UTR or reference number if present.

If the image is a single transaction summary or UPI screenshot without itemized lines, create 1 item representing the total bill with the merchant description. Ensure all numbers are valid numerical values.`;

    let response: any;
    let modelUsed = 'gemini-3.7-flash';

    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          imagePart,
          { text: promptText }
        ],
        config: {
          systemInstruction: "You are a strict, highly accurate OCR receipt parsing engine. Extract all text and numerical values precisely from the image. Never invent items or prices. Return purely valid JSON adhering to the schema.",
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              merchantName: { type: Type.STRING, description: 'The merchant, cafe, store, or vendor name' },
              date: { type: Type.STRING, description: 'Date of receipt in YYYY-MM-DD format' },
              receiptNumber: { type: Type.STRING, description: 'Bill number, invoice number, or UPI UTR reference' },
              category: { type: Type.STRING, description: 'Expense category e.g. Food, Hostel, Education, Shopping, Transport' },
              currency: { type: Type.STRING, description: 'Currency code e.g. INR' },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: 'Line item description' },
                    quantity: { type: Type.NUMBER, description: 'Quantity count' },
                    unitPrice: { type: Type.NUMBER, description: 'Unit price in INR' },
                    totalPrice: { type: Type.NUMBER, description: 'Line total price' },
                    confidence: { type: Type.STRING, description: 'Confidence level: high, medium, or verify' }
                  },
                  required: ['name', 'quantity', 'unitPrice', 'totalPrice', 'confidence']
                }
              },
              subtotal: { type: Type.NUMBER, description: 'Sum of items before tax/discounts' },
              discount: { type: Type.NUMBER, description: 'Total discount amount' },
              tax: { type: Type.NUMBER, description: 'Total tax/GST amount' },
              serviceCharge: { type: Type.NUMBER, description: 'Packaging/service fee' },
              roundOff: { type: Type.NUMBER, description: 'Round off adjustment' },
              total: { type: Type.NUMBER, description: 'Grand total payable' },
              confidenceOverall: { type: Type.STRING, description: 'Overall confidence: high, medium, or low' },
              rawText: { type: Type.STRING, description: 'Verbatim transcript of legible text' },
              upiRef: { type: Type.STRING, description: 'UPI UTR / Reference ID if present' }
            },
            required: ['merchantName', 'items', 'total']
          }
        }
      });
    } catch (primaryErr: any) {
      console.warn('Gemini 3.7 Flash failed, attempting gemini-2.5-flash fallback:', primaryErr.message);
      modelUsed = 'gemini-2.5-flash';
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          imagePart,
          { text: promptText }
        ],
        config: {
          systemInstruction: "You are a strict, highly accurate OCR receipt parsing engine. Extract all text and numerical values precisely from the image. Never invent items or prices. Return purely valid JSON adhering to the schema.",
          responseMimeType: 'application/json'
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
    
    // If no items extracted but total is present (e.g. single transaction receipt)
    if (rawItems.length === 0 && parsedJson.total) {
      rawItems = [
        {
          name: parsedJson.merchantName ? `Payment at ${parsedJson.merchantName}` : 'Expense Bill',
          quantity: 1,
          unitPrice: Number(parsedJson.total),
          totalPrice: Number(parsedJson.total),
          confidence: 'high'
        }
      ];
    }

    const items: OCRItem[] = rawItems.map((item: any, idx: number) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const totalPrice = Math.round(Number(item.totalPrice || item.unitPrice || 0) * 100) / 100;
      const unitPrice = item.unitPrice ? Math.round(Number(item.unitPrice) * 100) / 100 : Math.round((totalPrice / quantity) * 100) / 100;

      let confidence: 'high' | 'medium' | 'low' | 'verify' = 'high';
      if (item.confidence === 'verify' || item.confidence === 'low') {
        confidence = 'verify';
      } else if (item.confidence === 'medium') {
        confidence = 'medium';
      }

      return {
        id: `ocr_it_${Date.now()}_${idx}`,
        name: String(item.name || `Item ${idx + 1}`).trim(),
        quantity,
        unitPrice,
        totalPrice: totalPrice || (quantity * unitPrice),
        confidence,
        assignedUserIds: []
      };
    });

    const itemsSum = items.reduce((acc, cur) => acc + (cur.totalPrice || 0), 0);
    const subtotal = Number(parsedJson.subtotal) || Math.round(itemsSum * 100) / 100;
    const discount = Math.max(0, Number(parsedJson.discount) || 0);
    const tax = Math.max(0, Number(parsedJson.tax) || 0);
    const serviceCharge = Math.max(0, Number(parsedJson.serviceCharge) || 0);
    const roundOff = Number(parsedJson.roundOff) || 0;

    let total = Number(parsedJson.total);
    if (!total || isNaN(total) || total <= 0) {
      total = Math.round((subtotal + tax + serviceCharge - discount + roundOff) * 100) / 100;
    }

    // Valid categories mapping
    const validCategories: Array<'Food' | 'Transport' | 'Education' | 'Shopping' | 'Entertainment' | 'Hostel' | 'Other'> = [
      'Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Hostel', 'Other'
    ];
    let category = parsedJson.category;
    if (!validCategories.includes(category)) {
      const lower = String(parsedJson.category || parsedJson.merchantName || '').toLowerCase();
      if (lower.includes('cafe') || lower.includes('bistro') || lower.includes('food') || lower.includes('swiggy') || lower.includes('zomato') || lower.includes('pizza') || lower.includes('chai') || lower.includes('canteen') || lower.includes('restaurant')) {
        category = 'Food';
      } else if (lower.includes('uber') || lower.includes('ola') || lower.includes('rapido') || lower.includes('metro') || lower.includes('petrol') || lower.includes('fuel') || lower.includes('auto')) {
        category = 'Transport';
      } else if (lower.includes('book') || lower.includes('xerox') || lower.includes('print') || lower.includes('stationery') || lower.includes('course') || lower.includes('tution')) {
        category = 'Education';
      } else if (lower.includes('hostel') || lower.includes('rent') || lower.includes('electricity') || lower.includes('wifi') || lower.includes('maid') || lower.includes('cook')) {
        category = 'Hostel';
      } else if (lower.includes('blinkit') || lower.includes('zepto') || lower.includes('mart') || lower.includes('amazon') || lower.includes('flipkart') || lower.includes('store')) {
        category = 'Shopping';
      } else if (lower.includes('movie') || lower.includes('cinema') || lower.includes('pvr') || lower.includes('game') || lower.includes('bowling')) {
        category = 'Entertainment';
      } else {
        category = 'Other';
      }
    }

    const result: OCRReceiptResult = {
      merchantName: String(parsedJson.merchantName || 'Scanned Merchant').trim(),
      date: parsedJson.date || new Date().toISOString().split('T')[0],
      receiptNumber: parsedJson.receiptNumber || parsedJson.upiRef || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      category: category as any,
      currency: parsedJson.currency || 'INR',
      items,
      subtotal,
      discount,
      tax,
      serviceCharge,
      roundOff,
      total,
      confidenceOverall: (parsedJson.confidenceOverall === 'low' ? 'low' : parsedJson.confidenceOverall === 'medium' ? 'medium' : 'high'),
      rawText: parsedJson.rawText || `Merchant: ${parsedJson.merchantName}\nDate: ${parsedJson.date}\nTotal: ₹${total}`,
      upiRef: parsedJson.upiRef || undefined,
      isAiParsed: true,
      modelUsed
    };

    return result;
  } catch (err: any) {
    console.error('Gemini Multimodal OCR Error:', err);
    throw new Error(`AI OCR Processing failed: ${err.message || 'Unable to parse receipt image'}`);
  }
}

