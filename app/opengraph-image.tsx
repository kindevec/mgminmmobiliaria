import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'Sociedad Civil MGM Inmobiliaria - Lotes y Proyectos en Ecuador';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          backgroundImage:
            'radial-gradient(circle at 50% 50%, #ffffff 0%, #f8fafc 100%)',
          position: 'relative',
        }}
      >
        {/* Subtle geometric framing */}
        <div
          style={{
            position: 'absolute',
            inset: '30px',
            border: '2px solid rgba(34, 163, 61, 0.15)',
            borderRadius: '24px',
            display: 'flex',
          }}
        />

        {/* Central Brand Box with 90px safe margins so WhatsApp 1:1 mobile crop stays flawless */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
            maxWidth: '560px',
          }}
        >
          {/* Logo SVG rendering */}
          <svg
            width="340"
            height="270"
            viewBox="0 0 500 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top orange gable */}
            <path
              d="M 250,30 L 285,75 L 285,220 L 273,220 L 273,85 L 250,55 L 227,85 L 227,220 L 215,220 L 215,75 Z"
              fill="#F58220"
            />
            {/* Middle green gable */}
            <path
              d="M 250,90 L 320,170 L 320,220 L 308,220 L 308,177 L 250,110 L 192,177 L 192,220 L 180,220 L 180,170 Z"
              fill="#22A33D"
            />
            {/* Lower orange gable */}
            <path
              d="M 250,140 L 355,250 L 355,220 L 250,115 L 145,220 L 145,250 Z"
              fill="#F58220"
            />
            <rect x="145" y="175" width="12" height="45" fill="#F58220" />
            <rect x="343" y="175" width="12" height="45" fill="#F58220" />

            {/* Window */}
            <rect x="238" y="147" width="10" height="10" rx="1.5" fill="#22A33D" />
            <rect x="252" y="147" width="10" height="10" rx="1.5" fill="#22A33D" />
            <rect x="238" y="161" width="10" height="10" rx="1.5" fill="#22A33D" />
            <rect x="252" y="161" width="10" height="10" rx="1.5" fill="#22A33D" />

            {/* Left M */}
            <path
              d="M 85,230 L 138,230 L 175,300 L 212,230 L 220,230 L 220,360 L 180,360 L 180,287 L 150,345 L 128,345 L 125,287 L 125,360 L 85,360 Z"
              fill="#22A33D"
            />
            {/* Center G */}
            <path
              d="M 250,228 C 285,228 312,252 312,295 C 312,338 285,362 250,362 C 215,362 195,335 195,295 C 195,255 216,228 250,228 Z M 250,260 C 235,260 227,273 227,295 C 227,317 235,330 250,330 C 263,330 272,319 274,307 L 246,307 L 246,283 L 305,283 C 306,287 306,291 306,295 C 306,330 285,355 250,355 C 218,355 200,330 200,295 C 200,260 218,235 250,235 Z"
              fill="#F58220"
            />
            {/* Right M */}
            <path
              d="M 280,230 L 288,230 L 325,300 L 362,230 L 415,230 L 415,360 L 375,360 L 375,287 L 372,345 L 350,345 L 320,287 L 320,360 L 280,360 Z"
              fill="#22A33D"
            />
          </svg>

          {/* Typography */}
          <div
            style={{
              fontSize: '24px',
              fontWeight: 800,
              letterSpacing: '3px',
              color: '#0F172A',
              marginTop: '16px',
              textAlign: 'center',
            }}
          >
            SOCIEDAD CIVIL MGM INMOBILIARIA
          </div>

          <div
            style={{
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              color: '#22A33D',
              marginTop: '8px',
              textAlign: 'center',
            }}
          >
            LOTES URBANIZADOS & CIUDADELA MIRAVALLE · ECUADOR
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
