import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0ea5e9',
          color: '#fff',
          fontSize: 64,
          fontWeight: 800,
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: 2,
        }}
      >
        Quick GCal (narrow)
      </div>
    ),
    { width: 720, height: 1280 }
  );
}

