const MODULE_ID = "living-shops";

const SHOP_TYPES = {
  blacksmith: {
    label: "Forgeron",
    actorName: "LS - Forgeron",
    tableName: "LS - Stock - Forgeron",
    min: 18,
    max: 42,
    items: [
      { name: "Dague", weight: 80, quantity: "1d4" },
      { name: "Marteau", weight: 70, quantity: "1d6" },
      { name: "Clous de forge", weight: 65, quantity: "2d20" },
      { name: "Chaîne courte", weight: 45, quantity: "1d4" },
      { name: "Bouclier cabossé", weight: 30, quantity: "1d2" },
      { name: "Épée longue entretenue", weight: 15, quantity: "1" },
      { name: "Huile pour lame", weight: 55, quantity: "1d6" },
      { name: "Pierre à aiguiser", weight: 60, quantity: "1d8" }
    ]
  },
  innkeeper: {
    label: "Aubergiste",
    actorName: "LS - Aubergiste",
    tableName: "LS - Stock - Aubergiste",
    min: 28,
    max: 75,
    items: [
      { name: "Pain noir", weight: 100, quantity: "2d12" },
      { name: "Soupe chaude", weight: 90, quantity: "2d8" },
      { name: "Ragoût du jour", weight: 75, quantity: "1d10" },
      { name: "Bière blonde", weight: 95, quantity: "3d12" },
      { name: "Bière brune", weight: 70, quantity: "2d12" },
      { name: "Cidre de ferme", weight: 55, quantity: "2d10" },
      { name: "Vin ordinaire", weight: 40, quantity: "1d8" },
      { name: "Hydromel doux", weight: 20, quantity: "1d6" },
      { name: "Chambre commune", weight: 60, quantity: "1d6" },
      { name: "Chambre privée", weight: 25, quantity: "1d3" },
      { name: "Repas de fête", weight: 6, quantity: "1d2" }
    ]
  },
  alchemist: {
    label: "Alchimiste",
    actorName: "LS - Alchimiste",
    tableName: "LS - Stock - Alchimiste",
    min: 12,
    max: 32,
    items: [
      { name: "Fiole vide", weight: 90, quantity: "2d10" },
      { name: "Sels odorants", weight: 50, quantity: "1d6" },
      { name: "Baume apaisant", weight: 35, quantity: "1d4" },
      { name: "Tisane tonique", weight: 65, quantity: "1d8" },
      { name: "Poudre coagulante", weight: 20, quantity: "1d3" },
      { name: "Potion de soins mineure maison", weight: 10, quantity: "1d2" }
    ]
  },
  general: {
    label: "Magasin général",
    actorName: "LS - Magasin général",
    tableName: "LS - Stock - Magasin général",
    min: 25,
    max: 65,
    items: [
      { name: "Corde de chanvre", weight: 70, quantity: "1d6" },
      { name: "Torche", weight: 90, quantity: "3d10" },
      { name: "Bougie", weight: 80, quantity: "3d12" },
      { name: "Savon rustique", weight: 65, quantity: "2d8" },
      { name: "Couverture usée", weight: 45, quantity: "1d6" },
      { name: "Gamelle en étain", weight: 45, quantity: "1d6" },
      { name: "Sac de toile", weight: 75, quantity: "2d8" },
      { name: "Aiguille et fil", weight: 55, quantity: "1d10" },
      { name: "Carte locale approximative", weight: 12, quantity: "1d3" }
    ]
  }
};

function log(...args) { console.log(`Living Shops |`, ...args); }
function notify(message) { ui.notifications?.info(`Living Shops | ${message}`); }
function warn(message) { ui.notifications?.warn(`Living Shops | ${message}`); }

function coinValue(gp = 0, sp = 0, cp = 0) {
  return { value: gp + (sp / 10) + (cp / 100), denomination: "gp" };
}

const CUSTOM_ITEMS = {
  "Pain noir": { type: "consumable", price: coinValue(0, 0, 2), weight: 0.5, desc: "Un pain dense, sombre et nourrissant, courant dans les villages pauvres." },
  "Soupe chaude": { type: "consumable", price: coinValue(0, 0, 4), weight: 0, desc: "Un bol de soupe épaisse. Effet narratif : réconforte après une journée froide." },
  "Ragoût du jour": { type: "consumable", price: coinValue(0, 1, 0), weight: 0, desc: "Un repas simple mais consistant servi en auberge." },
  "Bière blonde": { type: "consumable", price: coinValue(0, 0, 4), weight: 0, desc: "Une chope de bière légère et populaire." },
  "Bière brune": { type: "consumable", price: coinValue(0, 0, 6), weight: 0, desc: "Une bière brune plus forte, au goût malté." },
  "Cidre de ferme": { type: "consumable", price: coinValue(0, 0, 5), weight: 0, desc: "Un cidre rustique, légèrement trouble." },
  "Vin ordinaire": { type: "consumable", price: coinValue(0, 2, 0), weight: 0, desc: "Un vin de table sans prétention." },
  "Hydromel doux": { type: "consumable", price: coinValue(0, 5, 0), weight: 0, desc: "Une boisson sucrée à base de miel, appréciée des voyageurs." },
  "Repas de fête": { type: "consumable", price: coinValue(1, 0, 0), weight: 0, desc: "Un repas généreux. Effet proposé : octroie 2 PV temporaires jusqu'au prochain repos court, à appliquer manuellement pour l'instant." },
  "Chambre commune": { type: "loot", price: coinValue(0, 2, 0), weight: 0, desc: "Une nuit dans une salle commune d'auberge." },
  "Chambre privée": { type: "loot", price: coinValue(0, 8, 0), weight: 0, desc: "Une nuit dans une chambre simple mais fermée." },
  "Clous de forge": { type: "loot", price: coinValue(0, 0, 1), weight: 0.01, desc: "Clous robustes utilisés en menuiserie, ferronnerie ou réparation de fortune." },
  "Chaîne courte": { type: "loot", price: coinValue(1, 0, 0), weight: 5, desc: "Une courte chaîne de fer d'environ un mètre." },
  "Bouclier cabossé": { type: "equipment", price: coinValue(5, 0, 0), weight: 6, desc: "Un bouclier usé mais encore utilisable." },
  "Épée longue entretenue": { type: "weapon", price: coinValue(15, 0, 0), weight: 3, desc: "Une épée longue propre, affûtée et bien entretenue." },
  "Huile pour lame": { type: "loot", price: coinValue(0, 1, 0), weight: 0.1, desc: "Petite fiole d'huile permettant d'entretenir les armes métalliques." },
  "Pierre à aiguiser": { type: "loot", price: coinValue(0, 0, 2), weight: 1, desc: "Pierre utilisée pour entretenir les lames." },
  "Fiole vide": { type: "loot", price: coinValue(0, 1, 0), weight: 0.1, desc: "Une petite fiole de verre bouchée." },
  "Sels odorants": { type: "consumable", price: coinValue(0, 8, 0), weight: 0.1, desc: "Effet proposé : peut aider à réveiller une créature consciente mais sonnée, à la discrétion du MJ." },
  "Baume apaisant": { type: "consumable", price: coinValue(1, 5, 0), weight: 0.1, desc: "Un baume contre irritations et douleurs légères." },
  "Tisane tonique": { type: "consumable", price: coinValue(0, 3, 0), weight: 0.1, desc: "Effet proposé : donne un léger regain d'énergie narratif pendant une heure." },
  "Poudre coagulante": { type: "consumable", price: coinValue(3, 0, 0), weight: 0.1, desc: "Effet proposé : stabiliser une créature mourante avec une action et un test de Médecine DD 10." },
  "Potion de soins mineure maison": { type: "consumable", price: coinValue(25, 0, 0), weight: 0.5, desc: "Potion artisanale instable. Effet proposé : soigne 1d4+1 PV." },
  "Corde de chanvre": { type: "loot", price: coinValue(1, 0, 0), weight: 10, desc: "Corde robuste d'environ 15 mètres." },
  "Torche": { type: "consumable", price: coinValue(0, 0, 1), weight: 1, desc: "Une torche simple." },
  "Bougie": { type: "consumable", price: coinValue(0, 0, 1), weight: 0, desc: "Une bougie de suif." },
  "Savon rustique": { type: "loot", price: coinValue(0, 0, 2), weight: 0.1, desc: "Un pain de savon simple, utile et rarement héroïque." },
  "Couverture usée": { type: "loot", price: coinValue(0, 5, 0), weight: 3, desc: "Une couverture ancienne mais chaude." },
  "Gamelle en étain": { type: "loot", price: coinValue(0, 2, 0), weight: 1, desc: "Une gamelle de voyage cabossée." },
  "Sac de toile": { type: "loot", price: coinValue(0, 1, 0), weight: 0.5, desc: "Un sac simple pour transporter de petites marchandises." },
  "Aiguille et fil": { type: "loot", price: coinValue(0, 0, 5), weight: 0, desc: "De quoi réparer vêtements, sacs ou tentes." },
  "Carte locale approximative": { type: "loot", price: coinValue(2, 0, 0), weight: 0, desc: "Une carte locale partiellement exacte. Les erreurs sont possibles." }
};

function itemData(name, quantity = 1) {
  const base = CUSTOM_ITEMS[name] ?? { type: "loot", price: coinValue(0, 1, 0), weight: 0, desc: "Objet de boutique généré par Living Shops." };
  return {
    name,
    type: base.type,
    img: "icons/commodities/materials/bundle-cloth-tan.webp",
    system: {
      quantity,
      weight: base.weight ?? 0,
      price: base.price ?? coinValue(0, 1, 0),
      description: { value: `<p>${base.desc}</p>`, chat: "", unidentified: "" },
      identified: true
    }
  };
}

async function findOrCreateFolder(name, type) {
  let folder = game.folders.find(f => f.name === name && f.type === type);
  if (!folder) folder = await Folder.create({ name, type, sorting: "a" });
  return folder;
}

async function ensureMerchantActors() {
  const folder = await findOrCreateFolder("Living Shops - Marchands", "Actor");
  const created = [];
  for (const [type, cfg] of Object.entries(SHOP_TYPES)) {
    let actor = game.actors.getName(cfg.actorName);
    if (!actor) {
      actor = await Actor.create({ name: cfg.actorName, type: "npc", folder: folder.id });
      created.push(actor.name);
    }
    await actor.setFlag(MODULE_ID, "shopType", type);
    await actor.setFlag(MODULE_ID, "tableName", cfg.tableName);
  }
  notify(created.length ? `Marchands créés : ${created.join(", ")}` : "Marchands déjà présents.");
}

async function ensureTables() {
  const folder = await findOrCreateFolder("Living Shops - Tables", "RollTable");
  for (const [type, cfg] of Object.entries(SHOP_TYPES)) {
    let table = game.tables.getName(cfg.tableName);
    const results = [];
    let rangeStart = 1;
    for (const entry of cfg.items) {
      const weight = Number(entry.weight ?? 1);
      results.push({
        type: CONST.TABLE_RESULT_TYPES.TEXT,
        text: entry.name,
        weight,
        range: [rangeStart, rangeStart + weight - 1],
        flags: { [MODULE_ID]: { quantity: entry.quantity ?? "1" } }
      });
      rangeStart += weight;
    }
    const formula = `1d${Math.max(1, rangeStart - 1)}`;
    if (!table) {
      table = await RollTable.create({ name: cfg.tableName, folder: folder.id, formula, results });
    } else {
      await table.update({ formula });
      await table.deleteEmbeddedDocuments("TableResult", table.results.map(r => r.id));
      await table.createEmbeddedDocuments("TableResult", results);
    }
    await table.setFlag(MODULE_ID, "shopType", type);
    await table.setFlag(MODULE_ID, "stockMin", cfg.min);
    await table.setFlag(MODULE_ID, "stockMax", cfg.max);
  }
  notify("Tables Living Shops créées ou mises à jour.");
}

function rollFormula(formula) {
  try {
    return new Roll(String(formula)).evaluateSync({ strict: false }).total;
  } catch (_) {
    return Number(formula) || 1;
  }
}

function weightedPick(results) {
  const total = results.reduce((sum, r) => sum + Math.max(1, Number(r.weight ?? 1)), 0);
  let roll = Math.random() * total;
  for (const r of results) {
    roll -= Math.max(1, Number(r.weight ?? 1));
    if (roll <= 0) return r;
  }
  return results.at(-1);
}

async function refreshMerchant(actor) {
  if (!actor) return warn("Aucun acteur fourni.");
  const shopType = actor.getFlag(MODULE_ID, "shopType");
  const cfg = SHOP_TYPES[shopType];
  if (!cfg) return warn(`${actor.name} n'a pas de type Living Shops valide.`);
  const table = game.tables.getName(cfg.tableName);
  if (!table) return warn(`Table introuvable : ${cfg.tableName}`);

  const min = table.getFlag(MODULE_ID, "stockMin") ?? cfg.min;
  const max = table.getFlag(MODULE_ID, "stockMax") ?? cfg.max;
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const results = Array.from(table.results);
  const items = [];

  for (let i = 0; i < count; i++) {
    const picked = weightedPick(results);
    const qtyFormula = picked.getFlag(MODULE_ID, "quantity") ?? "1";
    items.push(itemData(picked.text, Math.max(1, Math.floor(rollFormula(qtyFormula)))));
  }

  const merged = new Map();
  for (const item of items) {
    const key = `${item.name}|${item.type}`;
    if (!merged.has(key)) merged.set(key, item);
    else merged.get(key).system.quantity += item.system.quantity;
  }

  await actor.deleteEmbeddedDocuments("Item", actor.items.map(i => i.id));
  await actor.createEmbeddedDocuments("Item", Array.from(merged.values()));
  await actor.setFlag(MODULE_ID, "lastRefresh", new Date().toISOString());
  return actor.items.size;
}

async function refreshAllMerchants() {
  const merchants = game.actors.filter(a => a.getFlag(MODULE_ID, "shopType"));
  const lines = [];
  for (const actor of merchants) {
    try {
      await refreshMerchant(actor);
      lines.push(`✅ ${actor.name}`);
    } catch (err) {
      console.error(err);
      lines.push(`❌ ${actor.name} : ${err.message}`);
    }
  }
  ChatMessage.create({ content: `<h2>Living Shops — Refresh</h2><ol>${lines.map(l => `<li>${l}</li>`).join("")}</ol>` });
}

async function setupWorld() {
  await ensureMerchantActors();
  await ensureTables();
  await refreshAllMerchants();
}

class LivingShopsControl extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "living-shops-control",
      title: "Living Shops",
      template: `modules/${MODULE_ID}/templates/control.hbs`,
      width: 520,
      height: "auto"
    });
  }
  async getData() {
    return { merchants: game.actors.filter(a => a.getFlag(MODULE_ID, "shopType")).map(a => ({ name: a.name, type: a.getFlag(MODULE_ID, "shopType") })) };
  }
  activateListeners(html) {
    super.activateListeners(html);
    html.find("[data-action='setup']").on("click", () => setupWorld());
    html.find("[data-action='refresh']").on("click", () => refreshAllMerchants());
  }
}

Hooks.once("init", () => {
  log("Initializing");
  game.settings.registerMenu(MODULE_ID, "controlPanel", {
    name: "Living Shops — Panneau de contrôle",
    label: "Ouvrir",
    hint: "Créer les marchands, tables et régénérer les stocks.",
    icon: "fas fa-store",
    type: LivingShopsControl,
    restricted: true
  });
});

Hooks.once("ready", () => {
  game.livingShops = {
    setupWorld,
    ensureMerchantActors,
    ensureTables,
    refreshMerchant,
    refreshAllMerchants,
    SHOP_TYPES
  };
  notify("Module chargé. Ouvre Settings > Configure Settings > Module Settings > Living Shops.");
});
