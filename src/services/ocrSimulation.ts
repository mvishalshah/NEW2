import { OCRReceiptResult, OCRItem } from '../types.js';

export interface SimulatedReceiptTemplate {
  merchantName: string;
  category: string;
  items: Array<{ name: string; quantity: number; unitPrice: number }>;
  taxRate: number; // e.g. 0.05 for 5% GST
  discount: number;
}

const SAMPLE_RECEIPT_TEMPLATES: SimulatedReceiptTemplate[] = [
  {
    merchantName: 'Campus Bistro & Cafe',
    category: 'Food',
    items: [
      { name: 'Veg Grilled Club Sandwich', quantity: 2, unitPrice: 180 },
      { name: 'Crispy Peri Peri French Fries', quantity: 1, unitPrice: 160 },
      { name: 'Cold Hazelnut Frappe', quantity: 2, unitPrice: 150 },
      { name: 'Extra Cheese Dip', quantity: 1, unitPrice: 21 }
    ],
    taxRate: 0.05,
    discount: 0
  },
  {
    merchantName: 'Hostel 4 Supermart & Snacks',
    category: 'Hostel',
    items: [
      { name: 'Maggi 2-Minute Noodles Family Pack (12x)', quantity: 2, unitPrice: 160 },
      { name: 'Amul Taaza Milk Tetra Pack 1L', quantity: 4, unitPrice: 75 },
      { name: 'Haldiram Aloo Bhujia 400g', quantity: 2, unitPrice: 125 },
      { name: 'Odonil Room Freshener Spray 220ml', quantity: 1, unitPrice: 200 },
      { name: 'Nescafe Classic Instant Coffee Jar 100g', quantity: 1, unitPrice: 250 }
    ],
    taxRate: 0,
    discount: 30
  },
  {
    merchantName: 'Balaji Xerox & Stationary Mart',
    category: 'Education',
    items: [
      { name: 'Operating Systems & DBMS Spiral Notes (x5)', quantity: 5, unitPrice: 150 },
      { name: 'Engineering Lab Manual Hardcover Record', quantity: 3, unitPrice: 110 },
      { name: 'A4 Printing Paper Ream (500 sheets)', quantity: 1, unitPrice: 220 }
    ],
    taxRate: 0,
    discount: 0
  },
  {
    merchantName: 'Domino’s Pizza Hub',
    category: 'Food',
    items: [
      { name: 'Farmhouse Large Cheese Burst Pizza', quantity: 1, unitPrice: 580 },
      { name: 'Stuffed Garlic Bread & Cheese Dip', quantity: 2, unitPrice: 150 },
      { name: 'Pepsi 750ml Pet Bottle', quantity: 2, unitPrice: 60 }
    ],
    taxRate: 0.05,
    discount: 50
  },
  {
    merchantName: 'Chai Point & College Canteen',
    category: 'Food',
    items: [
      { name: 'Ginger Masala Cutting Chai (x4)', quantity: 4, unitPrice: 25 },
      { name: 'Bun Maska & Butter Toast', quantity: 3, unitPrice: 45 },
      { name: 'Paneer Patties / Samosa Plate', quantity: 4, unitPrice: 35 }
    ],
    taxRate: 0.05,
    discount: 0
  }
];

/**
 * Placeholder processing function to simulate AI OCR parsing on a receipt image.
 * Extracts merchant name, total amount, taxes, date, and itemized lines with simulated progress steps.
 */
export async function simulateAIOCRReceiptParsing(
  imageBase64?: string,
  sampleKey?: string,
  onProgress?: (status: string) => void
): Promise<OCRReceiptResult> {
  const updateProgress = (text: string) => {
    if (onProgress) onProgress(text);
  };

  updateProgress('Detecting document edges & receipt boundaries...');
  await new Promise((r) => setTimeout(r, 600));

  updateProgress('Performing neural character recognition & bounding box detection...');
  await new Promise((r) => setTimeout(r, 700));

  updateProgress('Extracting Merchant Name and Header metadata...');
  await new Promise((r) => setTimeout(r, 600));

  updateProgress('Extracting Total Amount, taxes, and itemized prices...');
  await new Promise((r) => setTimeout(r, 600));

  // Determine template to use
  let template: SimulatedReceiptTemplate;
  if (sampleKey === 'cafe') {
    template = SAMPLE_RECEIPT_TEMPLATES[0];
  } else if (sampleKey === 'groceries') {
    template = SAMPLE_RECEIPT_TEMPLATES[1];
  } else if (sampleKey === 'stationery') {
    template = SAMPLE_RECEIPT_TEMPLATES[2];
  } else {
    // Pick a template randomly or based on image characteristics
    const idx = Math.floor(Math.random() * SAMPLE_RECEIPT_TEMPLATES.length);
    template = SAMPLE_RECEIPT_TEMPLATES[idx];
  }

  // Calculate subtotal
  const items: OCRItem[] = template.items.map((it, i) => {
    const totalPrice = Math.round(it.quantity * it.unitPrice * 100) / 100;
    return {
      id: `it_ocr_${Date.now()}_${i}`,
      name: it.name,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      totalPrice: totalPrice,
      confidence: (i === 0 ? 'high' : i === 2 ? 'medium' : 'high') as 'high' | 'medium',
      assignedUserIds: []
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = template.taxRate > 0 ? Math.round(subtotal * template.taxRate * 100) / 100 : 0;
  const discount = template.discount || 0;
  const serviceCharge = 0;
  const total = Math.round((subtotal + tax + serviceCharge - discount) * 100) / 100;

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const receiptNumber = `REC-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    merchantName: template.merchantName,
    date: dateStr,
    receiptNumber,
    items,
    subtotal,
    tax,
    discount,
    serviceCharge,
    total,
    confidenceOverall: 'high',
    rawText: `=== ${template.merchantName} ===\nDate: ${dateStr}\nBill No: ${receiptNumber}\nSubtotal: ₹${subtotal}\nTax: ₹${tax}\nTotal: ₹${total}`
  };
}
