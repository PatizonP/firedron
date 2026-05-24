#!/usr/bin/env node

import https from "node:https";

const insecureAgent = new https.Agent({ rejectUnauthorized: false });

function loadEnv() {
  const env = {};

  for (const line of process.env.DIRECTUS_ENV?.split("\n") ?? []) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    env[trimmed.slice(0, separatorIndex)] = trimmed.slice(separatorIndex + 1);
  }

  return {
    DIRECTUS_URL:
      process.env.DIRECTUS_URL ?? env.DIRECTUS_URL ?? "https://zon04.vas-server.cz/admin/",
    DIRECTUS_ADMIN_EMAIL:
      process.env.DIRECTUS_ADMIN_EMAIL ?? env.DIRECTUS_ADMIN_EMAIL,
    DIRECTUS_ADMIN_PASSWORD:
      process.env.DIRECTUS_ADMIN_PASSWORD ?? env.DIRECTUS_ADMIN_PASSWORD,
  };
}

function getBaseUrl(rawUrl) {
  let baseUrl = rawUrl.replace(/\/admin\/?$/, "").replace(/\/$/, "");

  if (baseUrl.includes("://zon04.vas-server.cz")) {
    baseUrl = baseUrl.replace(
      "://zon04.vas-server.cz",
      "://directus.zon04.vas-server.cz",
    );
  }

  return baseUrl;
}

async function request(baseUrl, token, path, init = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers ?? {}),
  };

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    agent: insecureAgent,
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    throw new Error(
      `Directus request failed (${response.status}) ${path}: ${JSON.stringify(payload)}`,
    );
  }

  return payload;
}

async function login(baseUrl, email, password) {
  const payload = await request(baseUrl, null, "/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return payload.data.access_token;
}

async function ensureCollection(baseUrl, token) {
  const existing = await request(
    baseUrl,
    token,
    "/collections/fire_drone_content",
  ).catch(() => null);

  if (existing?.data) {
    console.log("Collection fire_drone_content already exists");
    return;
  }

  await request(baseUrl, token, "/collections", {
    method: "POST",
    body: JSON.stringify({
      collection: "fire_drone_content",
      meta: {
        collection: "fire_drone_content",
        icon: "article",
        display_template: "{{page}} / {{section}} ({{locale}})",
        note: "Text content grouped by page and section. Use locale for translations.",
      },
      schema: {},
      fields: [
        {
          field: "id",
          type: "uuid",
          meta: {
            hidden: true,
            readonly: true,
            interface: "input",
            special: ["uuid"],
          },
          schema: {
            is_primary_key: true,
            has_auto_increment: false,
          },
        },
      ],
    }),
  });

  const fields = [
    {
      field: "page",
      type: "string",
      meta: {
        interface: "select-dropdown",
        required: true,
        width: "half",
        options: {
          choices: [
            { text: "Global", value: "global" },
            { text: "Home", value: "home" },
            { text: "About us", value: "about-us" },
            { text: "Invest", value: "invest" },
          ],
        },
      },
      schema: { is_nullable: false },
    },
    {
      field: "section",
      type: "string",
      meta: {
        interface: "input",
        required: true,
        width: "half",
      },
      schema: { is_nullable: false },
    },
    {
      field: "locale",
      type: "string",
      meta: {
        interface: "select-dropdown",
        required: true,
        width: "half",
        options: {
          choices: [
            { text: "Čeština", value: "cs" },
            { text: "English", value: "en" },
          ],
        },
      },
      schema: { is_nullable: false, default_value: "cs" },
    },
    {
      field: "content",
      type: "json",
      meta: {
        interface: "input-code",
        required: true,
        options: { language: "json" },
      },
      schema: { is_nullable: false },
    },
  ];

  for (const field of fields) {
    await request(baseUrl, token, "/fields/fire_drone_content", {
      method: "POST",
      body: JSON.stringify(field),
    });
  }

  console.log("Created collection fire_drone_content");
}

const seedItems = [
  {
    page: "global",
    section: "metadata",
    locale: "cs",
    content: {
      title: "DOFEC",
      description: "DOFEC autonomous drone fire-fighting platform.",
    },
  },
  {
    page: "global",
    section: "nav",
    locale: "cs",
    content: {
      items: [
        { label: "About us", href: "/about-us" },
        { label: "Invest", href: "/invest" },
        { label: "Career", href: "#career" },
        { label: "Contact", href: "#contact" },
      ],
    },
  },
  {
    page: "global",
    section: "footer",
    locale: "cs",
    content: { copyright: "© 2026 DOFEC All rights reserved" },
  },
  {
    page: "global",
    section: "a11y",
    locale: "cs",
    content: {
      openMenu: "Otevřít menu",
      closeMenu: "Zavřít menu",
      mobileNavLabel: "Mobilní menu",
      logoLabel: "DOFEC",
    },
  },
  {
    page: "home",
    section: "hero",
    locale: "cs",
    content: {
      eyebrow: "Fire Fighting with Autonomous Drones",
      title: "Get eyes on the scene faster to keep your team and people safe",
      description:
        "An autonomous drone can help firefighters make informed decisions faster, deploy the right resources, and stay safe in real time.",
      primaryCta: "Demo video",
      secondaryCta: "Contact us",
      imageAlt: "DOFEC autonomous drone hero visual",
    },
  },
  {
    page: "home",
    section: "autonomous",
    locale: "cs",
    content: {
      title: "100% Autonomous",
      description:
        "With impressive capabilities, the drone can locate, track, and extinguish fires with minimal human input while continuously relaying thermal intelligence back to command units.",
      hotspots: [
        { id: "hotspot-one", label: "Rotor performance: 124kW" },
        { id: "hotspot-two", label: "Autonomy engine: area tracking" },
      ],
      calloutLabel: "Rotor performance: 124kW",
    },
  },
  {
    page: "home",
    section: "fire-image-split",
    locale: "cs",
    content: {
      description:
        "Fire fighting teams can formulate an effective strategy to extinguish the fire and save as many lives as possible. This feature has the potential to be highly beneficial for search and rescue missions, as well as providing real-time updates on the situation.",
      rightImageAlt: "DOFEC drone rendered on the side information card",
      slides: [
        {
          id: "fire-scene-1",
          imageAlt: "Fire response mission with flames and responders",
        },
        {
          id: "fire-scene-2",
          imageAlt: "Firefighting action at night",
        },
        {
          id: "fire-scene-3",
          imageAlt: "Thermal-guided intervention support",
        },
      ],
    },
  },
  {
    page: "home",
    section: "effective-locate",
    locale: "cs",
    content: {
      leftTitle: "Effective",
      leftDescription:
        "Krátký text o tom jak jsou effektivní, že prorazí sklo atd.",
      leftCta: "Play video",
      rightTitle: "Locate and intervention",
      rightDescription:
        "DOFEC™ is equipped with a launcher that can fire fire-extinguishing capsules during flight. In addition to its fire-fighting abilities, the drone also features onboard cameras. These cameras enable it to locate people and animals not visible to normal RGB cameras, which helps to gather crucial information about the disaster-struck area.",
    },
  },
  {
    page: "home",
    section: "quote-video",
    locale: "cs",
    content: {
      quote:
        "Důležitý citát,který je obsažen ve videu a vysvětluje buď misi značky nebo důležité USP dronu, případně celé služby, kterou nabízíme.",
      author: "Konrád Španěl | Ředitel ZHS PRAHA",
      thumbnailAlt: "Produktové video DOFEC – dočasný náhled",
      playLabel: "Přehrát představení produktu",
    },
  },
  {
    page: "home",
    section: "faster-integrated",
    locale: "cs",
    content: {
      title: "Faster is Better",
      accent: "(and safer)",
      description:
        "Text o tom, jak hasiči přijedou a dron jde hnedka do vzduchu jak rychle je připraven do akce, kolik to ušetří času a co všechno to přinese za benefity\n\nLorem ipsum dolor sit amet, consectetuer adipiscing elit. Nulla quis diam. Praesent id justo in neque elementum ultrices.",
      multiplier: "3×",
      ctaLabel: "Play video",
      rightTitle: "Integrated",
      rightDescription:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nulla quis diam. Praesent id justo in neque elementum ultrices.",
      integratedImageAlt: "Integrated device view",
    },
  },
  {
    page: "home",
    section: "timeline",
    locale: "cs",
    content: {
      title: "Before, during, and after the fire",
      description:
        "DOFEC supports prevention, active intervention, and post-fire monitoring with one continuous autonomous workflow.",
      cta: "Play video",
      backgroundAlt: "Forest fire response background",
      droneAlt: "DOFEC drone overlay",
    },
  },
  {
    page: "home",
    section: "timeline-quote",
    locale: "cs",
    content: {
      quote:
        "Důležitý citát,který je obsažen ve videu a vysvětluje buď misi značky nebo důležité USP dronu, případně celé služby, kterou nabízíme.",
      author: "Konrád Španěl | Ředitel ZHS PRAHA",
    },
  },
  {
    page: "home",
    section: "exploded-drone",
    locale: "cs",
    content: {
      imageAlt: "Exploded drone system with labeled components",
      annotations: [
        { id: "ann-1", label: "Advanced sensor suite" },
        { id: "ann-2", label: "Thermal imaging module" },
        { id: "ann-3", label: "Capsule release system" },
        { id: "ann-4", label: "Mission computer" },
        { id: "ann-5", label: "Autonomous flight control" },
        { id: "ann-6", label: "High-thrust rotor platform" },
      ],
    },
  },
  {
    page: "home",
    section: "stay-in-touch",
    locale: "cs",
    content: {
      title: "Stay in touch",
      description:
        "Are you interested in DOFEC? We can contact you online or visit your team and present DOFEC in action.",
      primaryCta: "Kontaktovat",
      secondaryCta: "Chci nabídku do mailu",
    },
  },
  {
    page: "about-us",
    section: "metadata",
    locale: "cs",
    content: {
      title: "About us | DOFEC",
      description:
        "Learn more about the DOFEC team, mission, and field experience.",
    },
  },
  {
    page: "about-us",
    section: "hero",
    locale: "cs",
    content: { title: "About us" },
  },
  {
    page: "about-us",
    section: "text-blocks",
    locale: "cs",
    content: {
      blocks: [
        {
          title: "Headline H1",
          body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis gravida nulla. Nulla quis diam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Maecenas libero. Nulla quis diam. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nulla quis diam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Fusce tellus.",
        },
        {
          title: "Headline H2",
          body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis gravida nulla. Nulla quis diam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Maecenas libero. Nulla quis diam. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nulla quis diam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Fusce tellus.",
        },
        {
          title: "Headline H3",
          body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis gravida nulla. Nulla quis diam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Maecenas libero. Nulla quis diam. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nulla quis diam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Fusce tellus.",
        },
        {
          title: "Headline H4",
          body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis gravida nulla. Nulla quis diam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Maecenas libero. Nulla quis diam. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nulla quis diam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Fusce tellus.",
        },
        {
          title: "Headline H5",
          body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis gravida nulla. Nulla quis diam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Maecenas libero. Nulla quis diam. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nulla quis diam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Fusce tellus.",
        },
        {
          title: "Small text",
          body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis gravida nulla. Nulla quis diam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Maecenas libero. Nulla quis diam. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nulla quis diam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Fusce tellus.",
        },
      ],
    },
  },
  {
    page: "about-us",
    section: "cta",
    locale: "cs",
    content: {
      title: "Call to actions",
      primaryLabel: "Call to Action",
      secondaryLabel: "Call to Action",
    },
  },
  {
    page: "about-us",
    section: "list",
    locale: "cs",
    content: {
      title: "Odrážky a seznam",
      columns: [
        [
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
        ],
        [
          "Consectetuer adipiscing elit",
          "Consectetuer adipiscing elit",
          "Consectetuer adipiscing elit",
          "Consectetuer adipiscing elit",
          "Consectetuer adipiscing elit",
        ],
        [
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
          "Lorem ipsum dolor sit amet",
        ],
        [
          "Consectetuer adipiscing elit",
          "Consectetuer adipiscing elit",
          "Consectetuer adipiscing elit",
          "Consectetuer adipiscing elit",
          "Consectetuer adipiscing elit",
        ],
      ],
    },
  },
  {
    page: "about-us",
    section: "quote",
    locale: "cs",
    content: {
      title: "Citace",
      quote:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc tincidunt ante vitae massa. Nunc auctor. Cras elementum. Duis condimentum augue id magna semper rutrum. Nullam dapibus fermentum ipsum. Etiam dui sem, fermentum vitae, sagittis id, malesuada in, quam.",
      author: "Konrád Španěl | Ředitel ZHS PRAHA",
    },
  },
  {
    page: "about-us",
    section: "exploded",
    locale: "cs",
    content: { title: "Obrázek" },
  },
  {
    page: "about-us",
    section: "gallery",
    locale: "cs",
    content: { title: "Galerie" },
  },
  {
    page: "about-us",
    section: "contact",
    locale: "cs",
    content: {
      title: "Stay in touch",
      description:
        "Are you interested in DOFEC™? We can contact you online and tell you more or come to you in person and present DOFEC™ in action.",
      primaryCta: "Kontaktovat",
      secondaryCta: "Chci nabídku do mailu",
    },
  },
  {
    page: "invest",
    section: "metadata",
    locale: "cs",
    content: {
      title: "Invest | DOFEC",
      description: "Download investor documents for DOFEC.",
    },
  },
  {
    page: "invest",
    section: "hero",
    locale: "cs",
    content: {
      title: "Invest",
      description: "Some description",
    },
  },
  {
    page: "invest",
    section: "documents",
    locale: "cs",
    content: {
      items: [
        {
          title: "Investor Deck",
          description:
            "Company overview, product summary, and market opportunity.",
          downloadLabel: "Download document",
          href: "/documents/investor-deck.pdf",
        },
        {
          title: "Financial Highlights",
          description:
            "Key financial metrics and annual performance highlights.",
          downloadLabel: "Download document",
          href: "/documents/financial-highlights.pdf",
        },
        {
          title: "Legal & Corporate",
          description: "Basic legal and corporate documents for due diligence.",
          downloadLabel: "Download document",
          href: "/documents/legal-corporate.pdf",
        },
      ],
    },
  },
];

async function seedContent(baseUrl, token) {
  for (const item of seedItems) {
    const filter = {
      _and: [
        { page: { _eq: item.page } },
        { section: { _eq: item.section } },
        { locale: { _eq: item.locale } },
      ],
    };

    const existing = await request(
      baseUrl,
      token,
      `/items/fire_drone_content?filter=${encodeURIComponent(JSON.stringify(filter))}&limit=1`,
    );

    if (existing.data?.length) {
      await request(
        baseUrl,
        token,
        `/items/fire_drone_content/${existing.data[0].id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ content: item.content }),
        },
      );
      console.log(`Updated ${item.page}/${item.section} (${item.locale})`);
      continue;
    }

    await request(baseUrl, token, "/items/fire_drone_content", {
      method: "POST",
      body: JSON.stringify(item),
    });
    console.log(`Created ${item.page}/${item.section} (${item.locale})`);
  }
}

async function main() {
  const { DIRECTUS_URL, DIRECTUS_ADMIN_EMAIL, DIRECTUS_ADMIN_PASSWORD } =
    loadEnv();

  if (!DIRECTUS_ADMIN_EMAIL || !DIRECTUS_ADMIN_PASSWORD) {
    throw new Error("Missing Directus credentials");
  }

  const baseUrl = getBaseUrl(DIRECTUS_URL);
  const token = await login(baseUrl, DIRECTUS_ADMIN_EMAIL, DIRECTUS_ADMIN_PASSWORD);

  await ensureCollection(baseUrl, token);
  await seedContent(baseUrl, token);
  console.log("Directus content setup complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
