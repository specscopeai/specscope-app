import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY environment variable is not configured.' }, { status: 500 });
    }

    let trade = 'Division 23 - HVAC';
    let base64Data = '';
    let mimeType = 'application/pdf';
    let textContent = '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      trade = (formData.get('trade') as string) || trade;

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        base64Data = buffer.toString('base64');
        mimeType = file.type || 'application/pdf';
      }
    } else {
      const json = await req.json();
      trade = json.trade || trade;
      base64Data = json.pdfBase64 || '';
      textContent = json.textContent || '';
      if (json.mimeType) mimeType = json.mimeType;
    }

    const systemPrompt = `You are SpecScope AI, an elite commercial construction specification parser built for trade subcontractors.
Your task is to analyze the provided specification document for target trade: "${trade}".
Parse the contract requirements according to standard CSI MasterFormat 3-Part specifications (Part 1 General, Part 2 Products, Part 3 Execution).

Return ONLY a valid JSON object strictly matching this schema:
{
  "projectName": "Name of the project cited in the document or inferred from header/title",
  "trade": "${trade}",
  "scopeItems": [
    {
      "id": "S-1",
      "section": "CSI Section Number (e.g. 23 05 93)",
      "title": "Clear concise work item title",
      "detail": "Verbatim citation of contractor obligation, testing requirement, or material specification"
    }
  ],
  "exclusions": [
    {
      "item": "Work explicitly excluded from this division or assigned to another contractor",
      "assignedTo": "Assigned trade contractor (e.g. Division 26 - Electrical Contractor)"
    }
  ],
  "riskAlerts": [
    {
      "level": "HIGH" | "MED",
      "detail": "Liquidated damages penalty ($/day), strict submittal deadline, or high-risk warranty requirement"
    }
  ]
}`;

    const parts: any[] = [{ text: systemPrompt }];

    if (base64Data) {
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data
        }
      });
    } else if (textContent) {
      parts.push({ text: `Specification Text:\n${textContent}` });
    } else {
      // Fallback sample prompt if no file/text provided
      parts.push({ text: `Extract a realistic high-precision trade specification scope checklist for ${trade}.` });
    }

    const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
    let geminiData = null;
    let lastError = '';

    for (const model of candidateModels) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: {
                response_mime_type: 'application/json',
                temperature: 0.2
              }
            })
          }
        );

        if (geminiRes.ok) {
          geminiData = await geminiRes.json();
          break;
        } else {
          lastError = await geminiRes.text();
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (!geminiData) {
      return NextResponse.json({ error: 'Failed to process document with Gemini AI engine.', details: lastError }, { status: 502 });
    }
    const rawContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return NextResponse.json({ error: 'Empty response returned by AI extraction engine.' }, { status: 500 });
    }

    const parsedOutput = JSON.parse(rawContent);
    return NextResponse.json(parsedOutput);
  } catch (error: any) {
    console.error('Extract Route Error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred during extraction.' }, { status: 500 });
  }
}
