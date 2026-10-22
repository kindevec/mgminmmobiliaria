import React from 'react';

interface VectorProps {
  className?: string;
}

// 1. Vías Adoquinadas: Calzada con Adoquines, Bordillo, Cuneta, Luminaria LED y Árbol
export const CivilRoadVector: React.FC<VectorProps> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 420 360"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="road-top-surface" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#cbd5e1" />
        <stop offset="60%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>

      <linearGradient id="road-curb-top" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>

      <linearGradient id="road-sidewalk" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>

      <linearGradient id="road-soil-left-1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
      <linearGradient id="road-soil-left-2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="road-soil-left-3" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#9a3412" />
      </linearGradient>

      <linearGradient id="road-soil-right-1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="road-soil-right-2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>

      <linearGradient id="road-pole-metal" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#64748b" />
        <stop offset="50%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
      <linearGradient id="road-lamp-light" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#eab308" stopOpacity="0.1" />
      </linearGradient>

      <linearGradient id="road-tree-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      <linearGradient id="road-tree-canopy-1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
      <linearGradient id="road-tree-canopy-2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>

    {/* Sombra de apoyo */}
    <ellipse cx="210" cy="305" rx="155" ry="40" fill="#0f172a" opacity="0.14" />

    {/* Cara Lateral Izquierda (Subrasante y Suelo) */}
    <g>
      <path d="M 50 170 L 210 262 L 210 274 L 50 182 Z" fill="url(#road-soil-left-1)" />
      <path d="M 50 182 L 210 274 L 210 292 L 50 200 Z" fill="url(#road-soil-left-2)" />
      <path d="M 50 200 L 210 292 L 210 310 L 50 218 Z" fill="url(#road-soil-left-3)" />
      <path d="M 50 182 L 210 274" stroke="#64748b" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M 50 200 L 210 292" stroke="#451a03" strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="95" cy="225" r="2" fill="#d97706" opacity="0.4" />
      <circle cx="140" cy="250" r="1.5" fill="#f59e0b" opacity="0.3" />
      <circle cx="175" cy="272" r="2" fill="#b45309" opacity="0.4" />
    </g>

    {/* Cara Lateral Derecha (Cimiento de Acera) */}
    <g>
      <path d="M 210 262 L 370 170 L 370 182 L 210 274 Z" fill="url(#road-soil-right-1)" />
      <path d="M 210 274 L 370 182 L 370 200 L 210 292 Z" fill="url(#road-soil-right-2)" />
      <path d="M 210 292 L 370 200 L 370 218 L 210 310 Z" fill="#3b1b08" />
      <path d="M 210 274 L 370 182" stroke="#1e293b" strokeWidth="1" strokeOpacity="0.6" />
      <path d="M 210 292 L 370 200" stroke="#1e293b" strokeWidth="1" strokeOpacity="0.6" />
      <circle cx="250" cy="268" r="2" fill="#78350f" opacity="0.5" />
      <circle cx="300" cy="238" r="2.5" fill="#92400e" opacity="0.4" />
    </g>

    {/* Calzada Principal de Adoquín */}
    <g>
      <path d="M 50 170 L 210 78 L 305 132 L 145 224 Z" fill="url(#road-top-surface)" />

      {/* Juntas de Adoquines Isométricos */}
      <g stroke="#475569" strokeWidth="0.85" strokeOpacity="0.45" strokeLinecap="round">
        <line x1="70" y1="158" x2="225" y2="70" />
        <line x1="90" y1="170" x2="245" y2="82" />
        <line x1="110" y1="181" x2="265" y2="94" />
        <line x1="130" y1="193" x2="285" y2="105" />

        <line x1="100" y1="114" x2="72" y2="130" />
        <line x1="130" y1="97" x2="92" y2="119" />
        <line x1="160" y1="80" x2="112" y2="108" />
        <line x1="150" y1="143" x2="112" y2="165" />
        <line x1="180" y1="126" x2="132" y2="154" />
        <line x1="210" y1="108" x2="152" y2="142" />
        <line x1="190" y1="172" x2="152" y2="194" />
        <line x1="220" y1="155" x2="172" y2="183" />
        <line x1="250" y1="137" x2="192" y2="171" />
      </g>

      {/* Demarcación Vial Central Blanca */}
      <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.95">
        <line x1="85" y1="185" x2="115" y2="168" />
        <line x1="140" y1="153" x2="170" y2="136" />
        <line x1="195" y1="122" x2="225" y2="105" />
        <line x1="250" y1="91" x2="275" y2="76" />
      </g>

      {/* Cuneta y Sumidero Pluvial */}
      <polygon points="135,218 145,224 295,138 285,132" fill="#334155" />
      <polygon points="180,188 195,197 225,180 210,171" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
      <line x1="185" y1="188" x2="192" y2="192" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="193" y1="184" x2="200" y2="188" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="201" y1="179" x2="208" y2="183" stroke="#94a3b8" strokeWidth="1.2" />

      {/* Bordillo de Hormigón Armado */}
      <polygon points="145,224 210,262 210,257 145,219" fill="#94a3b8" />
      <polygon points="145,219 210,257 370,165 305,127" fill="url(#road-curb-top)" />

      {/* Acera Peatonal Elevada */}
      <polygon points="152,215 210,248 370,156 312,123" fill="url(#road-sidewalk)" />
      <g stroke="#94a3b8" strokeWidth="0.75" strokeOpacity="0.6">
        <line x1="180" y1="198" x2="330" y2="112" />
        <line x1="210" y1="181" x2="350" y2="100" />
        <line x1="225" y1="215" x2="255" y2="232" />
        <line x1="255" y1="198" x2="285" y2="215" />
        <line x1="285" y1="181" x2="315" y2="198" />
        <line x1="315" y1="163" x2="345" y2="180" />
      </g>
    </g>

    {/* Árbol Ornamental en Acera */}
    <g>
      <polygon points="275,200 295,212 315,200 295,188" fill="#451a03" stroke="#78350f" strokeWidth="1" />
      <polygon points="278,200 295,210 312,200 295,190" fill="#291202" />
      <ellipse cx="295" cy="204" rx="20" ry="8" fill="#0f172a" opacity="0.25" />

      <path d="M 293 202 L 297 202 L 296 155 L 294 155 Z" fill="url(#road-tree-trunk)" />
      <path d="M 294 165 L 285 150 M 296 160 L 306 148" stroke="#58240c" strokeWidth="2.5" strokeLinecap="round" />

      <circle cx="295" cy="142" r="26" fill="#14532d" />
      <circle cx="282" cy="148" r="16" fill="#166534" />
      <circle cx="310" cy="146" r="16" fill="#15803d" />
      <circle cx="295" cy="136" r="22" fill="url(#road-tree-canopy-2)" />
      <circle cx="282" cy="138" r="14" fill="#22c55e" />
      <circle cx="308" cy="136" r="14" fill="url(#road-tree-canopy-1)" />
      <circle cx="292" cy="128" r="16" fill="url(#road-tree-canopy-1)" />
      <ellipse cx="288" cy="124" rx="9" ry="6" fill="#86efac" opacity="0.8" />
    </g>

    {/* Poste de Alumbrado Público Doble LED */}
    <g>
      <polygon points="230,225 240,231 248,226 238,220" fill="#334155" stroke="#64748b" strokeWidth="0.8" />
      <circle cx="239" cy="226" r="1.5" fill="#f8fafc" />
      <path d="M 238 225 L 238 75 L 241 75 L 241 225 Z" fill="url(#road-pole-metal)" />
      <rect x="237" y="205" width="5" height="8" rx="1" fill="#1e293b" />

      {/* Brazo Izquierdo (Calzada) */}
      <path d="M 239 85 C 239 70, 215 62, 195 68" fill="none" stroke="url(#road-pole-metal)" strokeWidth="3" strokeLinecap="round" />
      <polygon points="186,67 200,63 204,69 190,73" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
      <polygon points="188,71 202,67 200,70 186,74" fill="#fef08a" />
      <polygon points="193,73 130,175 220,135" fill="url(#road-lamp-light)" opacity="0.3" />

      {/* Brazo Derecho (Acera) */}
      <path d="M 239 98 C 245 90, 260 88, 272 94" fill="none" stroke="url(#road-pole-metal)" strokeWidth="2.2" strokeLinecap="round" />
      <polygon points="270,93 280,90 283,95 273,98" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
      <polygon points="271,96 281,93 280,95 270,98" fill="#fef08a" />
      <path d="M 237 75 L 239.5 68 L 242 75 Z" fill="#94a3b8" />
    </g>
  </svg>
);

// 2. Redes Soterradas: Zanja Técnica, Agua Potable Azul, Ductos Naranjas, Colector Pluvial y Tapa de Registro
export const CivilServicesVector: React.FC<VectorProps> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 420 360"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="serv-top-pavement" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="60%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>

      <linearGradient id="serv-pipe-blue-top" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="35%" stopColor="#3b82f6" />
        <stop offset="85%" stopColor="#1d4ed8" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>

      <linearGradient id="serv-pipe-orange" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fed7aa" />
        <stop offset="35%" stopColor="#f97316" />
        <stop offset="85%" stopColor="#c2410c" />
        <stop offset="100%" stopColor="#7c2d12" />
      </linearGradient>

      <linearGradient id="serv-pipe-gray" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="35%" stopColor="#64748b" />
        <stop offset="85%" stopColor="#334155" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>

      <linearGradient id="serv-trench-wall" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3f2314" />
        <stop offset="100%" stopColor="#5a331c" />
      </linearGradient>

      <linearGradient id="serv-gravel-bed" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d6d3d1" />
        <stop offset="50%" stopColor="#a8a29e" />
        <stop offset="100%" stopColor="#78716c" />
      </linearGradient>

      <linearGradient id="serv-soil-strata-left" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="50%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>

      <linearGradient id="serv-soil-strata-right" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#451a03" />
        <stop offset="50%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#291202" />
      </linearGradient>
    </defs>

    <ellipse cx="210" cy="305" rx="155" ry="40" fill="#0f172a" opacity="0.14" />

    {/* Estratificación Izquierda */}
    <g>
      <path d="M 50 170 L 140 222 L 140 236 L 50 184 Z" fill="#64748b" />
      <path d="M 50 184 L 140 236 L 140 262 L 50 210 Z" fill="url(#serv-soil-strata-left)" />
      <path d="M 50 210 L 140 262 L 140 310 L 50 258 Z" fill="#451a03" />
      <path d="M 50 184 L 140 236" stroke="#94a3b8" strokeWidth="0.8" strokeOpacity="0.5" />
      <path d="M 50 210 L 140 262" stroke="#291202" strokeWidth="1" strokeOpacity="0.6" />
    </g>

    {/* Estratificación Derecha */}
    <g>
      <path d="M 290 216 L 370 170 L 370 238 L 290 284 Z" fill="url(#serv-soil-strata-right)" />
      <path d="M 290 284 L 370 238 L 370 258 L 290 304 Z" fill="#291202" />
      <path d="M 290 236 L 370 190" stroke="#78350f" strokeWidth="1" strokeOpacity="0.5" />
      <path d="M 290 260 L 370 214" stroke="#451a03" strokeWidth="1" strokeOpacity="0.6" />
    </g>

    {/* Pavimento Superior */}
    <g>
      <polygon points="50,170 210,78 370,170 290,216 190,158 140,187 85,155" fill="url(#serv-top-pavement)" />
      <g stroke="#94a3b8" strokeWidth="0.75" strokeOpacity="0.45">
        <line x1="85" y1="150" x2="235" y2="64" />
        <line x1="120" y1="130" x2="270" y2="44" />
        <line x1="155" y1="150" x2="295" y2="70" />
        <line x1="180" y1="135" x2="330" y2="221" />
      </g>

      {/* Tapa de Registro de Hierro Dúctil */}
      <polygon points="215,125 245,108 275,125 245,142" fill="#334155" stroke="#475569" strokeWidth="1.2" />
      <polygon points="220,125 245,111 270,125 245,139" fill="#1e293b" />
      <polygon points="227,125 245,115 263,125 245,135" fill="none" stroke="#64748b" strokeWidth="0.9" />
      <line x1="240" y1="125" x2="250" y2="125" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="245" cy="125" r="1.5" fill="#f8fafc" />
    </g>

    {/* Zanja Técnica Excavada */}
    <polygon points="140,187 190,158 290,216 240,245" fill="url(#serv-trench-wall)" />
    <polygon points="140,187 140,250 180,273 180,210" fill="#361b0c" />
    <polygon points="290,216 290,279 250,302 250,239" fill="#241005" />
    <polygon points="140,250 180,273 280,215 240,192" fill="url(#serv-gravel-bed)" />

    {/* 1. Tubería Matriz Pluvial / Alcantarillado */}
    <g>
      <path d="M 160 262 L 260 204 L 260 224 L 160 282 Z" fill="url(#serv-pipe-gray)" />
      <ellipse cx="160" cy="272" rx="14" ry="10" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
      <ellipse cx="160" cy="272" rx="10" ry="7" fill="#020617" />
      <path d="M 153 275 Q 160 279 167 275 Q 160 277 153 275 Z" fill="#38bdf8" opacity="0.7" />
      <path d="M 205 236 L 210 233 L 210 253 L 205 256 Z" fill="#94a3b8" />
    </g>

    {/* 2. Tubería Matriz de Agua Potable Azul */}
    <g>
      <path d="M 150 238 L 250 180 L 250 196 L 150 254 Z" fill="url(#serv-pipe-blue-top)" />
      <line x1="151" y1="240" x2="249" y2="182" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9" />
      <ellipse cx="150" cy="246" rx="9" ry="8" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="1.8" />
      <ellipse cx="150" cy="246" rx="6" ry="5" fill="#1e3a8a" />
      <ellipse cx="150" cy="246" rx="4" ry="3.5" fill="#60a5fa" opacity="0.6" />
      <path d="M 195 212 L 201 208 L 201 224 L 195 228 Z" fill="#1e40af" stroke="#3b82f6" strokeWidth="0.8" />
      <ellipse cx="198" cy="204" rx="6" ry="3" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.8" />
      <line x1="198" y1="204" x2="198" y2="210" stroke="#94a3b8" strokeWidth="1.5" />
    </g>

    {/* 3. Ductos Eléctricos y Fibra Óptica Naranja */}
    <g>
      <path d="M 172 216 L 272 158 L 272 168 L 172 226 Z" fill="url(#serv-pipe-orange)" />
      <line x1="173" y1="217" x2="271" y2="159" stroke="#ffedd5" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="172" cy="221" rx="6" ry="5" fill="#ea580c" stroke="#c2410c" strokeWidth="1.2" />
      <ellipse cx="172" cy="221" rx="3.5" ry="3" fill="#431407" />

      <path d="M 184 223 L 284 165 L 284 175 L 184 233 Z" fill="url(#serv-pipe-orange)" />
      <line x1="185" y1="224" x2="283" y2="166" stroke="#ffedd5" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="184" cy="228" rx="6" ry="5" fill="#ea580c" stroke="#c2410c" strokeWidth="1.2" />
      <ellipse cx="184" cy="228" rx="3.5" ry="3" fill="#431407" />
      <polygon points="220,188 226,184 226,204 220,208" fill="#1e293b" />
    </g>

    {/* 4. Cinta Señalizadora de Advertencia */}
    <path d="M 160 195 Q 210 162 260 138" fill="none" stroke="#facc15" strokeWidth="4" strokeLinecap="square" />
    <path d="M 160 195 Q 210 162 260 138" fill="none" stroke="#000000" strokeWidth="4" strokeDasharray="5 7" />

    {/* Frente de Zanja */}
    <path d="M 140 236 L 210 276 L 210 310 L 140 270 Z" fill="#5c2e0b" />
    <path d="M 210 276 L 290 230 L 290 264 L 210 310 Z" fill="#3b1b08" />
  </svg>
);

// 3. +8.000m² Áreas Verdes: Parque Ecológico, Caminería Sinuosa, Pinos y Árbol Frondoso
export const CivilParkVector: React.FC<VectorProps> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 420 360"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="park-lawn" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="40%" stopColor="#4ade80" />
        <stop offset="75%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>

      <linearGradient id="park-trail" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>

      <linearGradient id="park-soil-left-1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#14532d" />
        <stop offset="30%" stopColor="#3f2314" />
        <stop offset="100%" stopColor="#291202" />
      </linearGradient>
      <linearGradient id="park-soil-left-2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>

      <linearGradient id="park-soil-right" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#166534" />
        <stop offset="25%" stopColor="#291202" />
        <stop offset="70%" stopColor="#451a03" />
        <stop offset="100%" stopColor="#1c0b02" />
      </linearGradient>

      <linearGradient id="park-pine-light" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
      <linearGradient id="park-pine-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#15803d" />
        <stop offset="100%" stopColor="#052e16" />
      </linearGradient>
    </defs>

    <ellipse cx="210" cy="305" rx="155" ry="40" fill="#0f172a" opacity="0.14" />

    {/* Sustrato Geotécnico Izquierdo */}
    <g>
      <path d="M 50 170 L 210 262 L 210 280 L 50 188 Z" fill="url(#park-soil-left-1)" />
      <path d="M 50 188 L 210 280 L 210 310 L 50 218 Z" fill="url(#park-soil-left-2)" />
      <path d="M 50 188 L 210 280" stroke="#16a34a" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M 50 202 L 210 294" stroke="#78350f" strokeWidth="0.8" strokeOpacity="0.5" />
    </g>

    {/* Sustrato Geotécnico Derecho */}
    <g>
      <path d="M 210 262 L 370 170 L 370 218 L 210 310 Z" fill="url(#park-soil-right)" />
      <path d="M 210 280 L 370 188" stroke="#14532d" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M 210 294 L 370 202" stroke="#291202" strokeWidth="0.8" strokeOpacity="0.6" />
    </g>

    {/* Césped Principal */}
    <path d="M 50 170 L 210 78 L 370 170 L 210 262 Z" fill="url(#park-lawn)" />

    {/* Caminería Ecológica Sinuosa */}
    <g>
      <path d="M 70 182 C 120 195, 150 160, 200 185 C 250 210, 290 170, 350 182" fill="none" stroke="#ca8a04" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 70 182 C 120 195, 150 160, 200 185 C 250 210, 290 170, 350 182" fill="none" stroke="url(#park-trail)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 70 182 C 120 195, 150 160, 200 185 C 250 210, 290 170, 350 182" fill="none" stroke="#fef9c3" strokeWidth="2" strokeDasharray="4 8" strokeLinecap="round" />
    </g>

    {/* Banco de Parque */}
    <g>
      <ellipse cx="230" cy="182" rx="14" ry="5" fill="#0f172a" opacity="0.25" />
      <polygon points="220,175 235,167 245,173 230,181" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
      <polygon points="220,172 235,164 235,167 220,175" fill="#b45309" />
      <line x1="222" y1="180" x2="222" y2="183" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="242" y1="172" x2="242" y2="175" stroke="#1e293b" strokeWidth="1.5" />
    </g>

    {/* 1. Pino Conífero Izquierdo */}
    <g>
      <ellipse cx="135" cy="142" rx="18" ry="7" fill="#0f172a" opacity="0.3" />
      <rect x="133" y="125" width="4" height="18" fill="#451a03" rx="1" />
      <polygon points="135,85 110,130 135,130" fill="url(#park-pine-light)" />
      <polygon points="135,85 135,130 160,130" fill="url(#park-pine-dark)" />
      <polygon points="135,70 115,110 135,110" fill="url(#park-pine-light)" />
      <polygon points="135,70 135,110 155,110" fill="url(#park-pine-dark)" />
      <polygon points="135,55 120,90 135,90" fill="#86efac" />
      <polygon points="135,55 135,90 150,90" fill="url(#park-pine-light)" />
    </g>

    {/* 2. Pino Conífero Central */}
    <g>
      <ellipse cx="210" cy="105" rx="15" ry="6" fill="#0f172a" opacity="0.3" />
      <rect x="208" y="92" width="3.5" height="15" fill="#451a03" rx="1" />
      <polygon points="210,60 188,100 210,100" fill="url(#park-pine-light)" />
      <polygon points="210,60 210,100 232,100" fill="url(#park-pine-dark)" />
      <polygon points="210,45 194,80 210,80" fill="#86efac" />
      <polygon points="210,45 210,80 226,80" fill="url(#park-pine-light)" />
      <polygon points="210,32 198,62 210,62" fill="#bbf7d0" />
      <polygon points="210,32 210,62 222,62" fill="#4ade80" />
    </g>

    {/* 3. Gran Árbol Frondoso Deciduo */}
    <g>
      <ellipse cx="295" cy="155" rx="30" ry="12" fill="#0f172a" opacity="0.35" />
      <path d="M 292 153 L 297 153 L 296 110 L 293 110 Z" fill="#451a03" />
      <path d="M 294 125 L 282 110 M 295 120 L 308 108" stroke="#58240c" strokeWidth="3" strokeLinecap="round" />
      <circle cx="295" cy="98" r="32" fill="#052e16" />
      <circle cx="275" cy="105" r="22" fill="#14532d" />
      <circle cx="315" cy="102" r="22" fill="#166534" />
      <circle cx="295" cy="90" r="28" fill="#15803d" />
      <circle cx="278" cy="95" r="20" fill="#22c55e" />
      <circle cx="312" cy="92" r="20" fill="url(#park-pine-light)" />
      <circle cx="290" cy="80" r="22" fill="url(#park-pine-light)" />
      <ellipse cx="285" cy="74" rx="14" ry="9" fill="#86efac" opacity="0.85" />
      <circle cx="308" cy="82" r="14" fill="#4ade80" />
    </g>

    {/* Arbustos de Primer Plano */}
    <g>
      <circle cx="95" cy="172" r="9" fill="#15803d" />
      <circle cx="93" cy="169" r="7" fill="#4ade80" />
      <circle cx="96" cy="169" r="1.5" fill="#f43f5e" />
      <circle cx="235" cy="218" r="11" fill="#166534" />
      <circle cx="233" cy="214" r="9" fill="#22c55e" />
      <circle cx="236" cy="215" r="1.8" fill="#ec4899" />
    </g>
  </svg>
);

// 4. Topografía Plana: Curvas de Nivel, Estratos Geotécnicos Horizontales, Estación Total y Mira de Precisión
export const CivilTopographyVector: React.FC<VectorProps> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 420 360"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="topo-surface-plane" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bef264" />
        <stop offset="35%" stopColor="#a3e635" />
        <stop offset="70%" stopColor="#84cc16" />
        <stop offset="100%" stopColor="#4d7c0f" />
      </linearGradient>

      <linearGradient id="topo-soil-left-1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3f6212" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="topo-soil-left-2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <linearGradient id="topo-soil-left-3" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#451a03" />
        <stop offset="100%" stopColor="#291202" />
      </linearGradient>

      <linearGradient id="topo-soil-right-1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#365314" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      <linearGradient id="topo-soil-right-2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#291202" />
      </linearGradient>

      <linearGradient id="topo-rod-silver" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="50%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
    </defs>

    <ellipse cx="210" cy="305" rx="155" ry="40" fill="#0f172a" opacity="0.14" />

    {/* Estratos Geotécnicos Horizontales Izquierda */}
    <g>
      <path d="M 50 170 L 210 262 L 210 276 L 50 184 Z" fill="url(#topo-soil-left-1)" />
      <path d="M 50 184 L 210 276 L 210 294 L 50 202 Z" fill="url(#topo-soil-left-2)" />
      <path d="M 50 202 L 210 294 L 210 310 L 50 218 Z" fill="url(#topo-soil-left-3)" />
      <path d="M 50 184 L 210 276" stroke="#4d7c0f" strokeWidth="1.2" strokeOpacity="0.6" />
      <path d="M 50 202 L 210 294" stroke="#eab308" strokeWidth="1" strokeOpacity="0.5" />
    </g>

    {/* Estratos Geotécnicos Horizontales Derecha */}
    <g>
      <path d="M 210 262 L 370 170 L 370 184 L 210 276 Z" fill="url(#topo-soil-right-1)" />
      <path d="M 210 276 L 370 184 L 370 202 L 210 294 Z" fill="url(#topo-soil-right-2)" />
      <path d="M 210 294 L 370 202 L 370 218 L 210 310 Z" fill="#1c0b02" />
      <path d="M 210 276 L 370 184" stroke="#291202" strokeWidth="1.2" strokeOpacity="0.6" />
      <path d="M 210 294 L 370 202" stroke="#451a03" strokeWidth="1" strokeOpacity="0.6" />
    </g>

    {/* Terreno Superior Plano */}
    <path d="M 50 170 L 210 78 L 370 170 L 210 262 Z" fill="url(#topo-surface-plane)" />

    {/* Retícula Topográfica */}
    <g stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="3 4">
      <line x1="90" y1="147" x2="250" y2="55" />
      <line x1="130" y1="124" x2="290" y2="32" />
      <line x1="170" y1="101" x2="330" y2="9" />
      <line x1="130" y1="216" x2="290" y2="124" />
      <line x1="170" y1="239" x2="330" y2="147" />
    </g>

    {/* Curvas de Nivel con Cotas Técnicas */}
    <g>
      <path d="M 80 187 Q 150 205 210 235 T 340 187" fill="none" stroke="#fef08a" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="188" y="218" width="42" height="11" rx="3" fill="#1e293b" opacity="0.85" />
      <text x="209" y="226" fontFamily="monospace" fontSize="7.5" fontWeight="bold" fill="#facc15" textAnchor="middle">+0.00m</text>
    </g>

    <g>
      <path d="M 95 160 Q 170 170 215 190 T 325 158" fill="none" stroke="#fef08a" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="194" y="176" width="42" height="11" rx="3" fill="#1e293b" opacity="0.85" />
      <text x="215" y="184" fontFamily="monospace" fontSize="7.5" fontWeight="bold" fill="#facc15" textAnchor="middle">+0.25m</text>
    </g>

    <g>
      <path d="M 125 130 Q 185 135 215 150 T 295 130" fill="none" stroke="#fef08a" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="194" y="137" width="42" height="11" rx="3" fill="#1e293b" opacity="0.85" />
      <text x="215" y="145" fontFamily="monospace" fontSize="7.5" fontWeight="bold" fill="#facc15" textAnchor="middle">+0.50m</text>
    </g>

    {/* Estación Total / Trípode de Nivelación */}
    <g>
      <ellipse cx="275" cy="148" rx="20" ry="8" fill="#0f172a" opacity="0.3" />
      <line x1="275" y1="108" x2="262" y2="146" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      <line x1="275" y1="108" x2="272" y2="150" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="275" y1="108" x2="288" y2="145" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="271,108 279,108 277,105 273,105" fill="#334155" />
      <rect x="272" y="93" width="7" height="12" rx="1.5" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
      <line x1="268" y1="91" x2="283" y2="91" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <circle cx="268" cy="91" r="2" fill="#0284c7" />

      {/* Haz Láser Verde de Nivelación */}
      <line x1="268" y1="91" x2="160" y2="128" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.85" />
      <circle cx="160" cy="128" r="2" fill="#86efac" />
    </g>

    {/* Mira Topográfica Graduada */}
    <g>
      <ellipse cx="160" cy="132" rx="6" ry="2.5" fill="#0f172a" opacity="0.3" />
      <rect x="158.5" y="80" width="3" height="52" fill="url(#topo-rod-silver)" stroke="#64748b" strokeWidth="0.5" />
      <rect x="158.5" y="80" width="3" height="8" fill="#ef4444" />
      <rect x="158.5" y="88" width="3" height="8" fill="#ffffff" />
      <rect x="158.5" y="96" width="3" height="8" fill="#ef4444" />
      <rect x="158.5" y="104" width="3" height="8" fill="#ffffff" />
      <rect x="158.5" y="112" width="3" height="8" fill="#ef4444" />
      <rect x="158.5" y="120" width="3" height="8" fill="#ffffff" />
      <circle cx="160" cy="77" r="4" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
      <circle cx="160" cy="77" r="2.5" fill="#38bdf8" />
    </g>
  </svg>
);
