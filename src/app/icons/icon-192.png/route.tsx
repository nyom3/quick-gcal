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
          fontSize: 112,
          fontWeight: 800,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        G
      </div>
    ),
    { width: 192, height: 192 }
  );
}
