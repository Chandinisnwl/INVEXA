import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import PitchDeck from '@/models/PitchDeck';
import StartupProfile from '@/models/StartupProfile';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const session = getUserFromRequest(request);
    if (!session || session.role !== 'startup') {
      return NextResponse.json(
        { error: 'Unauthorized: Startup privileges required' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await request.formData();
    const file = data.get('file');
    const title = data.get('title') || 'Series Pitch Deck';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validation: PDF only
    const mimeType = file.type;
    const name = file.name;
    const isPdf =
      mimeType === 'application/pdf' ||
      name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      return NextResponse.json(
        { error: 'Invalid file format. Only PDF documents are allowed.' },
        { status: 400 }
      );
    }

    // Size limit: 20MB
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit of 20MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads/decks
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'decks');
    await mkdir(uploadsDir, { recursive: true });

    const safeName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, safeName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/decks/${safeName}`;

    // Create or update PitchDeck record
    const deck = await PitchDeck.create({
      startupId: session.userId,
      title,
      fileName: name,
      fileUrl,
      fileSize: file.size,
      fileType: 'application/pdf',
      summary: `Pitch deck uploaded on ${new Date().toLocaleDateString()}`,
    });

    // Update StartupProfile pitchDeckUrl
    await StartupProfile.findOneAndUpdate(
      { userId: session.userId },
      { $set: { pitchDeckUrl: fileUrl } }
    );

    return NextResponse.json({
      success: true,
      message: 'Pitch deck successfully uploaded and verified',
      deck,
    });
  } catch (error) {
    console.error('Pitch deck upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing file upload' },
      { status: 500 }
    );
  }
}

