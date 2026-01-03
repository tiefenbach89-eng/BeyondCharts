// app/api/parse-tr-pdf/route.ts
import { NextResponse } from 'next/server';

export const runtime = "nodejs";


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Get file as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Use dynamic require for pdf-parse (CommonJS)
    const pdfParse = require('pdf-parse/lib/pdf-parse.js');
    
    // Extract text
    const data = await pdfParse(buffer);
    const text = data.text;
    
    console.log('Extracted text:', text);
    
    // Parse TR format
    const parsed = parseTRDocument(text);
    
    console.log('Parsed result:', parsed);
    
    if (!parsed.isin) {
      return NextResponse.json(
        { error: 'Konnte ISIN nicht finden. Ist das eine Trade Republic Wertpapierabrechnung?' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(parsed);
    
  } catch (error: any) {
    console.error('PDF parse error:', error);
    return NextResponse.json(
      { error: error.message || 'Fehler beim Parsen' },
      { status: 500 }
    );
  }
}

function parseTRDocument(text: string) {
  console.log('Parsing text:', text.substring(0, 500));
  
  let name = '';
  let isin = '';
  let shares = 0;
  let price = 0;
  
  // Clean text
  const clean = text.replace(/\s+/g, ' ').trim();
  
  // Find ISIN
  const isinMatch = clean.match(/ISIN:?\s*([A-Z]{2}[A-Z0-9]{10})/i);
  if (isinMatch) {
    isin = isinMatch[1];
    console.log('Found ISIN:', isin);
  }
  
  // Find name - between POSITION header and ISIN
  const nameMatch = clean.match(/POSITION\s+ANZAHL\s+PREIS\s+BETRAG\s+([^I]+?)\s*ISIN/i);
  if (nameMatch) {
    name = nameMatch[1].trim();
    console.log('Found name:', name);
  }
  
  // Find shares
  const sharesMatch = clean.match(/([\d,]+)\s*Stk\.?/i);
  if (sharesMatch) {
    shares = parseFloat(sharesMatch[1].replace(',', '.'));
    console.log('Found shares:', shares);
  }
  
  // Find price - get all EUR values
  const eurMatches = clean.match(/([\d,]+)\s*EUR/gi);
  if (eurMatches && eurMatches.length >= 2) {
    // Second EUR value is typically unit price
    const priceMatch = eurMatches[1].match(/([\d,]+)/);
    if (priceMatch) {
      price = parseFloat(priceMatch[1].replace(',', '.'));
      console.log('Found price:', price);
    }
  }
  
  // Get ticker
  const ticker = getTickerFromISIN(isin, name);
  
  return {
    name,
    isin,
    ticker,
    shares,
    price,
  };
}

function getTickerFromISIN(isin: string, name: string): string {
  const mapping: {[key: string]: string} = {
    'US81762P1021': 'NOW',
    'US0378331005': 'AAPL',
    'US5949181045': 'MSFT',
    'US67066G1040': 'NVDA',
    'US30303M1027': 'META',
    'US88160R1014': 'TSLA',
    'US0231351067': 'AMZN',
    'US02079K3059': 'GOOGL',
  };
  
  return mapping[isin] || name.split(' ')[0].toUpperCase();
}
