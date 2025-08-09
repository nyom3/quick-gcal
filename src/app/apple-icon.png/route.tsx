import { ImageResponse } from 'next/og';

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
          fontSize: 120,
          fontWeight: 800,
          fontFamily: 'system-ui, sans-serif',
          borderRadius: 40,
        }}
      >
        G
      </div>
    ),
    { width: 180, height: 180 }
  );
}
