import { TransactionType } from "../types";

export interface ParsedSms {
  originalText: string;
  amount: number;
  type: TransactionType;
  description: string;
  bankName: string;
  date: string;
}

// Mock SMS Templates for Simulation
export const MOCK_SMS_MESSAGES = [
  "HDFC Bank: Rs 1,250.00 debited from a/c **4321 on 24-02-25 to SWIGGY. Avl Bal: INR 45,000. Not you? Call 1800...",
  "Acct XX8899 credited with Rs 45,000.00 on 24-Feb-25. Info: SALARY CREDITED. Avl Bal Rs 1,50,000.",
  "Dear User, Your A/c X1234 is debited for Rs.340.00 on 24-02-25. Info: UPI/STARBUCKS. Avl Bal: Rs 5000.",
  "Sent Rs. 850.00 to UBER RIDES from HDFC Bank A/c via UPI. Ref 23948293.",
  "ICICI Bank: Acct XX777 debited for Rs 199.00; NETFLIX.COM via Card on 20-02-25.",
  "Spent Rs 4,500.00 at ZARA on 22-02-25. Avl Bal Rs 12,000. - SBI Card",
  "Rs 2000.00 withdrawn from ATM ID 12345 on 23-02-25. Avl Bal: 10000.",
  "Alert: A/C X9900 credited with INR 5,000.00 by transfer from RAJESH KUMAR. Ref: IMPS123.",
];

export const parseSms = (text: string): ParsedSms | null => {
  try {
    // 1. Extract Amount
    // Matches: Rs. 100, INR 100, Rs 100, ₹100, etc.
    const amountRegex = /(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)/i;
    const amountMatch = text.match(amountRegex);
    
    if (!amountMatch) return null;
    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));

    // 2. Determine Type (Credit or Debit)
    let type = TransactionType.DEBIT;
    const creditKeywords = ['credited', 'received', 'added', 'deposited', 'refund'];
    if (creditKeywords.some(kw => text.toLowerCase().includes(kw))) {
      type = TransactionType.CREDIT;
    }

    // 3. Extract Merchant/Description using Heuristics
    let description = "";

    // Clean text for analysis (replace amount with placeholder to avoid parsing confusion)
    const cleanText = text.replace(amountMatch[0], 'AMOUNT');

    if (type === TransactionType.DEBIT) {
        // Debit Patterns: "to X", "at X", "paid X"
        const toMatch = cleanText.match(/(?:to|at|paid)\s+([A-Za-z0-9\s&.-]+?)(?:\s+(?:on|via|Ref|Bal|Avl|from|Ending)|$)/i);
        
        if (toMatch) {
            description = toMatch[1].trim();
        } else if (cleanText.toLowerCase().includes("withdrawn")) {
            description = "Cash Withdrawal";
        } else {
             // Fallback: Look for "Info: X" or similar (common in UPI)
             const infoMatch = cleanText.match(/(?:Info|Narr|Rem|Remarks|VPA)[:\/-]\s*([A-Za-z0-9\s@.-]+)/i);
             if (infoMatch) description = infoMatch[1].trim();
        }
    } else {
        // Credit Patterns: "from X", "by X"
         const fromMatch = cleanText.match(/(?:from|by)\s+([A-Za-z0-9\s&.-]+?)(?:\s+(?:on|via|Ref|Bal|Avl)|$)/i);
         if (fromMatch) {
             description = fromMatch[1].trim();
         } else {
             const infoMatch = cleanText.match(/(?:Info|Narr|Rem|Remarks)[:\/-]\s*([A-Za-z0-9\s@.-]+)/i);
             if (infoMatch) description = infoMatch[1].trim();
         }
    }

    // Specific UPI handling if description is still generic or looks like a VPA
    if ((!description || description.length < 3) && cleanText.includes("UPI")) {
         if (cleanText.includes("/")) {
             // e.g., UPI/MERCHANTNAME/REF
             const parts = cleanText.split('/');
             const upiIndex = parts.findIndex(p => p.includes("UPI"));
             if (upiIndex !== -1 && parts[upiIndex + 1]) {
                 description = parts[upiIndex + 1];
             }
         }
    }

    // Final Fallback
    if (!description || description.length < 2) {
         description = type === TransactionType.CREDIT ? "Deposit" : "Purchase";
    }

    // 4. Clean up Description
    description = description
        .replace(/a\/c|account|bank|txn|ref|no\.|imps|neft|rtgs|funds trf|transfer/gi, '') // Remove banking noise
        .replace(/[:.]/g, '') // Remove punctuation
        .trim();

    // Capitalize properly
    if (description.length > 0) {
        description = description.charAt(0).toUpperCase() + description.slice(1).toLowerCase();
    }
    
    // Truncate if too long
    if (description.length > 25) description = description.substring(0, 25) + '...';
    
    // 5. Extract Bank Name
    let bankName = "Unknown Bank";
    const bankKeywords = [
        "HDFC", "SBI", "ICICI", "AXIS", "KOTAK", "BOB", "PNB", "IDFC", 
        "PAYTM", "GPAY", "PHONEPE", "AMEX", "CITI", "HSBC", "RBL", "INDUSIND"
    ];
    
    const foundBank = bankKeywords.find(b => text.toUpperCase().includes(b));
    if (foundBank) {
        bankName = foundBank + (['PAYTM','GPAY','PHONEPE'].includes(foundBank) ? '' : ' Bank');
    }
    
    // Check for UPI specific hint
    if (text.includes('UPI') && !bankName.includes('UPI')) {
        bankName = bankName === "Unknown Bank" ? "UPI" : `UPI / ${bankName}`;
    }

    return {
      originalText: text,
      amount,
      type,
      description,
      bankName,
      date: new Date().toISOString().split('T')[0]
    };

  } catch (e) {
    console.error("Failed to parse SMS", e);
    return null;
  }
};