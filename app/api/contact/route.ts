import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
}

// PayloadCMS API endpoint - adjust this URL based on your PayloadCMS setup
const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3000/api';
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Prepare data for PayloadCMS
    const contactData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      company: body.company?.trim() || '',
      phone: body.phone?.trim() || '',
      subject: body.subject.trim(),
      message: body.message.trim(),
      status: 'new',
      priority: 'medium'
    };

    // Send to PayloadCMS
    const payloadResponse = await fetch(`${PAYLOAD_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(PAYLOAD_SECRET && { 'Authorization': `Bearer ${PAYLOAD_SECRET}` })
      },
      body: JSON.stringify(contactData)
    });

    if (!payloadResponse.ok) {
      const errorText = await payloadResponse.text();
      console.error('PayloadCMS API Error:', {
        status: payloadResponse.status,
        statusText: payloadResponse.statusText,
        body: errorText
      });
      
      return NextResponse.json(
        { error: 'Failed to save contact information' },
        { status: 500 }
      );
    }

    const savedContact = await payloadResponse.json();
    
    // Log successful submission (remove in production if not needed)
    console.log('Contact form submitted successfully:', {
      id: savedContact.doc?.id,
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject
    });

    // Return success response
    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully',
        id: savedContact.doc?.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}