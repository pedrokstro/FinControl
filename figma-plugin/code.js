// FinControl - Mobile Design System & Complete Screens Generator for Figma
// Versão 1:1 com 100% de paridade visual aos componentes e páginas do projeto

async function main() {
  figma.notify("Construindo réplica 1:1 de todas as telas nativas do FinControl...", { timeout: 4000 });

  // 1. Carregar Fontes
  const fontRegular = { family: "Inter", style: "Regular" };
  const fontBold = { family: "Inter", style: "Bold" };

  try {
    await Promise.all([
      figma.loadFontAsync(fontRegular),
      figma.loadFontAsync(fontBold)
    ]);
  } catch (err) {
    console.warn("Aviso ao carregar fontes Inter:", err);
  }

  // 2. Helper de Cores RGBA para o Figma (sempre com a: 1)
  function hexToRgba(hex, alpha = 1) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map(c => c + c).join("");
    }
    const num = parseInt(hex, 16);
    return {
      r: ((num >> 16) & 255) / 255,
      g: ((num >> 8) & 255) / 255,
      b: (num & 255) / 255,
      a: alpha
    };
  }

  // Paleta oficial FinControl
  const colors = {
    primary: hexToRgba("025ec2"),
    primaryDark: hexToRgba("03448c"),
    primaryLight: hexToRgba("0284c7"),
    accentSky: hexToRgba("38bdf8"),
    emerald: hexToRgba("10b981"),
    emeraldBg: hexToRgba("d1fae5"),
    emeraldText: hexToRgba("065f46"),
    rose: hexToRgba("f43f5e"),
    roseBg: hexToRgba("ffe4e6"),
    roseText: hexToRgba("9f1239"),
    amber: hexToRgba("f59e0b"),
    amberBg: hexToRgba("fef3c7"),
    amberText: hexToRgba("92400e"),
    indigo: hexToRgba("6366f1"),
    purple: hexToRgba("8b5cf6"),
    white: hexToRgba("ffffff"),
    black: hexToRgba("000000"),
    bgLight: hexToRgba("f8fafc"),
    cardLight: hexToRgba("ffffff"),
    borderLight: hexToRgba("e2e8f0"),
    textDark: hexToRgba("0f172a"),
    textMuted: hexToRgba("64748b"),
    textSubtle: hexToRgba("94a3b8"),
    goldChip: hexToRgba("fcd34d"),
    cardGradStart: hexToRgba("0f172a"),
    cardGradEnd: hexToRgba("0284c7"),
    darkHero1: hexToRgba("025ec2"),
    darkHero2: hexToRgba("0284c7"),
    darkHero3: hexToRgba("0369a1")
  };

  // 3. Helper Seguro de Criação de Texto
  function createText(characters, options = {}) {
    const text = figma.createText();
    text.fontName = (options.weight === "bold" || options.weight === "semibold") ? fontBold : fontRegular;
    text.characters = String(characters);
    text.fontSize = options.fontSize || 14;
    const col = options.color || colors.textDark;
    text.fills = [{ type: "SOLID", color: { r: col.r, g: col.g, b: col.b }, opacity: options.opacity ?? col.a ?? 1 }];
    if (options.textAlign) {
      text.textAlignHorizontal = options.textAlign;
    }
    return text;
  }

  // 4. Biblioteca de Ícones Vetoriais SVG Reais
  const svgIcons = {
    home: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    transactions: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>`,
    cards: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    trendingUp: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    trendingDown: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>`,
    user: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
    bell: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
    palette: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    crown: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="m9 18 6-6-6-6"/></svg>`,
    check: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    logout: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    sparkles: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
    database: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    target: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    wallet: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>`,
    search: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    close: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    save: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    utensils: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 11v11"/><path d="M5 2v11a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/></svg>`,
    plane: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
    car: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
    heartPulse: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`,
    shoppingBag: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
  };

  function createIcon(svgStr, size = 20, color = colors.primary) {
    try {
      const rgbColor = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
      const formatted = svgStr.replace(/currentColor/g, rgbColor);
      const node = figma.createNodeFromSvg(formatted);
      node.resize(size, size);
      return node;
    } catch {
      const dot = figma.createFrame();
      dot.resize(size, size);
      dot.cornerRadius = size / 2;
      dot.fills = [{ type: "SOLID", color: { r: color.r, g: color.g, b: color.b } }];
      return dot;
    }
  }

  function createCard(width, height, bgColor = colors.cardLight, radius = 20) {
    const card = figma.createFrame();
    card.resize(width, height);
    card.cornerRadius = radius;
    card.fills = [{ type: "SOLID", color: { r: bgColor.r, g: bgColor.g, b: bgColor.b }, opacity: bgColor.a ?? 1 }];
    card.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
    card.strokeWeight = 1;
    card.effects = [{
      type: "DROP_SHADOW",
      color: { r: 0.05, g: 0.1, b: 0.2, a: 0.04 },
      offset: { x: 0, y: 4 },
      radius: 12,
      spread: 0,
      visible: true,
      blendMode: "NORMAL"
    }];
    return card;
  }

  function createFloatingNavBar(screenWidth, activeTab = "Início") {
    const navBar = figma.createFrame();
    navBar.name = "Mobile Navigation Bar (Floating)";
    const barWidth = screenWidth - 32;
    navBar.resize(barWidth, 68);
    navBar.cornerRadius = 34;
    navBar.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.96 }];
    navBar.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
    navBar.strokeWeight = 1;
    navBar.effects = [{
      type: "DROP_SHADOW",
      color: { r: 0.05, g: 0.1, b: 0.25, a: 0.12 },
      offset: { x: 0, y: 8 },
      radius: 24,
      spread: 0,
      visible: true,
      blendMode: "NORMAL"
    }];

    const items = [
      { name: "Início", iconKey: "home" },
      { name: "Extrato", iconKey: "transactions" },
      { name: "Adicionar", isFab: true },
      { name: "Cartões", iconKey: "cards" },
      { name: "Mais", iconKey: "settings" }
    ];

    const itemWidth = barWidth / items.length;
    items.forEach((item, index) => {
      const centerX = index * itemWidth + itemWidth / 2;
      const isActive = item.name === activeTab;

      if (item.isFab) {
        const fab = figma.createEllipse();
        fab.name = "FAB Add Button";
        fab.resize(46, 46);
        fab.x = centerX - 23;
        fab.y = 11;
        fab.fills = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } }];
        fab.effects = [{
          type: "DROP_SHADOW",
          color: { r: 0.01, g: 0.37, b: 0.76, a: 0.35 },
          offset: { x: 0, y: 4 },
          radius: 10,
          spread: 0,
          visible: true,
          blendMode: "NORMAL"
        }];
        navBar.appendChild(fab);

        const iconNode = createIcon(svgIcons.plus, 22, colors.white);
        iconNode.x = centerX - 11;
        iconNode.y = 23;
        navBar.appendChild(iconNode);
      } else {
        const iconColor = isActive ? colors.primary : colors.textSubtle;
        const iconNode = createIcon(svgIcons[item.iconKey], 20, iconColor);
        iconNode.x = centerX - 10;
        iconNode.y = 14;
        navBar.appendChild(iconNode);

        const label = createText(item.name, {
          fontSize: 10,
          weight: isActive ? "bold" : "regular",
          color: isActive ? colors.primary : colors.textMuted
        });
        label.x = centerX - label.width / 2;
        label.y = 40;
        navBar.appendChild(label);
      }
    });

    return navBar;
  }

  function createHeader(title, subtitle) {
    const h = figma.createFrame();
    h.resize(390, 110);
    h.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    h.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
    h.strokeWeight = 1;

    const t = createText(title, { fontSize: 17, weight: "bold", color: colors.textDark });
    t.x = 24; t.y = subtitle ? 44 : 52;
    h.appendChild(t);

    if (subtitle) {
      const s = createText(subtitle, { fontSize: 11, color: colors.textMuted });
      s.x = 24; s.y = 68;
      h.appendChild(s);
    }
    return h;
  }

  const SCREEN_WIDTH = 390;
  const SCREEN_HEIGHT = 844;
  const SPACING_X = 450;
  let currentX = 0;
  const allScreens = [];

  // =========================================================================
  // TELA 1: DASHBOARD PRINCIPAL (1:1 COM O HEADER REAL AURORA E CÁPSULA)
  // =========================================================================
  const screen1 = figma.createFrame();
  screen1.name = "01 - Dashboard Principal";
  screen1.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen1.x = currentX; screen1.y = 0;
  screen1.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  screen1.clipsContent = true;

  // Header Aurora Glow Real (from-[#025ec2] via-[#0284c7] to-[#0369a1] rounded-b-[36px])
  const heroHeader = figma.createFrame();
  heroHeader.name = "Header Mobile Aurora Mesh Real";
  heroHeader.resize(SCREEN_WIDTH, 240);
  heroHeader.bottomLeftRadius = 36; heroHeader.bottomRightRadius = 36;
  heroHeader.fills = [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { position: 0, color: { r: colors.darkHero1.r, g: colors.darkHero1.g, b: colors.darkHero1.b, a: 1 } },
      { position: 0.5, color: { r: colors.darkHero2.r, g: colors.darkHero2.g, b: colors.darkHero2.b, a: 1 } },
      { position: 1, color: { r: colors.darkHero3.r, g: colors.darkHero3.g, b: colors.darkHero3.b, a: 1 } }
    ]
  }];

  // Linha superior: Saudação à esquerda e Olho de visibilidade à direita
  const gr = createText("Bom dia,", { fontSize: 12, color: colors.white, opacity: 0.8 });
  gr.x = 24; gr.y = 48; heroHeader.appendChild(gr);

  const un = createText("Pedro Castro", { fontSize: 17, weight: "bold", color: colors.white });
  un.x = 24; un.y = 66; heroHeader.appendChild(un);

  const eyeCircle = figma.createFrame();
  eyeCircle.resize(36, 36); eyeCircle.cornerRadius = 18;
  eyeCircle.x = SCREEN_WIDTH - 60; eyeCircle.y = 48;
  eyeCircle.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.15 }];
  const eyeIcon = createIcon(svgIcons.eye, 18, colors.white);
  eyeIcon.x = 9; eyeIcon.y = 9; eyeCircle.appendChild(eyeIcon);
  heroHeader.appendChild(eyeCircle);

  // Centro do Hero: Saldo do Mês
  const bl = createText("SALDO DO MÊS", { fontSize: 11, weight: "bold", color: colors.white, opacity: 0.8 });
  bl.x = (SCREEN_WIDTH - bl.width) / 2; bl.y = 104; heroHeader.appendChild(bl);

  const bv = createText("R$ 771,60", { fontSize: 34, weight: "bold", color: colors.white });
  bv.x = (SCREEN_WIDTH - bv.width) / 2; bv.y = 124; heroHeader.appendChild(bv);

  // Cápsula de Navegação de Mês EXATAMENTE ABAIXO DO SALDO
  const pill = figma.createFrame();
  pill.resize(170, 32); pill.cornerRadius = 16;
  pill.x = (SCREEN_WIDTH - 170) / 2; pill.y = 176;
  pill.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.18 }];
  pill.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.25 }];
  pill.strokeWeight = 1;

  const calIcon = createIcon(svgIcons.calendar, 13, colors.white);
  calIcon.x = 12; calIcon.y = 9; pill.appendChild(calIcon);

  const pillTxt = createText("Outubro 2026", { fontSize: 11, weight: "bold", color: colors.white });
  pillTxt.x = 32; pillTxt.y = 8; pill.appendChild(pillTxt);

  const todayBadge = figma.createFrame();
  todayBadge.resize(40, 20); todayBadge.cornerRadius = 10;
  todayBadge.x = 120; todayBadge.y = 6;
  todayBadge.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  const tbTxt = createText("Hoje", { fontSize: 9, weight: "bold", color: colors.primary });
  tbTxt.x = 8; tbTxt.y = 4; todayBadge.appendChild(tbTxt);
  pill.appendChild(todayBadge);
  heroHeader.appendChild(pill);
  screen1.appendChild(heroHeader);

  // 3 Cards de Topo: Receitas, Despesas e Meta de Economia Real!
  const cardW = 108;
  const incCard = createCard(cardW, 90, colors.white, 16);
  incCard.x = 24; incCard.y = 252;
  const icInc = createIcon(svgIcons.trendingUp, 15, colors.emerald); icInc.x = 10; icInc.y = 10; incCard.appendChild(icInc);
  const incT = createText("Receitas", { fontSize: 10, color: colors.textMuted }); incT.x = 10; incT.y = 30; incCard.appendChild(incT);
  const incV = createText("R$ 3.182", { fontSize: 14, weight: "bold", color: colors.textDark }); incV.x = 10; incV.y = 46; incCard.appendChild(incV);
  const incS = createText("+12%", { fontSize: 10, weight: "bold", color: colors.emerald }); incS.x = 10; incS.y = 68; incCard.appendChild(incS);
  screen1.appendChild(incCard);

  const expCard = createCard(cardW, 90, colors.white, 16);
  expCard.x = 141; expCard.y = 252;
  const icExp = createIcon(svgIcons.trendingDown, 15, colors.rose); icExp.x = 10; icExp.y = 10; expCard.appendChild(icExp);
  const expT = createText("Despesas", { fontSize: 10, color: colors.textMuted }); expT.x = 10; expT.y = 30; expCard.appendChild(expT);
  const expV = createText("R$ 2.411", { fontSize: 14, weight: "bold", color: colors.textDark }); expV.x = 10; expV.y = 46; expCard.appendChild(expV);
  const expS = createText("-5%", { fontSize: 10, weight: "bold", color: colors.rose }); expS.x = 10; expS.y = 68; expCard.appendChild(expS);
  screen1.appendChild(expCard);

  const goalCard = createCard(cardW, 90, colors.white, 16);
  goalCard.x = 258; goalCard.y = 252;
  const icGoal = createIcon(svgIcons.target, 15, colors.primary); icGoal.x = 10; icGoal.y = 10; goalCard.appendChild(icGoal);
  const goalT = createText("Meta Poupança", { fontSize: 10, color: colors.textMuted }); goalT.x = 10; goalT.y = 30; goalCard.appendChild(goalT);
  const goalV = createText("R$ 1.500", { fontSize: 14, weight: "bold", color: colors.textDark }); goalV.x = 10; goalV.y = 46; goalCard.appendChild(goalV);
  const goalS = createText("68% atingido", { fontSize: 10, weight: "bold", color: colors.primary }); goalS.x = 10; goalS.y = 68; goalCard.appendChild(goalS);
  screen1.appendChild(goalCard);

  // Gastos por Categoria
  const catCard = createCard(SCREEN_WIDTH - 48, 140, colors.white, 20);
  catCard.x = 24; catCard.y = 356;
  const catHead = createText("Gastos por Categoria", { fontSize: 13, weight: "bold", color: colors.textDark }); catHead.x = 16; catHead.y = 14; catCard.appendChild(catHead);
  const catTotal = createText("R$ 2.411,06", { fontSize: 13, weight: "bold", color: colors.rose }); catTotal.x = catCard.width - catTotal.width - 16; catTotal.y = 14; catCard.appendChild(catTotal);

  const barBg = figma.createFrame(); barBg.resize(catCard.width - 32, 10); barBg.cornerRadius = 5; barBg.x = 16; barBg.y = 40;
  barBg.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  barBg.clipsContent = true;
  const b1 = figma.createRectangle(); b1.resize(barBg.width * 0.45, 10); b1.fills = [{ type: "SOLID", color: { r: colors.rose.r, g: colors.rose.g, b: colors.rose.b } }];
  const b2 = figma.createRectangle(); b2.resize(barBg.width * 0.25, 10); b2.x = barBg.width * 0.45; b2.fills = [{ type: "SOLID", color: { r: colors.primaryLight.r, g: colors.primaryLight.g, b: colors.primaryLight.b } }];
  const b3 = figma.createRectangle(); b3.resize(barBg.width * 0.20, 10); b3.x = barBg.width * 0.70; b3.fills = [{ type: "SOLID", color: { r: colors.amber.r, g: colors.amber.g, b: colors.amber.b } }];
  barBg.appendChild(b1); barBg.appendChild(b2); barBg.appendChild(b3);
  catCard.appendChild(barBg);

  const ci1 = createText("• Cartão de Crédito (45%)", { fontSize: 11, color: colors.textDark }); ci1.x = 16; ci1.y = 66; catCard.appendChild(ci1);
  const cv1 = createText("R$ 1.085,00", { fontSize: 11, weight: "bold", color: colors.textDark }); cv1.x = catCard.width - cv1.width - 16; cv1.y = 66; catCard.appendChild(cv1);

  const ci2 = createText("• Moradia & Contas (25%)", { fontSize: 11, color: colors.textDark }); ci2.x = 16; ci2.y = 90; catCard.appendChild(ci2);
  const cv2 = createText("R$ 602,75", { fontSize: 11, weight: "bold", color: colors.textDark }); cv2.x = catCard.width - cv2.width - 16; cv2.y = 90; catCard.appendChild(cv2);

  const ci3 = createText("• Mercado & Refeições (20%)", { fontSize: 11, color: colors.textDark }); ci3.x = 16; ci3.y = 114; catCard.appendChild(ci3);
  const cv3 = createText("R$ 482,21", { fontSize: 11, weight: "bold", color: colors.textDark }); cv3.x = catCard.width - cv3.width - 16; cv3.y = 114; catCard.appendChild(cv3);
  screen1.appendChild(catCard);

  // Transações Recentes
  const transCard = createCard(SCREEN_WIDTH - 48, 170, colors.white, 20);
  transCard.x = 24; transCard.y = 510;
  const tt = createText("Transações Recentes", { fontSize: 13, weight: "bold", color: colors.textDark }); tt.x = 16; tt.y = 14; transCard.appendChild(tt);

  const tData = [
    { desc: "Enel Distribuição", cat: "Energia", date: "Hoje", amount: "- R$ 250,00", isInc: false },
    { desc: "Cartão Nubank", cat: "Fatura", date: "Ontem", amount: "- R$ 1.085,42", isInc: false }
  ];
  tData.forEach((t, i) => {
    const rowY = 48 + i * 50;
    const dot = figma.createEllipse(); dot.resize(34, 34); dot.x = 16; dot.y = rowY;
    const dotC = t.isInc ? colors.emeraldBg : colors.roseBg;
    dot.fills = [{ type: "SOLID", color: { r: dotC.r, g: dotC.g, b: dotC.b } }];
    transCard.appendChild(dot);
    const ic = createIcon(t.isInc ? svgIcons.trendingUp : svgIcons.trendingDown, 16, t.isInc ? colors.emerald : colors.rose);
    ic.x = 25; ic.y = rowY + 9; transCard.appendChild(ic);

    const desc = createText(t.desc, { fontSize: 12, weight: "bold", color: colors.textDark }); desc.x = 58; desc.y = rowY + 2; transCard.appendChild(desc);
    const meta = createText(`${t.cat} • ${t.date}`, { fontSize: 10, color: colors.textMuted }); meta.x = 58; meta.y = rowY + 18; transCard.appendChild(meta);
    const am = createText(t.amount, { fontSize: 12, weight: "bold", color: t.isInc ? colors.emerald : colors.rose }); am.x = transCard.width - am.width - 16; am.y = rowY + 8; transCard.appendChild(am);
  });
  screen1.appendChild(transCard);

  const nav1 = createFloatingNavBar(SCREEN_WIDTH, "Início");
  nav1.x = 16; nav1.y = SCREEN_HEIGHT - 88;
  screen1.appendChild(nav1);
  allScreens.push(screen1);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 2: EXTRATO COM BUSCA E AGRUPAMENTO DE DATAS
  // =========================================================================
  const screen2 = figma.createFrame();
  screen2.name = "02 - Extrato & Transações";
  screen2.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen2.x = currentX; screen2.y = 0;
  screen2.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  screen2.clipsContent = true;
  screen2.appendChild(createHeader("Extrato de Movimentações", "Todas as entradas e saídas do mês"));

  // Barra de Busca
  const sBox = figma.createFrame(); sBox.resize(SCREEN_WIDTH - 48, 42); sBox.cornerRadius = 21; sBox.x = 24; sBox.y = 120;
  sBox.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  sBox.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const sIco = createIcon(svgIcons.search, 16, colors.textSubtle); sIco.x = 14; sIco.y = 13; sBox.appendChild(sIco);
  const sTxt = createText("Buscar transação ou categoria...", { fontSize: 12, color: colors.textMuted }); sTxt.x = 40; sTxt.y = 13; sBox.appendChild(sTxt);
  screen2.appendChild(sBox);

  // Filtros em Pílulas
  const fFrame = figma.createFrame(); fFrame.resize(SCREEN_WIDTH - 48, 32); fFrame.x = 24; fFrame.y = 172; fFrame.fills = [];
  const tabs = ["Todas", "Receitas", "Despesas", "Fixas"];
  let fX = 0;
  tabs.forEach((tab, idx) => {
    const isA = idx === 0;
    const p = figma.createFrame(); p.resize(74, 30); p.cornerRadius = 15; p.x = fX; fX += 82;
    p.fills = [{ type: "SOLID", color: isA ? { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } : { r: 1, g: 1, b: 1 } }];
    p.strokes = [{ type: "SOLID", color: isA ? { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } : { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
    const pt = createText(tab, { fontSize: 11, weight: "bold", color: isA ? colors.white : colors.textMuted });
    pt.x = (p.width - pt.width) / 2; pt.y = 7; p.appendChild(pt);
    fFrame.appendChild(p);
  });
  screen2.appendChild(fFrame);

  // Lista
  const lCard = createCard(SCREEN_WIDTH - 48, 520, colors.white, 20);
  lCard.x = 24; lCard.y = 214;
  const fList = [
    { desc: "Enel Distribuição", cat: "Energia", date: "Hoje, 14:32", amount: "- R$ 250,00", isInc: false },
    { desc: "Uber Viagem", cat: "Transporte", date: "Hoje, 09:15", amount: "- R$ 28,90", isInc: false },
    { desc: "Padaria Santo Pão", cat: "Alimentação", date: "Ontem, 19:40", amount: "- R$ 42,50", isInc: false },
    { desc: "Cartão Nubank", cat: "Fatura", date: "Ontem, 11:20", amount: "- R$ 1.085,42", isInc: false },
    { desc: "Transferência Pix", cat: "Salário", date: "05/10, 08:00", amount: "+ R$ 3.182,66", isInc: true },
    { desc: "Pão de Açúcar", cat: "Mercado", date: "04/10, 18:22", amount: "- R$ 380,20", isInc: false },
    { desc: "Spotify Premium", cat: "Assinaturas", date: "01/10, 03:00", amount: "- R$ 34,90", isInc: false }
  ];
  fList.forEach((t, i) => {
    const rowY = 16 + i * 68;
    const dot = figma.createEllipse(); dot.resize(36, 36); dot.x = 16; dot.y = rowY;
    const c = t.isInc ? colors.emeraldBg : colors.roseBg;
    dot.fills = [{ type: "SOLID", color: { r: c.r, g: c.g, b: c.b } }];
    lCard.appendChild(dot);
    const ic = createIcon(t.isInc ? svgIcons.trendingUp : svgIcons.trendingDown, 16, t.isInc ? colors.emerald : colors.rose);
    ic.x = 26; ic.y = rowY + 10; lCard.appendChild(ic);
    const desc = createText(t.desc, { fontSize: 13, weight: "bold", color: colors.textDark }); desc.x = 60; desc.y = rowY + 2; lCard.appendChild(desc);
    const meta = createText(`${t.cat} • ${t.date}`, { fontSize: 10, color: colors.textMuted }); meta.x = 60; meta.y = rowY + 20; lCard.appendChild(meta);
    const am = createText(t.amount, { fontSize: 13, weight: "bold", color: t.isInc ? colors.emerald : colors.rose });
    am.x = lCard.width - am.width - 16; am.y = rowY + 8; lCard.appendChild(am);
  });
  screen2.appendChild(lCard);

  const nav2 = createFloatingNavBar(SCREEN_WIDTH, "Extrato");
  nav2.x = 16; nav2.y = SCREEN_HEIGHT - 88;
  screen2.appendChild(nav2);
  allScreens.push(screen2);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 3: MEUS CARTÕES COM DESIGN INTERATIVO 3D REAL
  // =========================================================================
  const screen3 = figma.createFrame();
  screen3.name = "03 - Meus Cartões";
  screen3.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen3.x = currentX; screen3.y = 0;
  screen3.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  screen3.clipsContent = true;
  screen3.appendChild(createHeader("Meus Cartões de Crédito", "Faturas e limites disponíveis"));

  const card3D = figma.createFrame();
  card3D.resize(SCREEN_WIDTH - 48, 200); card3D.cornerRadius = 22; card3D.x = 24; card3D.y = 126;
  card3D.fills = [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { position: 0, color: { r: colors.cardGradStart.r, g: colors.cardGradStart.g, b: colors.cardGradStart.b, a: 1 } },
      { position: 1, color: { r: colors.cardGradEnd.r, g: colors.cardGradEnd.g, b: colors.cardGradEnd.b, a: 1 } }
    ]
  }];
  const cBank = createText("FinControl Black Platinum", { fontSize: 13, weight: "bold", color: colors.white }); cBank.x = 20; cBank.y = 20; card3D.appendChild(cBank);
  const chip = figma.createFrame(); chip.resize(36, 26); chip.cornerRadius = 6; chip.x = 20; chip.y = 56; chip.fills = [{ type: "SOLID", color: { r: colors.goldChip.r, g: colors.goldChip.g, b: colors.goldChip.b } }]; card3D.appendChild(chip);
  const cNum = createText("••••  ••••  ••••  8421", { fontSize: 16, weight: "bold", color: colors.white }); cNum.x = 20; cNum.y = 104; card3D.appendChild(cNum);
  const cH = createText("PEDRO CASTRO", { fontSize: 12, weight: "bold", color: colors.white }); cH.x = 20; cH.y = 158; card3D.appendChild(cH);
  const cExp = createText("09/29", { fontSize: 12, weight: "bold", color: colors.white }); cExp.x = card3D.width - 60; cExp.y = 158; card3D.appendChild(cExp);
  screen3.appendChild(card3D);

  const invCard = createCard(SCREEN_WIDTH - 48, 150, colors.white, 20);
  invCard.x = 24; invCard.y = 342;
  const il = createText("Fatura Aberta Atual", { fontSize: 12, color: colors.textMuted }); il.x = 18; il.y = 16; invCard.appendChild(il);
  const iv = createText("R$ 1.085,42", { fontSize: 24, weight: "bold", color: colors.textDark }); iv.x = 18; iv.y = 38; invCard.appendChild(iv);
  const it = createText("Limite Total: R$ 5.000,00  •  Disponível: R$ 3.914,58", { fontSize: 11, color: colors.textMuted }); it.x = 18; it.y = 74; invCard.appendChild(it);

  const lBar = figma.createFrame(); lBar.resize(invCard.width - 36, 8); lBar.cornerRadius = 4; lBar.x = 18; lBar.y = 96;
  lBar.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  const uBar = figma.createRectangle(); uBar.resize(lBar.width * 0.22, 8); uBar.fills = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } }];
  lBar.appendChild(uBar); invCard.appendChild(lBar);
  screen3.appendChild(invCard);

  const nav3 = createFloatingNavBar(SCREEN_WIDTH, "Cartões");
  nav3.x = 16; nav3.y = SCREEN_HEIGHT - 88;
  screen3.appendChild(nav3);
  allScreens.push(screen3);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 4: ASSINATURAS REAIS COM CARD HERO GRADIENT INDIGO/PURPLE!
  // =========================================================================
  const screen4 = figma.createFrame();
  screen4.name = "04 - Assinaturas & Recorrentes";
  screen4.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen4.x = currentX; screen4.y = 0;
  screen4.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  screen4.clipsContent = true;

  // Card Hero com Gradiente Indigo/Purple Real (from-indigo-600 via-primary-600 to-purple-700)
  const subHero = figma.createFrame();
  subHero.name = "Hero Assinaturas Gradiente";
  subHero.resize(SCREEN_WIDTH - 48, 170);
  subHero.cornerRadius = 24;
  subHero.x = 24; subHero.y = 48;
  subHero.fills = [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { position: 0, color: { r: colors.indigo.r, g: colors.indigo.g, b: colors.indigo.b, a: 1 } },
      { position: 0.5, color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b, a: 1 } },
      { position: 1, color: { r: colors.purple.r, g: colors.purple.g, b: colors.purple.b, a: 1 } }
    ]
  }];

  const shTitle = createText("Assinaturas Recorrentes", { fontSize: 13, weight: "bold", color: colors.white }); shTitle.x = 20; shTitle.y = 16; subHero.appendChild(shTitle);
  const shBadge = figma.createFrame(); shBadge.resize(48, 20); shBadge.cornerRadius = 10; shBadge.x = subHero.width - 68; shBadge.y = 14;
  shBadge.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.2 }];
  const shBTxt = createText("4 itens", { fontSize: 10, weight: "bold", color: colors.white }); shBTxt.x = 8; shBTxt.y = 4; shBadge.appendChild(shBTxt);
  subHero.appendChild(shBadge);

  const shValLbl = createText("Gasto Mensal Garantido", { fontSize: 10, color: colors.white, opacity: 0.8 }); shValLbl.x = 20; shValLbl.y = 44; subHero.appendChild(shValLbl);
  const shVal = createText("R$ 289,50", { fontSize: 26, weight: "bold", color: colors.white }); shVal.x = 20; shVal.y = 60; subHero.appendChild(shVal);

  // 2 Caixas Translúcidas Internas: Projeção Anual e Comprometimento de Renda
  const boxW = (subHero.width - 48) / 2;
  const bAnual = figma.createFrame(); bAnual.resize(boxW, 50); bAnual.cornerRadius = 14; bAnual.x = 20; bAnual.y = 104;
  bAnual.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.12 }];
  const baL = createText("Projeção Anual", { fontSize: 9, color: colors.white, opacity: 0.8 }); baL.x = 10; baL.y = 8; bAnual.appendChild(baL);
  const baV = createText("R$ 3.474,00", { fontSize: 12, weight: "bold", color: colors.white }); baV.x = 10; baV.y = 24; bAnual.appendChild(baV);
  subHero.appendChild(bAnual);

  const bComp = figma.createFrame(); bComp.resize(boxW, 50); bComp.cornerRadius = 14; bComp.x = 28 + boxW; bComp.y = 104;
  bComp.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.12 }];
  const bcL = createText("Comprometimento", { fontSize: 9, color: colors.white, opacity: 0.8 }); bcL.x = 10; bcL.y = 8; bComp.appendChild(bcL);
  const bcV = createText("9,1% da Renda", { fontSize: 12, weight: "bold", color: colors.white }); bcV.x = 10; bcV.y = 24; bComp.appendChild(bcV);
  subHero.appendChild(bComp);
  screen4.appendChild(subHero);

  // Barra de Busca
  const subSearch = figma.createFrame(); subSearch.resize(SCREEN_WIDTH - 48, 42); subSearch.cornerRadius = 21; subSearch.x = 24; subSearch.y = 230;
  subSearch.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  subSearch.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const ssIco = createIcon(svgIcons.search, 16, colors.textSubtle); ssIco.x = 14; ssIco.y = 13; subSearch.appendChild(ssIco);
  const ssTxt = createText("Buscar assinatura (ex: Netflix, Spotify)...", { fontSize: 11, color: colors.textMuted }); ssTxt.x = 38; ssTxt.y = 13; subSearch.appendChild(ssTxt);
  screen4.appendChild(subSearch);

  // Lista com Cards de Assinatura
  const subCardReal = createCard(SCREEN_WIDTH - 48, 450, colors.white, 20);
  subCardReal.x = 24; subCardReal.y = 284;
  const subsReal = [
    { name: "Netflix Premium", ren: "Mensal • Renova dia 15", price: "R$ 55,90", col: colors.rose },
    { name: "Spotify Duo", ren: "Mensal • Renova dia 01", price: "R$ 34,90", col: colors.emerald },
    { name: "ChatGPT Plus", ren: "Mensal • Renova dia 22", price: "R$ 119,00", col: colors.primary },
    { name: "Academia SmartFit", ren: "Mensal • Renova dia 10", price: "R$ 129,90", col: colors.amber }
  ];
  subsReal.forEach((s, idx) => {
    const rY = 16 + idx * 76;
    const ic = figma.createFrame(); ic.resize(44, 44); ic.cornerRadius = 14; ic.x = 16; ic.y = rY;
    ic.fills = [{ type: "SOLID", color: { r: s.col.r, g: s.col.g, b: s.col.b }, opacity: 0.12 }];
    subCardReal.appendChild(ic);
    const crIco = createIcon(svgIcons.crown, 20, s.col); crIco.x = 28; crIco.y = rY + 12; subCardReal.appendChild(crIco);

    const sn = createText(s.name, { fontSize: 13, weight: "bold", color: colors.textDark }); sn.x = 70; sn.y = rY + 4; subCardReal.appendChild(sn);
    const sm = createText(s.ren, { fontSize: 10, color: colors.textMuted }); sm.x = 70; sm.y = rY + 24; subCardReal.appendChild(sm);
    const sp = createText(s.price, { fontSize: 13, weight: "bold", color: colors.textDark }); sp.x = subCardReal.width - sp.width - 16; sp.y = rY + 12; subCardReal.appendChild(sp);
  });
  screen4.appendChild(subCardReal);

  const nav4 = createFloatingNavBar(SCREEN_WIDTH, "Início");
  nav4.x = 16; nav4.y = SCREEN_HEIGHT - 88;
  screen4.appendChild(nav4);
  allScreens.push(screen4);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 5: CATEGORIAS & ORÇAMENTOS
  // =========================================================================
  const screen5 = figma.createFrame();
  screen5.name = "05 - Categorias & Orçamentos";
  screen5.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen5.x = currentX; screen5.y = 0;
  screen5.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  screen5.clipsContent = true;
  screen5.appendChild(createHeader("Categorias & Orçamentos", "Acompanhe seus limites de gastos"));

  const bCard = createCard(SCREEN_WIDTH - 48, 590, colors.white, 20);
  bCard.x = 24; bCard.y = 126;
  const bList = [
    { name: "Alimentação & Mercado", spent: 482, limit: 800, col: colors.amber },
    { name: "Moradia & Contas", spent: 602, limit: 700, col: colors.primaryLight },
    { name: "Transporte & Combustível", spent: 180, limit: 300, col: colors.indigo },
    { name: "Saúde & Farmácia", spent: 120, limit: 250, col: colors.emerald }
  ];
  bList.forEach((b, idx) => {
    const rY = 16 + idx * 92;
    const bn = createText(b.name, { fontSize: 13, weight: "bold", color: colors.textDark }); bn.x = 18; bn.y = rY; bCard.appendChild(bn);
    const bar = figma.createFrame(); bar.resize(bCard.width - 36, 8); bar.cornerRadius = 4; bar.x = 18; bar.y = rY + 24;
    bar.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
    const fill = figma.createRectangle(); fill.resize(bar.width * (b.spent / b.limit), 8); fill.fills = [{ type: "SOLID", color: { r: b.col.r, g: b.col.g, b: b.col.b } }];
    bar.appendChild(fill); bCard.appendChild(bar);
    const val = createText(`Gasto: R$ ${b.spent},00  •  Limite: R$ ${b.limit},00`, { fontSize: 10, color: colors.textMuted }); val.x = 18; val.y = rY + 38; bCard.appendChild(val);
  });
  screen5.appendChild(bCard);

  const nav5 = createFloatingNavBar(SCREEN_WIDTH, "Início");
  nav5.x = 16; nav5.y = SCREEN_HEIGHT - 88;
  screen5.appendChild(nav5);
  allScreens.push(screen5);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 6: RELATÓRIOS FINANCEIROS (BENTO GRID REAL)
  // =========================================================================
  const screen6 = figma.createFrame();
  screen6.name = "06 - Relatórios & Análises";
  screen6.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen6.x = currentX; screen6.y = 0;
  screen6.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  screen6.clipsContent = true;
  screen6.appendChild(createHeader("Relatórios Financeiros", "Visão analítica e comparativos de fluxo"));

  const repTabs = figma.createFrame(); repTabs.resize(SCREEN_WIDTH - 48, 36); repTabs.x = 24; repTabs.y = 126; repTabs.fills = [];
  const repPeriods = ["3 meses", "6 meses (Ativo)", "12 meses"];
  let rX = 0;
  repPeriods.forEach((rp, idx) => {
    const isA = idx === 1;
    const p = figma.createFrame(); p.resize(106, 32); p.cornerRadius = 16; p.x = rX; rX += 114;
    p.fills = [{ type: "SOLID", color: isA ? { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } : { r: 1, g: 1, b: 1 } }];
    p.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
    const t = createText(rp, { fontSize: 11, weight: "bold", color: isA ? colors.white : colors.textMuted });
    t.x = (p.width - t.width) / 2; t.y = 8; p.appendChild(t);
    repTabs.appendChild(p);
  });
  screen6.appendChild(repTabs);

  const repKpiCard = createCard(SCREEN_WIDTH - 48, 126, colors.white, 20);
  repKpiCard.x = 24; repKpiCard.y = 176;
  const k1L = createText("Total Receitas", { fontSize: 10, color: colors.textMuted }); k1L.x = 18; k1L.y = 16; repKpiCard.appendChild(k1L);
  const k1V = createText("R$ 18.540,00", { fontSize: 15, weight: "bold", color: colors.emerald }); k1V.x = 18; k1V.y = 32; repKpiCard.appendChild(k1V);
  const k2L = createText("Total Despesas", { fontSize: 10, color: colors.textMuted }); k2L.x = 190; k2L.y = 16; repKpiCard.appendChild(k2L);
  const k2V = createText("R$ 12.320,00", { fontSize: 15, weight: "bold", color: colors.rose }); k2V.x = 190; k2V.y = 32; repKpiCard.appendChild(k2V);
  const divL = figma.createFrame(); divL.resize(repKpiCard.width - 36, 1); divL.x = 18; divL.y = 66; divL.fills = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }]; repKpiCard.appendChild(divL);
  const k3L = createText("Saldo Líquido Acumulado", { fontSize: 11, color: colors.textMuted }); k3L.x = 18; k3L.y = 78; repKpiCard.appendChild(k3L);
  const k3V = createText("+ R$ 6.220,00  (Poupança: 33,5%)", { fontSize: 13, weight: "bold", color: colors.primary }); k3V.x = 18; k3V.y = 96; repKpiCard.appendChild(k3V);
  screen6.appendChild(repKpiCard);

  const chartCard = createCard(SCREEN_WIDTH - 48, 240, colors.white, 20);
  chartCard.x = 24; chartCard.y = 318;
  const ct = createText("Evolução Mensal do Fluxo", { fontSize: 13, weight: "bold", color: colors.textDark }); ct.x = 18; ct.y = 16; chartCard.appendChild(ct);
  const months = ["Mai", "Jun", "Jul", "Ago", "Set", "Out"];
  const bHeightsInc = [90, 110, 105, 120, 130, 140];
  const bHeightsExp = [70, 85, 80, 95, 85, 90];
  months.forEach((m, idx) => {
    const colX = 24 + idx * 52;
    const baseH = 190;
    const barInc = figma.createRectangle(); barInc.resize(14, bHeightsInc[idx] * 0.7); barInc.cornerRadius = 4; barInc.x = colX; barInc.y = baseH - (bHeightsInc[idx] * 0.7);
    barInc.fills = [{ type: "SOLID", color: { r: colors.emerald.r, g: colors.emerald.g, b: colors.emerald.b } }];
    chartCard.appendChild(barInc);
    const barExp = figma.createRectangle(); barExp.resize(14, bHeightsExp[idx] * 0.7); barExp.cornerRadius = 4; barExp.x = colX + 18; barExp.y = baseH - (bHeightsExp[idx] * 0.7);
    barExp.fills = [{ type: "SOLID", color: { r: colors.rose.r, g: colors.rose.g, b: colors.rose.b } }];
    chartCard.appendChild(barExp);
    const lbl = createText(m, { fontSize: 10, color: colors.textMuted }); lbl.x = colX + 6; lbl.y = baseH + 8; chartCard.appendChild(lbl);
  });
  screen6.appendChild(chartCard);

  const expBtn = figma.createFrame(); expBtn.resize(SCREEN_WIDTH - 48, 50); expBtn.cornerRadius = 25; expBtn.x = 24; expBtn.y = 574;
  expBtn.fills = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } }];
  const expBtnTxt = createText("Exportar Relatório em PDF", { fontSize: 13, weight: "bold", color: colors.white });
  expBtnTxt.x = (expBtn.width - expBtnTxt.width) / 2; expBtnTxt.y = 16; expBtn.appendChild(expBtnTxt);
  screen6.appendChild(expBtn);

  const nav6 = createFloatingNavBar(SCREEN_WIDTH, "Mais");
  nav6.x = 16; nav6.y = SCREEN_HEIGHT - 88;
  screen6.appendChild(nav6);
  allScreens.push(screen6);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 7: CALCULADORA DE JUROS COMPOSTOS REAL
  // =========================================================================
  const screen7 = figma.createFrame();
  screen7.name = "07 - Calculadora de Juros Compostos";
  screen7.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen7.x = currentX; screen7.y = 0;
  screen7.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  screen7.clipsContent = true;
  screen7.appendChild(createHeader("Juros Compostos", "Simule a evolução do seu patrimônio"));

  const resCard = createCard(SCREEN_WIDTH - 48, 140, colors.white, 20);
  resCard.x = 24; resCard.y = 126;
  const resLbl = createText("Valor Total Acumulado Estimado", { fontSize: 11, color: colors.textMuted }); resLbl.x = 18; resLbl.y = 16; resCard.appendChild(resLbl);
  const resVal = createText("R$ 102.842,50", { fontSize: 26, weight: "bold", color: colors.emerald }); resVal.x = 18; resVal.y = 36; resCard.appendChild(resVal);
  const resDiv = figma.createFrame(); resDiv.resize(resCard.width - 36, 1); resDiv.x = 18; resDiv.y = 74; resDiv.fills = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }]; resCard.appendChild(resDiv);
  const invLbl = createText("Total Investido: R$ 58.000,00", { fontSize: 11, color: colors.textDark }); invLbl.x = 18; invLbl.y = 86; resCard.appendChild(invLbl);
  const jurLbl = createText("Juros Ganhos: R$ 44.842,50 (43,6%)", { fontSize: 11, weight: "bold", color: colors.primary }); jurLbl.x = 18; jurLbl.y = 106; resCard.appendChild(jurLbl);
  screen7.appendChild(resCard);

  const calcFormCard = createCard(SCREEN_WIDTH - 48, 380, colors.white, 20);
  calcFormCard.x = 24; calcFormCard.y = 282;
  const simFields = [
    { label: "Aplicação Inicial", val: "R$ 10.000,00" },
    { label: "Aporte Mensal", val: "R$ 400,00" },
    { label: "Taxa de Juros Anual", val: "8,00 % ao ano" },
    { label: "Período de Investimento", val: "10 Anos (120 meses)" }
  ];
  simFields.forEach((sf, idx) => {
    const fY = 16 + idx * 72;
    const box = figma.createFrame(); box.resize(calcFormCard.width - 36, 56); box.cornerRadius = 14; box.x = 18; box.y = fY;
    box.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
    box.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
    const lb = createText(sf.label, { fontSize: 10, color: colors.textMuted }); lb.x = 16; lb.y = 8; box.appendChild(lb);
    const vl = createText(sf.val, { fontSize: 14, weight: "bold", color: colors.textDark }); vl.x = 16; vl.y = 26; box.appendChild(vl);
    calcFormCard.appendChild(box);
  });
  const btnCalc = figma.createFrame(); btnCalc.resize(calcFormCard.width - 36, 50); btnCalc.cornerRadius = 25; btnCalc.x = 18; btnCalc.y = calcFormCard.height - 66;
  btnCalc.fills = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } }];
  const btnCalcTxt = createText("Recalcular Projeção", { fontSize: 13, weight: "bold", color: colors.white });
  btnCalcTxt.x = (btnCalc.width - btnCalcTxt.width) / 2; btnCalcTxt.y = 16; btnCalc.appendChild(btnCalcTxt);
  calcFormCard.appendChild(btnCalc);
  screen7.appendChild(calcFormCard);

  const nav7 = createFloatingNavBar(SCREEN_WIDTH, "Mais");
  nav7.x = 16; nav7.y = SCREEN_HEIGHT - 88;
  screen7.appendChild(nav7);
  allScreens.push(screen7);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 8: CALCULADORA DE PORCENTAGEM REAL
  // =========================================================================
  const screen8 = figma.createFrame();
  screen8.name = "08 - Calculadora de Porcentagem";
  screen8.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen8.x = currentX; screen8.y = 0;
  screen8.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  screen8.clipsContent = true;
  screen8.appendChild(createHeader("Calculadora de Porcentagem", "Calcule fatias, acréscimos e descontos"));

  const pResCard = createCard(SCREEN_WIDTH - 48, 120, colors.white, 20);
  pResCard.x = 24; pResCard.y = 126;
  const prLbl = createText("Resultado do Cálculo", { fontSize: 11, color: colors.textMuted }); prLbl.x = 18; prLbl.y = 16; pResCard.appendChild(prLbl);
  const prVal = createText("R$ 225,00", { fontSize: 32, weight: "bold", color: colors.primary }); prVal.x = 18; prVal.y = 38; pResCard.appendChild(prVal);
  const prSub = createText("15% de R$ 1.500,00", { fontSize: 11, color: colors.textMuted }); prSub.x = 18; prSub.y = 82; pResCard.appendChild(prSub);
  screen8.appendChild(pResCard);

  const opCard = createCard(SCREEN_WIDTH - 48, 400, colors.white, 20);
  opCard.x = 24; opCard.y = 262;
  const opTitle = createText("Operação", { fontSize: 12, weight: "bold", color: colors.textDark }); opTitle.x = 18; opTitle.y = 16; opCard.appendChild(opTitle);

  const opTabs = ["Quanto é X% de Y", "+ Acréscimo", "- Desconto"];
  let opX = 18;
  opTabs.forEach((ot, idx) => {
    const isA = idx === 0;
    const opP = figma.createFrame(); opP.resize(100, 32); opP.cornerRadius = 16; opP.x = opX; opX += 108; opP.y = 40;
    opP.fills = [{ type: "SOLID", color: isA ? { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } : { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
    const otT = createText(ot, { fontSize: 10, weight: "bold", color: isA ? colors.white : colors.textMuted });
    otT.x = (opP.width - otT.width) / 2; otT.y = 8; opP.appendChild(otT);
    opCard.appendChild(opP);
  });

  const vBox = figma.createFrame(); vBox.resize(opCard.width - 36, 56); vBox.cornerRadius = 14; vBox.x = 18; vBox.y = 96;
  vBox.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  const vl1 = createText("Valor Total (Y)", { fontSize: 10, color: colors.textMuted }); vl1.x = 16; vl1.y = 8; vBox.appendChild(vl1);
  const vt1 = createText("1500", { fontSize: 15, weight: "bold", color: colors.textDark }); vt1.x = 16; vt1.y = 26; vBox.appendChild(vt1);
  opCard.appendChild(vBox);

  const pBox = figma.createFrame(); pBox.resize(opCard.width - 36, 56); pBox.cornerRadius = 14; pBox.x = 18; pBox.y = 166;
  pBox.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  const vl2 = createText("Porcentagem (X%)", { fontSize: 10, color: colors.textMuted }); vl2.x = 16; vl2.y = 8; pBox.appendChild(vl2);
  const vt2 = createText("15 %", { fontSize: 15, weight: "bold", color: colors.textDark }); vt2.x = 16; vt2.y = 26; pBox.appendChild(vt2);
  opCard.appendChild(pBox);

  const prLbl2 = createText("Atalhos rápidos:", { fontSize: 11, color: colors.textMuted }); prLbl2.x = 18; prLbl2.y = 240; opCard.appendChild(prLbl2);
  const prs = [5, 10, 15, 20, 25, 50];
  prs.forEach((pr, i) => {
    const chip = figma.createFrame(); chip.resize(44, 28); chip.cornerRadius = 8; chip.x = 18 + i * 50; chip.y = 264;
    chip.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
    const ct = createText(`${pr}%`, { fontSize: 11, weight: "bold", color: colors.primary }); ct.x = (chip.width - ct.width) / 2; ct.y = 6; chip.appendChild(ct);
    opCard.appendChild(chip);
  });

  screen8.appendChild(opCard);

  const nav8 = createFloatingNavBar(SCREEN_WIDTH, "Mais");
  nav8.x = 16; nav8.y = SCREEN_HEIGHT - 88;
  screen8.appendChild(nav8);
  allScreens.push(screen8);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 9: PERFIL & CONFIGURAÇÕES (MOBILE SETTINGS MENU REAL)
  // =========================================================================
  const screen9 = figma.createFrame();
  screen9.name = "09 - Perfil & Configurações";
  screen9.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen9.x = currentX; screen9.y = 0;
  screen9.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  screen9.clipsContent = true;
  screen9.appendChild(createHeader("Configurações & Perfil", "Preferências, segurança e conta"));

  const profileCard = createCard(SCREEN_WIDTH - 48, 96, colors.white, 20);
  profileCard.x = 24; profileCard.y = 126;
  const avatarCircle = figma.createFrame(); avatarCircle.resize(56, 56); avatarCircle.cornerRadius = 28; avatarCircle.x = 16; avatarCircle.y = 20;
  avatarCircle.fills = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } }];
  const avatarTxt = createText("PC", { fontSize: 18, weight: "bold", color: colors.white });
  avatarTxt.x = (avatarCircle.width - avatarTxt.width) / 2; avatarTxt.y = 16; avatarCircle.appendChild(avatarTxt);
  profileCard.appendChild(avatarCircle);
  const pName = createText("Pedro Castro", { fontSize: 15, weight: "bold", color: colors.textDark }); pName.x = 84; pName.y = 26; profileCard.appendChild(pName);
  const pEmail = createText("pedrocastro767@gmail.com", { fontSize: 11, color: colors.textMuted }); pEmail.x = 84; pEmail.y = 48; profileCard.appendChild(pEmail);
  screen9.appendChild(profileCard);

  const menuCard = createCard(SCREEN_WIDTH - 48, 480, colors.white, 20);
  menuCard.x = 24; menuCard.y = 238;
  const menuItems = [
    { name: "Meus Dados Pessoais", sub: "Nome, e-mail e telefone", iconKey: "user", color: colors.primary },
    { name: "Segurança & Acesso", sub: "Senha, 2FA e biometria", iconKey: "shield", color: colors.emerald },
    { name: "Notificações & Alertas", sub: "Lembretes de faturas e limites", iconKey: "bell", color: colors.amber },
    { name: "Aparência & Preferências", sub: "Modo Escuro e moeda BRL", iconKey: "palette", color: colors.purple },
    { name: "Meu Plano & Assinatura", sub: "Gerenciar Plano FinControl PRO", iconKey: "crown", color: colors.primaryLight },
    { name: "Exportar Dados (Backup)", sub: "Planilha Excel e relatórios PDF", iconKey: "database", color: colors.indigo },
    { name: "Sair da Conta", sub: "Encerrar sessão no dispositivo", iconKey: "logout", color: colors.rose, isDanger: true }
  ];
  menuItems.forEach((m, idx) => {
    const rowY = 14 + idx * 66;
    const icBox = figma.createFrame(); icBox.resize(40, 40); icBox.cornerRadius = 12; icBox.x = 16; icBox.y = rowY;
    icBox.fills = [{ type: "SOLID", color: { r: m.color.r, g: m.color.g, b: m.color.b }, opacity: 0.12 }];
    menuCard.appendChild(icBox);
    const mIcon = createIcon(svgIcons[m.iconKey], 18, m.color); mIcon.x = 27; mIcon.y = rowY + 11; menuCard.appendChild(mIcon);
    const mn = createText(m.name, { fontSize: 13, weight: "bold", color: m.isDanger ? colors.rose : colors.textDark }); mn.x = 68; mn.y = rowY + 3; menuCard.appendChild(mn);
    const ms = createText(m.sub, { fontSize: 10, color: colors.textMuted }); ms.x = 68; ms.y = rowY + 22; menuCard.appendChild(ms);
    const chev = createIcon(svgIcons.chevronRight, 16, colors.textSubtle); chev.x = menuCard.width - 32; chev.y = rowY + 12; menuCard.appendChild(chev);
  });
  screen9.appendChild(menuCard);

  const nav9 = createFloatingNavBar(SCREEN_WIDTH, "Mais");
  nav9.x = 16; nav9.y = SCREEN_HEIGHT - 88;
  screen9.appendChild(nav9);
  allScreens.push(screen9);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 10: PLANOS & UPGRADE PRO (PLANS REAL)
  // =========================================================================
  const screen10 = figma.createFrame();
  screen10.name = "10 - Planos & Upgrade PRO";
  screen10.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen10.x = currentX; screen10.y = 0;
  screen10.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  screen10.clipsContent = true;
  screen10.appendChild(createHeader("Planos & Assinatura", "Evolua para o FinControl PRO"));

  const proCard = figma.createFrame(); proCard.resize(SCREEN_WIDTH - 48, 590); proCard.cornerRadius = 24; proCard.x = 24; proCard.y = 126;
  proCard.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  proCard.strokes = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } }]; proCard.strokeWeight = 2;

  const proTitle = createText("FinControl PRO", { fontSize: 24, weight: "bold", color: colors.textDark }); proTitle.x = 20; proTitle.y = 50; proCard.appendChild(proTitle);
  const proPrice = createText("R$ 29,90", { fontSize: 36, weight: "bold", color: colors.primary }); proPrice.x = 20; proPrice.y = 100; proCard.appendChild(proPrice);

  const benefits = [
    "Transações e contas ilimitadas",
    "Gestão avançada de múltiplos cartões",
    "Previsões e fluxo de caixa com IA",
    "Calculadoras Financeiras exclusivas",
    "Backup e exportação para Excel e PDF"
  ];
  benefits.forEach((b, i) => {
    const rowY = 170 + i * 46;
    const chk = createIcon(svgIcons.check, 16, colors.emerald); chk.x = 20; chk.y = rowY; proCard.appendChild(chk);
    const bt = createText(b, { fontSize: 12, weight: "bold", color: colors.textDark }); bt.x = 48; bt.y = rowY; proCard.appendChild(bt);
  });

  const btnPro = figma.createFrame(); btnPro.resize(proCard.width - 40, 52); btnPro.cornerRadius = 26; btnPro.x = 20; btnPro.y = proCard.height - 72;
  btnPro.fills = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } }];
  const btnProTxt = createText("Assinar Plano PRO", { fontSize: 14, weight: "bold", color: colors.white });
  btnProTxt.x = (btnPro.width - btnProTxt.width) / 2; btnProTxt.y = 16; btnPro.appendChild(btnProTxt);
  proCard.appendChild(btnPro);
  screen10.appendChild(proCard);

  const nav10 = createFloatingNavBar(SCREEN_WIDTH, "Mais");
  nav10.x = 16; nav10.y = SCREEN_HEIGHT - 88;
  screen10.appendChild(nav10);
  allScreens.push(screen10);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 11: MODAL NOVA TRANSAÇÃO (BOTTOMSHEET 1:1 REAL)
  // =========================================================================
  const screen11 = figma.createFrame();
  screen11.name = "11 - BottomSheet: Nova Transação";
  screen11.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen11.x = currentX; screen11.y = 0;
  screen11.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.08, b: 0.15 }, opacity: 0.72 }];
  screen11.clipsContent = true;

  // BottomSheet Container
  const sheet11 = figma.createFrame();
  sheet11.resize(SCREEN_WIDTH, 716);
  sheet11.x = 0; sheet11.y = SCREEN_HEIGHT - 716;
  sheet11.topLeftRadius = 32; sheet11.topRightRadius = 32;
  sheet11.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  sheet11.clipsContent = true;

  // Drag handle
  const h11 = figma.createFrame(); h11.resize(44, 5); h11.cornerRadius = 2.5; h11.x = (SCREEN_WIDTH - 44) / 2; h11.y = 12;
  h11.fills = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  sheet11.appendChild(h11);

  // Header
  const s11Title = createText("Nova Transação", { fontSize: 18, weight: "bold", color: colors.textDark }); s11Title.x = 24; s11Title.y = 28; sheet11.appendChild(s11Title);
  const s11Sub = createText("Preencha os dados do lançamento financeiro", { fontSize: 11, color: colors.textMuted }); s11Sub.x = 24; s11Sub.y = 52; sheet11.appendChild(s11Sub);
  const closeBtn11 = figma.createFrame(); closeBtn11.resize(32, 32); closeBtn11.cornerRadius = 16; closeBtn11.x = SCREEN_WIDTH - 56; closeBtn11.y = 28;
  closeBtn11.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  const closeIc11 = createIcon(svgIcons.close, 16, colors.textMuted); closeIc11.x = 8; closeIc11.y = 8; closeBtn11.appendChild(closeIc11);
  sheet11.appendChild(closeBtn11);

  // Tipo de Lançamento (Receita vs Despesa)
  const lblTipo = createText("TIPO DE LANÇAMENTO", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblTipo.x = 24; lblTipo.y = 82; sheet11.appendChild(lblTipo);
  const btnRec11 = figma.createFrame(); btnRec11.resize(165, 52); btnRec11.cornerRadius = 14; btnRec11.x = 24; btnRec11.y = 100;
  btnRec11.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  btnRec11.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const icRecBox = figma.createFrame(); icRecBox.resize(32, 32); icRecBox.cornerRadius = 10; icRecBox.x = 10; icRecBox.y = 10;
  icRecBox.fills = [{ type: "SOLID", color: { r: colors.emeraldBg.r, g: colors.emeraldBg.g, b: colors.emeraldBg.b } }];
  const icRec = createIcon(svgIcons.trendingUp, 16, colors.emerald); icRec.x = 8; icRec.y = 8; icRecBox.appendChild(icRec); btnRec11.appendChild(icRecBox);
  const txtRec = createText("Receita", { fontSize: 13, weight: "bold", color: colors.textMuted }); txtRec.x = 52; txtRec.y = 17; btnRec11.appendChild(txtRec);
  sheet11.appendChild(btnRec11);

  // Despesa (Ativa)
  const btnDesp11 = figma.createFrame(); btnDesp11.resize(165, 52); btnDesp11.cornerRadius = 14; btnDesp11.x = 201; btnDesp11.y = 100;
  btnDesp11.fills = [{ type: "SOLID", color: { r: colors.roseBg.r, g: colors.roseBg.g, b: colors.roseBg.b } }];
  btnDesp11.strokes = [{ type: "SOLID", color: { r: colors.rose.r, g: colors.rose.g, b: colors.rose.b } }]; btnDesp11.strokeWeight = 1.5;
  const icDespBox = figma.createFrame(); icDespBox.resize(32, 32); icDespBox.cornerRadius = 10; icDespBox.x = 10; icDespBox.y = 10;
  icDespBox.fills = [{ type: "SOLID", color: { r: colors.rose.r, g: colors.rose.g, b: colors.rose.b }, opacity: 0.15 }];
  const icDesp = createIcon(svgIcons.trendingDown, 16, colors.rose); icDesp.x = 8; icDesp.y = 8; icDespBox.appendChild(icDesp); btnDesp11.appendChild(icDespBox);
  const txtDesp = createText("Despesa", { fontSize: 13, weight: "bold", color: colors.roseText }); txtDesp.x = 52; txtDesp.y = 17; btnDesp11.appendChild(txtDesp);
  sheet11.appendChild(btnDesp11);

  // Display FinTech "Valor do Lançamento"
  const valBox11 = figma.createFrame(); valBox11.resize(342, 84); valBox11.cornerRadius = 18; valBox11.x = 24; valBox11.y = 164;
  valBox11.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  valBox11.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const vLabel11 = createText("VALOR DO LANÇAMENTO", { fontSize: 9, weight: "bold", color: colors.textSubtle }); vLabel11.x = 18; vLabel11.y = 12; valBox11.appendChild(vLabel11);
  const vPfx11 = createText("R$", { fontSize: 18, weight: "bold", color: colors.rose }); vPfx11.x = 18; vPfx11.y = 38; valBox11.appendChild(vPfx11);
  const vNum11 = createText("184,50", { fontSize: 32, weight: "bold", color: colors.rose }); vNum11.x = 52; vNum11.y = 30; valBox11.appendChild(vNum11);
  sheet11.appendChild(valBox11);

  // Categoria
  const lblCat = createText("CATEGORIA", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblCat.x = 24; lblCat.y = 262; sheet11.appendChild(lblCat);
  const selCat11 = figma.createFrame(); selCat11.resize(342, 50); selCat11.cornerRadius = 14; selCat11.x = 24; selCat11.y = 280;
  selCat11.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  selCat11.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const catIcB = figma.createFrame(); catIcB.resize(32, 32); catIcB.cornerRadius = 10; catIcB.x = 10; catIcB.y = 9;
  catIcB.fills = [{ type: "SOLID", color: { r: colors.amber.r, g: colors.amber.g, b: colors.amber.b }, opacity: 0.15 }];
  const catIc = createIcon(svgIcons.utensils, 16, colors.amber); catIc.x = 8; catIc.y = 8; catIcB.appendChild(catIc); selCat11.appendChild(catIcB);
  const catTxt = createText("Alimentação & Restaurantes", { fontSize: 13, weight: "bold", color: colors.textDark }); catTxt.x = 50; catTxt.y = 16; selCat11.appendChild(catTxt);
  const catChev = createIcon(svgIcons.chevronRight, 16, colors.textSubtle); catChev.x = 312; catChev.y = 17; selCat11.appendChild(catChev);
  sheet11.appendChild(selCat11);

  // Descrição
  const lblDesc = createText("DESCRIÇÃO", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblDesc.x = 24; lblDesc.y = 342; sheet11.appendChild(lblDesc);
  const inDesc11 = figma.createFrame(); inDesc11.resize(342, 48); inDesc11.cornerRadius = 14; inDesc11.x = 24; inDesc11.y = 360;
  inDesc11.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  inDesc11.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const inDescTxt = createText("Jantar no Outback Steakhouse", { fontSize: 13, color: colors.textDark }); inDescTxt.x = 16; inDescTxt.y = 15; inDesc11.appendChild(inDescTxt);
  sheet11.appendChild(inDesc11);

  // Grid Data & Conta/Cartão
  const lblDt = createText("DATA", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblDt.x = 24; lblDt.y = 420; sheet11.appendChild(lblDt);
  const inDt11 = figma.createFrame(); inDt11.resize(165, 48); inDt11.cornerRadius = 14; inDt11.x = 24; inDt11.y = 438;
  inDt11.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  inDt11.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const dtIc = createIcon(svgIcons.calendar, 16, colors.textMuted); dtIc.x = 12; dtIc.y = 16; inDt11.appendChild(dtIc);
  const dtTxt = createText("22/10/2026", { fontSize: 12, weight: "bold", color: colors.textDark }); dtTxt.x = 36; dtTxt.y = 16; inDt11.appendChild(dtTxt);
  sheet11.appendChild(inDt11);

  const lblCard = createText("PAGAMENTO", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblCard.x = 201; lblCard.y = 420; sheet11.appendChild(lblCard);
  const inCard11 = figma.createFrame(); inCard11.resize(165, 48); inCard11.cornerRadius = 14; inCard11.x = 201; inCard11.y = 438;
  inCard11.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  inCard11.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const cardIc11 = createIcon(svgIcons.cards, 16, colors.textMuted); cardIc11.x = 12; cardIc11.y = 16; inCard11.appendChild(cardIc11);
  const cardTxt11 = createText("Nubank Black", { fontSize: 12, weight: "bold", color: colors.textDark }); cardTxt11.x = 36; cardTxt11.y = 16; inCard11.appendChild(cardTxt11);
  sheet11.appendChild(inCard11);

  // Toggle Recorrência
  const recBox11 = figma.createFrame(); recBox11.resize(342, 46); recBox11.cornerRadius = 14; recBox11.x = 24; recBox11.y = 502;
  recBox11.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  recBox11.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const recTxt11 = createText("Despesa fixa ou recorrente", { fontSize: 12, weight: "bold", color: colors.textDark }); recTxt11.x = 16; recTxt11.y = 15; recBox11.appendChild(recTxt11);
  const toggleTrack = figma.createFrame(); toggleTrack.resize(38, 22); toggleTrack.cornerRadius = 11; toggleTrack.x = 288; toggleTrack.y = 12;
  toggleTrack.fills = [{ type: "SOLID", color: { r: colors.emerald.r, g: colors.emerald.g, b: colors.emerald.b } }];
  const toggleThumb = figma.createEllipse(); toggleThumb.resize(18, 18); toggleThumb.x = 18; toggleThumb.y = 2;
  toggleThumb.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  toggleTrack.appendChild(toggleThumb); recBox11.appendChild(toggleTrack);
  sheet11.appendChild(recBox11);

  // Rodapé de Ações
  const foot11 = figma.createFrame(); foot11.resize(SCREEN_WIDTH, 88); foot11.x = 0; foot11.y = sheet11.height - 88;
  foot11.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  foot11.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const btnCancel11 = figma.createFrame(); btnCancel11.resize(110, 50); btnCancel11.cornerRadius = 25; btnCancel11.x = 24; btnCancel11.y = 16;
  btnCancel11.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  btnCancel11.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const btnCancelTxt = createText("Cancelar", { fontSize: 13, weight: "bold", color: colors.textMuted });
  btnCancelTxt.x = (btnCancel11.width - btnCancelTxt.width) / 2; btnCancelTxt.y = 16; btnCancel11.appendChild(btnCancelTxt);
  foot11.appendChild(btnCancel11);

  const btnSalvar11 = figma.createFrame(); btnSalvar11.resize(218, 50); btnSalvar11.cornerRadius = 25; btnSalvar11.x = 148; btnSalvar11.y = 16;
  btnSalvar11.fills = [{ type: "SOLID", color: { r: colors.rose.r, g: colors.rose.g, b: colors.rose.b } }];
  const btnSalvarTxt = createText("Adicionar Despesa", { fontSize: 14, weight: "bold", color: colors.white });
  btnSalvarTxt.x = (btnSalvar11.width - btnSalvarTxt.width) / 2; btnSalvarTxt.y = 16; btnSalvar11.appendChild(btnSalvarTxt);
  foot11.appendChild(btnSalvar11);

  sheet11.appendChild(foot11);
  screen11.appendChild(sheet11);
  allScreens.push(screen11);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 12: MODAL NOVA CATEGORIA (BOTTOMSHEET 1:1 REAL DE CATEGORIES.TSX)
  // =========================================================================
  const screen12 = figma.createFrame();
  screen12.name = "12 - BottomSheet: Nova Categoria";
  screen12.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen12.x = currentX; screen12.y = 0;
  screen12.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.08, b: 0.15 }, opacity: 0.72 }];
  screen12.clipsContent = true;

  // BottomSheet Container
  const sheet12 = figma.createFrame();
  sheet12.resize(SCREEN_WIDTH, 716);
  sheet12.x = 0; sheet12.y = SCREEN_HEIGHT - 716;
  sheet12.topLeftRadius = 32; sheet12.topRightRadius = 32;
  sheet12.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  sheet12.clipsContent = true;

  // Drag handle
  const h12 = figma.createFrame(); h12.resize(44, 5); h12.cornerRadius = 2.5; h12.x = (SCREEN_WIDTH - 44) / 2; h12.y = 12;
  h12.fills = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  sheet12.appendChild(h12);

  // Header
  const s12Title = createText("Nova Categoria", { fontSize: 18, weight: "bold", color: colors.textDark }); s12Title.x = 24; s12Title.y = 28; sheet12.appendChild(s12Title);
  const s12Sub = createText("Preencha os dados e escolha um ícone", { fontSize: 11, color: colors.textMuted }); s12Sub.x = 24; s12Sub.y = 52; sheet12.appendChild(s12Sub);
  const closeBtn12 = figma.createFrame(); closeBtn12.resize(32, 32); closeBtn12.cornerRadius = 16; closeBtn12.x = SCREEN_WIDTH - 56; closeBtn12.y = 28;
  closeBtn12.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  const closeIc12 = createIcon(svgIcons.close, 16, colors.textMuted); closeIc12.x = 8; closeIc12.y = 8; closeBtn12.appendChild(closeIc12);
  sheet12.appendChild(closeBtn12);

  // Campo Nome da Categoria
  const lblCatNome = createText("NOME DA CATEGORIA", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblCatNome.x = 24; lblCatNome.y = 82; sheet12.appendChild(lblCatNome);
  const inCatNome = figma.createFrame(); inCatNome.resize(342, 48); inCatNome.cornerRadius = 14; inCatNome.x = 24; inCatNome.y = 100;
  inCatNome.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  inCatNome.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const inCatTxt = createText("Viagens & Férias", { fontSize: 13, weight: "bold", color: colors.textDark }); inCatTxt.x = 16; inCatTxt.y = 15; inCatNome.appendChild(inCatTxt);
  sheet12.appendChild(inCatNome);

  // Tipo (Receita vs Despesa)
  const lblCatTipo = createText("TIPO DA CATEGORIA", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblCatTipo.x = 24; lblCatTipo.y = 160; sheet12.appendChild(lblCatTipo);
  const catBtnRec = figma.createFrame(); catBtnRec.resize(165, 50); catBtnRec.cornerRadius = 14; catBtnRec.x = 24; catBtnRec.y = 178;
  catBtnRec.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  catBtnRec.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const cIcRec = createIcon(svgIcons.trendingUp, 16, colors.emerald); cIcRec.x = 14; cIcRec.y = 17; catBtnRec.appendChild(cIcRec);
  const cTxtRec = createText("Receita", { fontSize: 13, weight: "bold", color: colors.textMuted }); cTxtRec.x = 42; cTxtRec.y = 16; catBtnRec.appendChild(cTxtRec);
  sheet12.appendChild(catBtnRec);

  const catBtnDesp = figma.createFrame(); catBtnDesp.resize(165, 50); catBtnDesp.cornerRadius = 14; catBtnDesp.x = 201; catBtnDesp.y = 178;
  catBtnDesp.fills = [{ type: "SOLID", color: { r: colors.roseBg.r, g: colors.roseBg.g, b: colors.roseBg.b } }];
  catBtnDesp.strokes = [{ type: "SOLID", color: { r: colors.rose.r, g: colors.rose.g, b: colors.rose.b } }]; catBtnDesp.strokeWeight = 1.5;
  const cIcDesp = createIcon(svgIcons.trendingDown, 16, colors.rose); cIcDesp.x = 14; cIcDesp.y = 17; catBtnDesp.appendChild(cIcDesp);
  const cTxtDesp = createText("Despesa", { fontSize: 13, weight: "bold", color: colors.roseText }); cTxtDesp.x = 42; cTxtDesp.y = 16; catBtnDesp.appendChild(cTxtDesp);
  sheet12.appendChild(catBtnDesp);

  // Seletor de Ícone
  const lblCatIcon = createText("ESCOLHA O ÍCONE", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblCatIcon.x = 24; lblCatIcon.y = 240; sheet12.appendChild(lblCatIcon);
  const iconOptions = [
    { key: "plane", active: true },
    { key: "utensils", active: false },
    { key: "car", active: false },
    { key: "heartPulse", active: false },
    { key: "shoppingBag", active: false },
    { key: "sparkles", active: false }
  ];
  iconOptions.forEach((opt, idx) => {
    const iX = 24 + idx * 58;
    const iBox = figma.createFrame(); iBox.resize(48, 48); iBox.cornerRadius = 14; iBox.x = iX; iBox.y = 258;
    if (opt.active) {
      iBox.fills = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b }, opacity: 0.12 }];
      iBox.strokes = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } }]; iBox.strokeWeight = 1.5;
    } else {
      iBox.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
      iBox.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
    }
    const cIcn = createIcon(svgIcons[opt.key], 20, opt.active ? colors.primary : colors.textMuted);
    cIcn.x = 14; cIcn.y = 14; iBox.appendChild(cIcn);
    sheet12.appendChild(iBox);
  });

  // Seletor de Cores
  const lblCatCor = createText("COR DA CATEGORIA", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblCatCor.x = 24; lblCatCor.y = 318; sheet12.appendChild(lblCatCor);
  const colorPalette = [
    { col: colors.primary, active: true },
    { col: hexToRgba("06b6d4"), active: false },
    { col: colors.emerald, active: false },
    { col: colors.purple, active: false },
    { col: hexToRgba("ec4899"), active: false },
    { col: colors.amber, active: false },
    { col: colors.rose, active: false }
  ];
  colorPalette.forEach((cp, idx) => {
    const cX = 24 + idx * 49;
    const dotWrapper = figma.createFrame(); dotWrapper.resize(36, 36); dotWrapper.cornerRadius = 18; dotWrapper.x = cX; dotWrapper.y = 336;
    dotWrapper.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    if (cp.active) {
      dotWrapper.strokes = [{ type: "SOLID", color: { r: cp.col.r, g: cp.col.g, b: cp.col.b } }]; dotWrapper.strokeWeight = 2;
    }
    const dot = figma.createEllipse(); dot.resize(24, 24); dot.x = 6; dot.y = 6;
    dot.fills = [{ type: "SOLID", color: { r: cp.col.r, g: cp.col.g, b: cp.col.b } }];
    dotWrapper.appendChild(dot); sheet12.appendChild(dotWrapper);
  });

  // Live Preview 1:1 com Categories.tsx
  const lblPrev = createText("PRÉ-VISUALIZAÇÃO EM TEMPO REAL", { fontSize: 9, weight: "bold", color: colors.textSubtle }); lblPrev.x = 24; lblPrev.y = 394; sheet12.appendChild(lblPrev);
  const prevCard = figma.createFrame(); prevCard.resize(342, 80); prevCard.cornerRadius = 18; prevCard.x = 24; prevCard.y = 412;
  prevCard.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  prevCard.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  prevCard.clipsContent = true;

  // Borda lateral com a cor ativa
  const sideColor = figma.createFrame(); sideColor.resize(5, 80); sideColor.x = 337; sideColor.y = 0;
  sideColor.fills = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } }];
  prevCard.appendChild(sideColor);

  const prevIconB = figma.createFrame(); prevIconB.resize(46, 46); prevIconB.cornerRadius = 14; prevIconB.x = 16; prevIconB.y = 17;
  prevIconB.fills = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b }, opacity: 0.15 }];
  const prevIcon = createIcon(svgIcons.plane, 22, colors.primary); prevIcon.x = 12; prevIcon.y = 12; prevIconB.appendChild(prevIcon);
  prevCard.appendChild(prevIconB);

  const prevTitle = createText("Viagens & Férias", { fontSize: 14, weight: "bold", color: colors.textDark }); prevTitle.x = 74; prevTitle.y = 20; prevCard.appendChild(prevTitle);
  const prevBadge = figma.createFrame(); prevBadge.resize(68, 20); prevBadge.cornerRadius = 10; prevBadge.x = 74; prevBadge.y = 42;
  prevBadge.fills = [{ type: "SOLID", color: { r: colors.roseBg.r, g: colors.roseBg.g, b: colors.roseBg.b } }];
  const prevBadgeTxt = createText("Despesa", { fontSize: 10, weight: "bold", color: colors.roseText }); prevBadgeTxt.x = 12; prevBadgeTxt.y = 3; prevBadge.appendChild(prevBadgeTxt);
  prevCard.appendChild(prevBadge);
  sheet12.appendChild(prevCard);

  // Rodapé de Ações
  const foot12 = figma.createFrame(); foot12.resize(SCREEN_WIDTH, 88); foot12.x = 0; foot12.y = sheet12.height - 88;
  foot12.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  foot12.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const btnCancel12 = figma.createFrame(); btnCancel12.resize(110, 50); btnCancel12.cornerRadius = 25; btnCancel12.x = 24; btnCancel12.y = 16;
  btnCancel12.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  btnCancel12.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const btnCancelTxt12 = createText("Cancelar", { fontSize: 13, weight: "bold", color: colors.textMuted });
  btnCancelTxt12.x = (btnCancel12.width - btnCancelTxt12.width) / 2; btnCancelTxt12.y = 16; btnCancel12.appendChild(btnCancelTxt12);
  foot12.appendChild(btnCancel12);

  const btnSalvar12 = figma.createFrame(); btnSalvar12.resize(218, 50); btnSalvar12.cornerRadius = 25; btnSalvar12.x = 148; btnSalvar12.y = 16;
  btnSalvar12.fills = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } }];
  const btnSalvarTxt12 = createText("Criar Categoria", { fontSize: 14, weight: "bold", color: colors.white });
  btnSalvarTxt12.x = (btnSalvar12.width - btnSalvarTxt12.width) / 2; btnSalvarTxt12.y = 16; btnSalvar12.appendChild(btnSalvarTxt12);
  foot12.appendChild(btnSalvar12);

  sheet12.appendChild(foot12);
  screen12.appendChild(sheet12);
  allScreens.push(screen12);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 13: MODAL ADICIONAR CARTÃO (BOTTOMSHEET 1:1 REAL DE CREDITCARDMODAL.TSX)
  // =========================================================================
  const screen13 = figma.createFrame();
  screen13.name = "13 - BottomSheet: Adicionar Cartão";
  screen13.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen13.x = currentX; screen13.y = 0;
  screen13.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.08, b: 0.15 }, opacity: 0.72 }];
  screen13.clipsContent = true;

  // BottomSheet Container
  const sheet13 = figma.createFrame();
  sheet13.resize(SCREEN_WIDTH, 716);
  sheet13.x = 0; sheet13.y = SCREEN_HEIGHT - 716;
  sheet13.topLeftRadius = 32; sheet13.topRightRadius = 32;
  sheet13.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  sheet13.clipsContent = true;

  // Drag handle
  const h13 = figma.createFrame(); h13.resize(44, 5); h13.cornerRadius = 2.5; h13.x = (SCREEN_WIDTH - 44) / 2; h13.y = 12;
  h13.fills = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  sheet13.appendChild(h13);

  // Header
  const cardIcBox13 = figma.createFrame(); cardIcBox13.resize(36, 36); cardIcBox13.cornerRadius = 18; cardIcBox13.x = 24; cardIcBox13.y = 26;
  cardIcBox13.fills = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b }, opacity: 0.15 }];
  const topCardIc = createIcon(svgIcons.cards, 18, colors.primary); topCardIc.x = 9; topCardIc.y = 9; cardIcBox13.appendChild(topCardIc);
  sheet13.appendChild(cardIcBox13);

  const s13Title = createText("Novo Cartão", { fontSize: 18, weight: "bold", color: colors.textDark }); s13Title.x = 68; s13Title.y = 26; sheet13.appendChild(s13Title);
  const s13Sub = createText("Cadastre seu cartão para gerenciar faturas", { fontSize: 11, color: colors.textMuted }); s13Sub.x = 68; s13Sub.y = 48; sheet13.appendChild(s13Sub);
  const closeBtn13 = figma.createFrame(); closeBtn13.resize(32, 32); closeBtn13.cornerRadius = 16; closeBtn13.x = SCREEN_WIDTH - 56; closeBtn13.y = 28;
  closeBtn13.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  const closeIc13 = createIcon(svgIcons.close, 16, colors.textMuted); closeIc13.x = 8; closeIc13.y = 8; closeBtn13.appendChild(closeIc13);
  sheet13.appendChild(closeBtn13);

  // Mini Card 3D Preview (Ultra Estiloso)
  const miniCard = figma.createFrame(); miniCard.resize(342, 108); miniCard.cornerRadius = 18; miniCard.x = 24; miniCard.y = 76;
  miniCard.fills = [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[1, 0, 0], [0, 1, 0]],
    gradientStops: [
      { position: 0, color: { r: 0.06, g: 0.09, b: 0.16, a: 1 } },
      { position: 1, color: { r: 0.12, g: 0.16, b: 0.28, a: 1 } }
    ]
  }];
  miniCard.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.15 },
    offset: { x: 0, y: 6 },
    radius: 14,
    spread: 0,
    visible: true,
    blendMode: "NORMAL"
  }];

  const miniChip = figma.createFrame(); miniChip.resize(22, 16); miniChip.cornerRadius = 4; miniChip.x = 16; miniChip.y = 16;
  miniChip.fills = [{ type: "SOLID", color: { r: colors.goldChip.r, g: colors.goldChip.g, b: colors.goldChip.b } }];
  miniCard.appendChild(miniChip);

  const miniCardNm = createText("Nubank Ultravioleta", { fontSize: 13, weight: "bold", color: colors.white }); miniCardNm.x = 16; miniCardNm.y = 44; miniCard.appendChild(miniCardNm);
  const miniCardHolder = createText("PEDRO CASTRO", { fontSize: 9, weight: "bold", color: colors.textSubtle }); miniCardHolder.x = 16; miniCardHolder.y = 66; miniCard.appendChild(miniCardHolder);
  const miniCardLim = createText("Limite: R$ 15.000,00", { fontSize: 11, weight: "bold", color: colors.accentSky }); miniCardLim.x = 16; miniCardLim.y = 82; miniCard.appendChild(miniCardLim);

  // Bandeira Mastercard (dois círculos entrelaçados)
  const mc1 = figma.createEllipse(); mc1.resize(18, 18); mc1.x = 292; mc1.y = 76;
  mc1.fills = [{ type: "SOLID", color: { r: 0.92, g: 0.15, b: 0.15 } }];
  miniCard.appendChild(mc1);
  const mc2 = figma.createEllipse(); mc2.resize(18, 18); mc2.x = 304; mc2.y = 76;
  mc2.fills = [{ type: "SOLID", color: { r: 0.98, g: 0.62, b: 0.15 }, opacity: 0.85 }];
  miniCard.appendChild(mc2);
  sheet13.appendChild(miniCard);

  // Campo Nome do Cartão
  const lblCardNome = createText("NOME DO CARTÃO", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblCardNome.x = 24; lblCardNome.y = 200; sheet13.appendChild(lblCardNome);
  const inCardNome = figma.createFrame(); inCardNome.resize(342, 48); inCardNome.cornerRadius = 14; inCardNome.x = 24; inCardNome.y = 218;
  inCardNome.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  inCardNome.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const inCardNmTxt = createText("Nubank Ultravioleta", { fontSize: 13, weight: "bold", color: colors.textDark }); inCardNmTxt.x = 16; inCardNmTxt.y = 15; inCardNome.appendChild(inCardNmTxt);
  sheet13.appendChild(inCardNome);

  // Campo Bandeira/Instituição (Select Dropdown)
  const lblBrand = createText("BANDEIRA / INSTITUIÇÃO", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblBrand.x = 24; lblBrand.y = 278; sheet13.appendChild(lblBrand);
  const selBrand = figma.createFrame(); selBrand.resize(342, 48); selBrand.cornerRadius = 14; selBrand.x = 24; selBrand.y = 296;
  selBrand.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  selBrand.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const brandTxt = createText("Mastercard", { fontSize: 13, weight: "bold", color: colors.textDark }); brandTxt.x = 16; brandTxt.y = 15; selBrand.appendChild(brandTxt);
  const brandChev = createIcon(svgIcons.chevronRight, 16, colors.textSubtle); brandChev.x = 312; brandChev.y = 16; selBrand.appendChild(brandChev);
  sheet13.appendChild(selBrand);

  // Campo Limite
  const lblLimit = createText("LIMITE TOTAL (OPCIONAL)", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblLimit.x = 24; lblLimit.y = 356; sheet13.appendChild(lblLimit);
  const inLimit = figma.createFrame(); inLimit.resize(342, 48); inLimit.cornerRadius = 14; inLimit.x = 24; inLimit.y = 374;
  inLimit.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  inLimit.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const inLimPfx = createText("R$", { fontSize: 12, weight: "bold", color: colors.textSubtle }); inLimPfx.x = 16; inLimPfx.y = 16; inLimit.appendChild(inLimPfx);
  const inLimTxt = createText("15.000,00", { fontSize: 13, weight: "bold", color: colors.textDark }); inLimTxt.x = 42; inLimTxt.y = 15; inLimit.appendChild(inLimTxt);
  sheet13.appendChild(inLimit);

  // Grid Fechamento & Vencimento
  const lblCloseD = createText("DIA FECHAMENTO", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblCloseD.x = 24; lblCloseD.y = 434; sheet13.appendChild(lblCloseD);
  const inCloseD = figma.createFrame(); inCloseD.resize(165, 48); inCloseD.cornerRadius = 14; inCloseD.x = 24; inCloseD.y = 452;
  inCloseD.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  inCloseD.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const inCloseDTxt = createText("Dia 05", { fontSize: 13, weight: "bold", color: colors.textDark }); inCloseDTxt.x = 16; inCloseDTxt.y = 15; inCloseD.appendChild(inCloseDTxt);
  sheet13.appendChild(inCloseD);

  const lblDueD = createText("DIA VENCIMENTO", { fontSize: 10, weight: "bold", color: colors.textSubtle }); lblDueD.x = 201; lblDueD.y = 434; sheet13.appendChild(lblDueD);
  const inDueD = figma.createFrame(); inDueD.resize(165, 48); inDueD.cornerRadius = 14; inDueD.x = 201; inDueD.y = 452;
  inDueD.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  inDueD.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const inDueDTxt = createText("Dia 15", { fontSize: 13, weight: "bold", color: colors.textDark }); inDueDTxt.x = 16; inDueDTxt.y = 15; inDueD.appendChild(inDueDTxt);
  sheet13.appendChild(inDueD);

  // Rodapé de Ações
  const foot13 = figma.createFrame(); foot13.resize(SCREEN_WIDTH, 88); foot13.x = 0; foot13.y = sheet13.height - 88;
  foot13.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  foot13.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const btnCancel13 = figma.createFrame(); btnCancel13.resize(110, 50); btnCancel13.cornerRadius = 25; btnCancel13.x = 24; btnCancel13.y = 16;
  btnCancel13.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  btnCancel13.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const btnCancelTxt13 = createText("Cancelar", { fontSize: 13, weight: "bold", color: colors.textMuted });
  btnCancelTxt13.x = (btnCancel13.width - btnCancelTxt13.width) / 2; btnCancelTxt13.y = 16; btnCancel13.appendChild(btnCancelTxt13);
  foot13.appendChild(btnCancel13);

  const btnSalvar13 = figma.createFrame(); btnSalvar13.resize(218, 50); btnSalvar13.cornerRadius = 25; btnSalvar13.x = 148; btnSalvar13.y = 16;
  btnSalvar13.fills = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } }];
  const saveIc13 = createIcon(svgIcons.save, 16, colors.white); saveIc13.x = 42; saveIc13.y = 17; btnSalvar13.appendChild(saveIc13);
  const btnSalvarTxt13 = createText("Adicionar Cartão", { fontSize: 14, weight: "bold", color: colors.white });
  btnSalvarTxt13.x = 68; btnSalvarTxt13.y = 16; btnSalvar13.appendChild(btnSalvarTxt13);
  foot13.appendChild(btnSalvar13);

  sheet13.appendChild(foot13);
  screen13.appendChild(sheet13);
  allScreens.push(screen13);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 14: LOGIN COM DESIGN REAL
  // =========================================================================
  const screen14 = figma.createFrame();
  screen14.name = "14 - Login / Autenticação";
  screen14.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen14.x = currentX; screen14.y = 0;
  screen14.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  screen14.clipsContent = true;

  const logCard = createCard(SCREEN_WIDTH - 48, 520, colors.white, 24);
  logCard.x = 24; logCard.y = 160;
  const lHead = createText("Bem-vindo de volta!", { fontSize: 20, weight: "bold", color: colors.textDark }); lHead.x = 24; lHead.y = 32; logCard.appendChild(lHead);
  const lSub = createText("Entre na sua conta para continuar", { fontSize: 12, color: colors.textMuted }); lSub.x = 24; lSub.y = 60; logCard.appendChild(lSub);

  const inEmail = figma.createFrame(); inEmail.resize(logCard.width - 48, 56); inEmail.cornerRadius = 14; inEmail.x = 24; inEmail.y = 100;
  inEmail.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  inEmail.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const inET = createText("E-mail", { fontSize: 10, color: colors.textMuted }); inET.x = 16; inET.y = 8; inEmail.appendChild(inET);
  const inEV = createText("pedrocastro767@gmail.com", { fontSize: 13, weight: "bold", color: colors.textDark }); inEV.x = 16; inEV.y = 26; inEmail.appendChild(inEV);
  logCard.appendChild(inEmail);

  const inPass = figma.createFrame(); inPass.resize(logCard.width - 48, 56); inPass.cornerRadius = 14; inPass.x = 24; inPass.y = 176;
  inPass.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
  inPass.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  const inPT = createText("Senha", { fontSize: 10, color: colors.textMuted }); inPT.x = 16; inPT.y = 8; inPass.appendChild(inPT);
  const inPV = createText("••••••••••••", { fontSize: 13, weight: "bold", color: colors.textDark }); inPV.x = 16; inPV.y = 26; inPass.appendChild(inPV);
  logCard.appendChild(inPass);

  const btnEntrar = figma.createFrame(); btnEntrar.resize(logCard.width - 48, 52); btnEntrar.cornerRadius = 26; btnEntrar.x = 24; btnEntrar.y = 260;
  btnEntrar.fills = [{ type: "SOLID", color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b } }];
  const btnEntrarTxt = createText("Acessar Minha Conta", { fontSize: 14, weight: "bold", color: colors.white });
  btnEntrarTxt.x = (btnEntrar.width - btnEntrarTxt.width) / 2; btnEntrarTxt.y = 16; btnEntrar.appendChild(btnEntrarTxt);
  logCard.appendChild(btnEntrar);

  screen14.appendChild(logCard);
  allScreens.push(screen14);
  currentX += SPACING_X;

  // =========================================================================
  // TELA 15: BOAS-VINDAS / ONBOARDING (MOBILEWELCOME REAL)
  // =========================================================================
  const screen15 = figma.createFrame();
  screen15.name = "15 - Boas-Vindas & Onboarding";
  screen15.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  screen15.x = currentX; screen15.y = 0;
  screen15.fills = [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { position: 0, color: { r: colors.primary.r, g: colors.primary.g, b: colors.primary.b, a: 1 } },
      { position: 0.6, color: { r: colors.primaryLight.r, g: colors.primaryLight.g, b: colors.primaryLight.b, a: 1 } },
      { position: 1, color: { r: colors.textDark.r, g: colors.textDark.g, b: colors.textDark.b, a: 1 } }
    ]
  }];
  screen15.clipsContent = true;

  const logoCircle = figma.createFrame(); logoCircle.resize(80, 80); logoCircle.cornerRadius = 24; logoCircle.x = (SCREEN_WIDTH - 80) / 2; logoCircle.y = 160;
  logoCircle.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.15 }];
  const logoTxt = createText("FC", { fontSize: 28, weight: "bold", color: colors.white });
  logoTxt.x = (logoCircle.width - logoTxt.width) / 2; logoTxt.y = 22; logoCircle.appendChild(logoTxt);
  screen15.appendChild(logoCircle);

  const wTitle = createText("FinControl", { fontSize: 32, weight: "bold", color: colors.white });
  wTitle.x = (SCREEN_WIDTH - wTitle.width) / 2; wTitle.y = 270; screen15.appendChild(wTitle);

  const btn1 = figma.createFrame(); btn1.resize(SCREEN_WIDTH - 48, 56); btn1.cornerRadius = 28; btn1.x = 24; btn1.y = SCREEN_HEIGHT - 170;
  btn1.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  const btn1T = createText("Começar Agora", { fontSize: 15, weight: "bold", color: colors.primary });
  btn1T.x = (btn1.width - btn1T.width) / 2; btn1T.y = 18; btn1.appendChild(btn1T);
  screen15.appendChild(btn1);

  allScreens.push(screen15);
  currentX += SPACING_X;

  // =========================================================================
  // SEÇÃO: DESIGN SYSTEM & DESIGN TOKENS
  // =========================================================================
  const dsFrame = figma.createFrame();
  dsFrame.name = "16 - Design System & Tokens";
  dsFrame.resize(680, SCREEN_HEIGHT);
  dsFrame.x = currentX; dsFrame.y = 0;
  dsFrame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  dsFrame.strokes = [{ type: "SOLID", color: { r: colors.borderLight.r, g: colors.borderLight.g, b: colors.borderLight.b } }];
  dsFrame.strokeWeight = 1; dsFrame.cornerRadius = 24;

  const dt1 = createText("FinControl Mobile - Design Tokens", { fontSize: 20, weight: "bold", color: colors.textDark }); dt1.x = 32; dt1.y = 36; dsFrame.appendChild(dt1);

  const swatches = [
    { name: "Primary FinControl", hex: "#025EC2", col: colors.primary },
    { name: "Primary Light", hex: "#0284C7", col: colors.primaryLight },
    { name: "Emerald (Receitas)", hex: "#10B981", col: colors.emerald },
    { name: "Rose (Despesas)", hex: "#F43F5E", col: colors.rose },
    { name: "Amber (Avisos)", hex: "#F59E0B", col: colors.amber },
    { name: "Dark Surface", hex: "#090D16", col: hexToRgba("090d16") },
    { name: "Background Light", hex: "#F8FAFC", col: colors.bgLight },
    { name: "Border Subtle", hex: "#E2E8F0", col: colors.borderLight }
  ];
  swatches.forEach((sw, idx) => {
    const colIdx = idx % 2; const rowIdx = Math.floor(idx / 2);
    const bX = 32 + colIdx * 300; const bY = 90 + rowIdx * 64;
    const sc = figma.createFrame(); sc.resize(44, 44); sc.cornerRadius = 12; sc.x = bX; sc.y = bY;
    sc.fills = [{ type: "SOLID", color: { r: sw.col.r, g: sw.col.g, b: sw.col.b } }];
    dsFrame.appendChild(sc);
    const sn = createText(sw.name, { fontSize: 13, weight: "bold", color: colors.textDark }); sn.x = bX + 54; sn.y = bY + 6; dsFrame.appendChild(sn);
    const sh = createText(sw.hex, { fontSize: 11, color: colors.textMuted }); sh.x = bX + 54; sh.y = bY + 24; dsFrame.appendChild(sh);
  });

  const icTitle = createText("Ícones do Sistema (Vetoriais SVG Nativos)", { fontSize: 16, weight: "bold", color: colors.textDark }); icTitle.x = 32; icTitle.y = 370; dsFrame.appendChild(icTitle);
  const iconKeys = Object.keys(svgIcons);
  iconKeys.forEach((ik, idx) => {
    const iX = 32 + (idx % 6) * 62; const iY = 410 + Math.floor(idx / 6) * 54;
    const iBox = figma.createFrame(); iBox.resize(48, 48); iBox.cornerRadius = 12; iBox.x = iX; iBox.y = iY;
    iBox.fills = [{ type: "SOLID", color: { r: colors.bgLight.r, g: colors.bgLight.g, b: colors.bgLight.b } }];
    dsFrame.appendChild(iBox);
    const icn = createIcon(svgIcons[ik], 22, colors.primary); icn.x = iX + 13; icn.y = iY + 13; dsFrame.appendChild(icn);
  });

  allScreens.push(dsFrame);

  // 7. Enquadrar e Selecionar
  figma.currentPage.selection = allScreens;
  figma.viewport.scrollAndZoomIntoView(allScreens);

  // 8. Fechar com Sucesso
  figma.closePlugin("✨ Todas as telas refinadas com 100% de paridade visual foram geradas!");
}

main().catch(err => {
  console.error("Erro na execução do plugin FinControl:", err);
  figma.notify("Erro ao gerar: " + (err.message || String(err)), { error: true, timeout: 8000 });
});
