/* ===== ÉTAT DES FILTRES ===== */
const F = {
  carburant: null, boite: null, portes: '5', couleur: null,
  options: new Set(),
  premiere: null, carnet: null, garantie: null, accident: null
};

const ANNEE_COURANTE = 2026;
const FOURCHETTE     = 0.12;
let selectedModele   = null;
let modeAPI          = false;

/* ===== MODIFICATEURS ===== */
const CARB_MOD = {
  'Essence': 1.000, 'Diesel': 0.940, 'Hybride': 1.060,
  'PHEV': 1.040, 'Électrique': 0.880, 'GPL': 0.850
};
const BOITE_MOD = { 'Manuelle': 1.000, 'Automatique': 1.050, 'Séquentielle': 1.030 };
const COULEUR_MOD = {
  'blanc': 1.010, 'noir': 1.020, 'gris': 1.005, 'argent': 1.000,
  'bleu': 0.975, 'rouge': 0.960, 'vert': 0.930, 'orange': 0.910,
  'jaune': 0.900, 'beige': 0.950, 'marron': 0.920, 'violet': 0.890
};
const OPTION_PRIX = {
  'gps': 400, 'cuir': 800, 'toit': 700, 'camera': 300, 'chauffants': 350,
  'parking': 300, 'hiver': 200, 'attelage': 400, 'jantes': 350, 'acc': 400,
  'lane': 250, 'keyless': 300
};

/* ===== BASE DE DONNÉES LOCALE (fallback + enrichissement) =====
   Format : { pN: prix_neuf, dA: dep_ann, kM: km_moy, cat: catégorie, carb: [carburants] }
*/
const VEHICULES = {
"Alfa Romeo": {
  "Giulia":         {pN:44900,dA:.15,kM:15000,cat:'Berline',  carb:['Essence','Diesel']},
  "Giulietta":      {pN:28000,dA:.15,kM:14000,cat:'Berline',  carb:['Essence','Diesel']},
  "Stelvio":        {pN:52000,dA:.14,kM:16000,cat:'SUV',      carb:['Essence','Diesel']},
  "Tonale":         {pN:42000,dA:.13,kM:15000,cat:'SUV',      carb:['Essence','Hybride','PHEV']}
},
"Audi": {
  "A1":             {pN:28000,dA:.13,kM:14000,cat:'Citadine', carb:['Essence']},
  "A3":             {pN:37000,dA:.12,kM:15000,cat:'Berline',  carb:['Essence','Diesel','Hybride','PHEV']},
  "A4":             {pN:48000,dA:.12,kM:15000,cat:'Berline',  carb:['Essence','Diesel']},
  "A4 Avant":       {pN:51000,dA:.11,kM:15000,cat:'Break',    carb:['Essence','Diesel']},
  "A5":             {pN:52000,dA:.12,kM:15000,cat:'Coupé',    carb:['Essence','Diesel']},
  "A6":             {pN:62000,dA:.11,kM:16000,cat:'Berline',  carb:['Essence','Diesel','Hybride','PHEV']},
  "A6 Avant":       {pN:65000,dA:.11,kM:16000,cat:'Break',    carb:['Diesel','Hybride']},
  "Q2":             {pN:32000,dA:.13,kM:14000,cat:'SUV',      carb:['Essence','Diesel']},
  "Q3":             {pN:42000,dA:.12,kM:15000,cat:'SUV',      carb:['Essence','Diesel']},
  "Q4 e-tron":      {pN:55000,dA:.17,kM:14000,cat:'SUV',      carb:['Électrique']},
  "Q5":             {pN:58000,dA:.11,kM:16000,cat:'SUV',      carb:['Essence','Diesel','Hybride','PHEV']},
  "Q7":             {pN:82000,dA:.12,kM:17000,cat:'SUV',      carb:['Diesel','Hybride']},
  "TT":             {pN:55000,dA:.14,kM:13000,cat:'Coupé',    carb:['Essence']},
  "e-tron GT":      {pN:110000,dA:.18,kM:14000,cat:'Berline', carb:['Électrique']}
},
"BMW": {
  "Serie 1":        {pN:35000,dA:.14,kM:15000,cat:'Citadine', carb:['Essence','Diesel']},
  "Serie 2":        {pN:40000,dA:.13,kM:14000,cat:'Coupé',    carb:['Essence','Diesel']},
  "Serie 2 Gran Coupé":{pN:38000,dA:.13,kM:14000,cat:'Berline',carb:['Essence','Diesel']},
  "Serie 3":        {pN:48000,dA:.13,kM:15000,cat:'Berline',  carb:['Essence','Diesel','Hybride','PHEV']},
  "Serie 3 Touring":{pN:52000,dA:.12,kM:16000,cat:'Break',    carb:['Essence','Diesel','Hybride']},
  "Serie 4":        {pN:58000,dA:.13,kM:15000,cat:'Coupé',    carb:['Essence','Diesel']},
  "Serie 5":        {pN:62000,dA:.13,kM:16000,cat:'Berline',  carb:['Essence','Diesel','Hybride','PHEV']},
  "X1":             {pN:45000,dA:.13,kM:15000,cat:'SUV',      carb:['Essence','Diesel','PHEV']},
  "X2":             {pN:42000,dA:.13,kM:14000,cat:'SUV',      carb:['Essence','Diesel']},
  "X3":             {pN:58000,dA:.12,kM:16000,cat:'SUV',      carb:['Essence','Diesel','Hybride','PHEV']},
  "X5":             {pN:88000,dA:.13,kM:17000,cat:'SUV',      carb:['Diesel','Hybride','PHEV']},
  "iX3":            {pN:70000,dA:.18,kM:14000,cat:'SUV',      carb:['Électrique']},
  "Z4":             {pN:65000,dA:.14,kM:13000,cat:'Cabriolet',carb:['Essence']}
},
"Citroën": {
  "C1":             {pN:12500,dA:.14,kM:12000,cat:'Citadine', carb:['Essence']},
  "C3":             {pN:17000,dA:.13,kM:14000,cat:'Citadine', carb:['Essence','Diesel']},
  "C3 Aircross":    {pN:22000,dA:.13,kM:15000,cat:'SUV',      carb:['Essence','Diesel']},
  "C4":             {pN:25000,dA:.13,kM:15000,cat:'Berline',  carb:['Essence','Diesel','Électrique']},
  "C5 Aircross":    {pN:32000,dA:.13,kM:16000,cat:'SUV',      carb:['Essence','Diesel','Hybride','PHEV']},
  "C5 X":           {pN:38000,dA:.12,kM:16000,cat:'Berline',  carb:['Hybride','PHEV']},
  "Berlingo":       {pN:27000,dA:.13,kM:17000,cat:'Monospace',carb:['Essence','Diesel']},
  "ë-C4":           {pN:38000,dA:.16,kM:13000,cat:'Berline',  carb:['Électrique']}
},
"Dacia": {
  "Sandero":        {pN:13000,dA:.11,kM:15000,cat:'Citadine', carb:['Essence','GPL']},
  "Duster":         {pN:18000,dA:.11,kM:16000,cat:'SUV',      carb:['Essence','Diesel','GPL']},
  "Logan":          {pN:11500,dA:.12,kM:14000,cat:'Berline',  carb:['Essence','GPL']},
  "Spring":         {pN:22000,dA:.15,kM:10000,cat:'Citadine', carb:['Électrique']},
  "Jogger":         {pN:20000,dA:.11,kM:15000,cat:'Monospace',carb:['Essence','GPL']}
},
"Fiat": {
  "500":            {pN:16000,dA:.14,kM:12000,cat:'Citadine', carb:['Essence']},
  "500e":           {pN:34000,dA:.17,kM:11000,cat:'Citadine', carb:['Électrique']},
  "500X":           {pN:25000,dA:.14,kM:14000,cat:'SUV',      carb:['Essence','Diesel']},
  "Panda":          {pN:13000,dA:.13,kM:13000,cat:'Citadine', carb:['Essence','GPL']},
  "Tipo":           {pN:20000,dA:.13,kM:15000,cat:'Berline',  carb:['Essence','Diesel']},
  "Tipo SW":        {pN:22000,dA:.12,kM:15000,cat:'Break',    carb:['Essence','Diesel']}
},
"Ford": {
  "Fiesta":         {pN:19000,dA:.13,kM:14000,cat:'Citadine', carb:['Essence','Diesel']},
  "Focus":          {pN:26000,dA:.12,kM:15000,cat:'Berline',  carb:['Essence','Diesel']},
  "Puma":           {pN:27000,dA:.12,kM:15000,cat:'SUV',      carb:['Essence','Hybride']},
  "Kuga":           {pN:35000,dA:.12,kM:16000,cat:'SUV',      carb:['Essence','Diesel','Hybride','PHEV']},
  "Mustang Mach-E": {pN:55000,dA:.17,kM:14000,cat:'SUV',      carb:['Électrique']},
  "Explorer":       {pN:58000,dA:.14,kM:17000,cat:'SUV',      carb:['PHEV']}
},
"Honda": {
  "Jazz":           {pN:24000,dA:.11,kM:13000,cat:'Citadine', carb:['Hybride']},
  "Civic":          {pN:32000,dA:.11,kM:15000,cat:'Berline',  carb:['Essence','Hybride']},
  "HR-V":           {pN:28000,dA:.12,kM:14000,cat:'SUV',      carb:['Hybride']},
  "CR-V":           {pN:40000,dA:.11,kM:16000,cat:'SUV',      carb:['Essence','Hybride']},
  "ZR-V":           {pN:38000,dA:.11,kM:15000,cat:'SUV',      carb:['Hybride']},
  "e":              {pN:36000,dA:.18,kM:11000,cat:'Citadine', carb:['Électrique']}
},
"Hyundai": {
  "i10":            {pN:14000,dA:.13,kM:12000,cat:'Citadine', carb:['Essence']},
  "i20":            {pN:19000,dA:.12,kM:13000,cat:'Citadine', carb:['Essence']},
  "i30":            {pN:25000,dA:.12,kM:14000,cat:'Berline',  carb:['Essence','Diesel']},
  "Tucson":         {pN:35000,dA:.11,kM:15000,cat:'SUV',      carb:['Essence','Diesel','Hybride','PHEV']},
  "Kona":           {pN:26000,dA:.12,kM:14000,cat:'SUV',      carb:['Essence','Hybride']},
  "Kona Electric":  {pN:40000,dA:.16,kM:12000,cat:'SUV',      carb:['Électrique']},
  "Santa Fe":       {pN:48000,dA:.12,kM:17000,cat:'SUV',      carb:['Diesel','Hybride','PHEV']},
  "IONIQ 5":        {pN:48000,dA:.16,kM:13000,cat:'SUV',      carb:['Électrique']},
  "IONIQ 6":        {pN:52000,dA:.16,kM:13000,cat:'Berline',  carb:['Électrique']}
},
"Jeep": {
  "Renegade":       {pN:26000,dA:.13,kM:14000,cat:'SUV',      carb:['Essence','Diesel','PHEV']},
  "Compass":        {pN:32000,dA:.13,kM:15000,cat:'SUV',      carb:['Essence','Diesel','PHEV']},
  "Avenger":        {pN:29000,dA:.13,kM:14000,cat:'SUV',      carb:['Essence','Électrique']},
  "Cherokee":       {pN:42000,dA:.13,kM:16000,cat:'SUV',      carb:['Diesel']}
},
"Kia": {
  "Picanto":        {pN:14000,dA:.13,kM:11000,cat:'Citadine', carb:['Essence']},
  "Rio":            {pN:18000,dA:.12,kM:13000,cat:'Citadine', carb:['Essence']},
  "Ceed":           {pN:26000,dA:.12,kM:14000,cat:'Berline',  carb:['Essence','Diesel']},
  "Sportage":       {pN:34000,dA:.11,kM:15000,cat:'SUV',      carb:['Essence','Diesel','Hybride','PHEV']},
  "Sorento":        {pN:48000,dA:.11,kM:17000,cat:'SUV',      carb:['Diesel','Hybride','PHEV']},
  "Niro":           {pN:32000,dA:.12,kM:14000,cat:'SUV',      carb:['Hybride','PHEV','Électrique']},
  "EV6":            {pN:52000,dA:.16,kM:13000,cat:'SUV',      carb:['Électrique']},
  "EV9":            {pN:78000,dA:.16,kM:14000,cat:'SUV',      carb:['Électrique']}
},
"Land Rover": {
  "Discovery Sport":{pN:52000,dA:.14,kM:16000,cat:'SUV',      carb:['Diesel','PHEV']},
  "Range Rover Evoque":{pN:55000,dA:.14,kM:15000,cat:'SUV',   carb:['Diesel','PHEV']},
  "Range Rover Sport":{pN:95000,dA:.14,kM:17000,cat:'SUV',    carb:['Diesel','Hybride','PHEV']},
  "Defender":       {pN:75000,dA:.14,kM:17000,cat:'SUV',      carb:['Diesel','Hybride','PHEV']}
},
"Mazda": {
  "2":              {pN:17000,dA:.12,kM:13000,cat:'Citadine', carb:['Essence']},
  "3":              {pN:26000,dA:.11,kM:14000,cat:'Berline',  carb:['Essence','Hybride']},
  "6":              {pN:35000,dA:.11,kM:15000,cat:'Berline',  carb:['Essence','Diesel']},
  "CX-30":          {pN:28000,dA:.11,kM:14000,cat:'SUV',      carb:['Essence','Hybride']},
  "CX-5":           {pN:35000,dA:.10,kM:15000,cat:'SUV',      carb:['Essence','Diesel']},
  "CX-60":          {pN:44000,dA:.11,kM:15000,cat:'SUV',      carb:['Essence','Diesel','PHEV']},
  "MX-5":           {pN:33000,dA:.11,kM:12000,cat:'Cabriolet',carb:['Essence']}
},
"Mercedes": {
  "Classe A":       {pN:38000,dA:.13,kM:15000,cat:'Citadine', carb:['Essence','Diesel']},
  "Classe B":       {pN:35000,dA:.12,kM:14000,cat:'Monospace',carb:['Essence','Diesel']},
  "Classe C":       {pN:52000,dA:.12,kM:15000,cat:'Berline',  carb:['Essence','Diesel','Hybride','PHEV']},
  "Classe C Break": {pN:55000,dA:.11,kM:15000,cat:'Break',    carb:['Essence','Diesel','Hybride']},
  "Classe E":       {pN:68000,dA:.12,kM:16000,cat:'Berline',  carb:['Diesel','Hybride','PHEV']},
  "GLA":            {pN:44000,dA:.13,kM:15000,cat:'SUV',      carb:['Essence','Diesel']},
  "GLB":            {pN:48000,dA:.12,kM:15000,cat:'SUV',      carb:['Essence','Diesel']},
  "GLC":            {pN:62000,dA:.12,kM:16000,cat:'SUV',      carb:['Diesel','Hybride','PHEV']},
  "GLE":            {pN:88000,dA:.13,kM:17000,cat:'SUV',      carb:['Diesel','Hybride','PHEV']},
  "EQA":            {pN:52000,dA:.17,kM:13000,cat:'SUV',      carb:['Électrique']},
  "EQB":            {pN:58000,dA:.17,kM:14000,cat:'SUV',      carb:['Électrique']},
  "EQC":            {pN:78000,dA:.18,kM:14000,cat:'SUV',      carb:['Électrique']}
},
"Mini": {
  "Cooper":         {pN:28000,dA:.14,kM:13000,cat:'Citadine', carb:['Essence','Diesel']},
  "Cooper Electric":{pN:38000,dA:.17,kM:11000,cat:'Citadine', carb:['Électrique']},
  "Clubman":        {pN:38000,dA:.13,kM:13000,cat:'Break',    carb:['Essence','Diesel']},
  "Countryman":     {pN:38000,dA:.13,kM:14000,cat:'SUV',      carb:['Essence','Diesel','PHEV']},
  "Cabrio":         {pN:35000,dA:.14,kM:12000,cat:'Cabriolet',carb:['Essence']}
},
"Mitsubishi": {
  "ASX":            {pN:24000,dA:.12,kM:14000,cat:'SUV',      carb:['Essence']},
  "Eclipse Cross":  {pN:32000,dA:.12,kM:15000,cat:'SUV',      carb:['Essence','PHEV']},
  "Outlander":      {pN:38000,dA:.12,kM:16000,cat:'SUV',      carb:['Diesel','PHEV']}
},
"Nissan": {
  "Micra":          {pN:16000,dA:.13,kM:12000,cat:'Citadine', carb:['Essence']},
  "Juke":           {pN:24000,dA:.12,kM:14000,cat:'SUV',      carb:['Essence','Hybride']},
  "Qashqai":        {pN:32000,dA:.11,kM:15000,cat:'SUV',      carb:['Essence','Hybride']},
  "X-Trail":        {pN:42000,dA:.11,kM:16000,cat:'SUV',      carb:['Essence','Hybride']},
  "Leaf":           {pN:34000,dA:.18,kM:12000,cat:'Citadine', carb:['Électrique']},
  "Ariya":          {pN:55000,dA:.17,kM:14000,cat:'SUV',      carb:['Électrique']},
  "Townstar":       {pN:26000,dA:.12,kM:16000,cat:'Monospace',carb:['Essence','Électrique']}
},
"Opel": {
  "Corsa":          {pN:18000,dA:.12,kM:13000,cat:'Citadine', carb:['Essence','Diesel','Électrique']},
  "Mokka":          {pN:25000,dA:.12,kM:14000,cat:'SUV',      carb:['Essence','Diesel','Électrique']},
  "Astra":          {pN:26000,dA:.12,kM:14000,cat:'Berline',  carb:['Essence','Diesel','Hybride','PHEV']},
  "Astra Sports Tourer":{pN:28000,dA:.11,kM:15000,cat:'Break',carb:['Essence','Diesel','Hybride','PHEV']},
  "Crossland":      {pN:22000,dA:.12,kM:14000,cat:'SUV',      carb:['Essence','Diesel']},
  "Grandland":      {pN:35000,dA:.11,kM:15000,cat:'SUV',      carb:['Essence','Diesel','Hybride','PHEV']},
  "Zafira Life":    {pN:38000,dA:.11,kM:17000,cat:'Monospace',carb:['Diesel']}
},
"Peugeot": {
  "108":            {pN:13000,dA:.14,kM:11000,cat:'Citadine', carb:['Essence']},
  "208":            {pN:20000,dA:.13,kM:15000,cat:'Citadine', carb:['Essence','Diesel','Électrique']},
  "2008":           {pN:25000,dA:.12,kM:14000,cat:'SUV',      carb:['Essence','Diesel','Électrique']},
  "308":            {pN:26000,dA:.12,kM:15000,cat:'Berline',  carb:['Essence','Diesel','Hybride','PHEV']},
  "3008":           {pN:34000,dA:.13,kM:16000,cat:'SUV',      carb:['Essence','Diesel','Hybride','PHEV']},
  "408":            {pN:40000,dA:.12,kM:15000,cat:'Berline',  carb:['Hybride','PHEV']},
  "5008":           {pN:38000,dA:.12,kM:16000,cat:'SUV',      carb:['Essence','Diesel','Hybride']},
  "508":            {pN:45000,dA:.11,kM:16000,cat:'Berline',  carb:['Essence','Diesel','Hybride','PHEV']},
  "Rifter":         {pN:28000,dA:.12,kM:16000,cat:'Monospace',carb:['Essence','Diesel']}
},
"Porsche": {
  "911":            {pN:130000,dA:.10,kM:13000,cat:'Coupé',   carb:['Essence']},
  "718 Cayman":     {pN:68000,dA:.12,kM:12000,cat:'Coupé',    carb:['Essence']},
  "718 Boxster":    {pN:68000,dA:.12,kM:12000,cat:'Cabriolet',carb:['Essence']},
  "Macan":          {pN:75000,dA:.13,kM:16000,cat:'SUV',      carb:['Essence','Diesel','Électrique']},
  "Cayenne":        {pN:95000,dA:.12,kM:17000,cat:'SUV',      carb:['Essence','Hybride','PHEV']},
  "Panamera":       {pN:110000,dA:.13,kM:16000,cat:'Berline', carb:['Essence','Hybride','PHEV']},
  "Taycan":         {pN:110000,dA:.17,kM:14000,cat:'Berline', carb:['Électrique']}
},
"Renault": {
  "Twingo":         {pN:15000,dA:.14,kM:12000,cat:'Citadine', carb:['Essence']},
  "Clio":           {pN:18500,dA:.13,kM:15000,cat:'Citadine', carb:['Essence','Hybride','GPL']},
  "Captur":         {pN:22500,dA:.13,kM:15000,cat:'SUV',      carb:['Essence','Diesel','Hybride','PHEV']},
  "Megane":         {pN:23000,dA:.12,kM:15000,cat:'Berline',  carb:['Essence','Diesel']},
  "Megane E-Tech":  {pN:40000,dA:.15,kM:14000,cat:'Berline',  carb:['Hybride','PHEV']},
  "Kadjar":         {pN:28000,dA:.14,kM:16000,cat:'SUV',      carb:['Essence','Diesel']},
  "Koleos":         {pN:36000,dA:.12,kM:16000,cat:'SUV',      carb:['Diesel']},
  "Arkana":         {pN:29900,dA:.13,kM:15000,cat:'SUV',      carb:['Essence','Hybride']},
  "Austral":        {pN:35000,dA:.12,kM:15000,cat:'SUV',      carb:['Hybride','PHEV']},
  "Scenic":         {pN:32000,dA:.13,kM:15000,cat:'Monospace',carb:['Hybride','Électrique']},
  "Zoe":            {pN:32000,dA:.16,kM:12000,cat:'Citadine', carb:['Électrique']}
},
"Seat": {
  "Mii":            {pN:12000,dA:.13,kM:11000,cat:'Citadine', carb:['Essence']},
  "Ibiza":          {pN:20000,dA:.12,kM:13000,cat:'Citadine', carb:['Essence','Diesel']},
  "Arona":          {pN:22000,dA:.12,kM:14000,cat:'SUV',      carb:['Essence','Diesel']},
  "Leon":           {pN:25000,dA:.11,kM:14000,cat:'Berline',  carb:['Essence','Diesel','Hybride','PHEV']},
  "Leon Sportstourer":{pN:27000,dA:.11,kM:15000,cat:'Break',  carb:['Essence','Diesel','Hybride']},
  "Ateca":          {pN:30000,dA:.11,kM:15000,cat:'SUV',      carb:['Essence','Diesel']},
  "Tarraco":        {pN:35000,dA:.11,kM:16000,cat:'SUV',      carb:['Essence','Diesel','PHEV']}
},
"Skoda": {
  "Fabia":          {pN:18000,dA:.12,kM:13000,cat:'Citadine', carb:['Essence']},
  "Scala":          {pN:24000,dA:.11,kM:14000,cat:'Berline',  carb:['Essence']},
  "Kamiq":          {pN:24000,dA:.12,kM:14000,cat:'SUV',      carb:['Essence','Diesel']},
  "Octavia":        {pN:30000,dA:.10,kM:15000,cat:'Berline',  carb:['Essence','Diesel','Hybride']},
  "Octavia Combi":  {pN:32000,dA:.10,kM:16000,cat:'Break',    carb:['Essence','Diesel','Hybride']},
  "Karoq":          {pN:30000,dA:.11,kM:15000,cat:'SUV',      carb:['Essence','Diesel']},
  "Kodiaq":         {pN:40000,dA:.11,kM:16000,cat:'SUV',      carb:['Essence','Diesel']},
  "Superb":         {pN:42000,dA:.10,kM:16000,cat:'Berline',  carb:['Essence','Diesel']},
  "Enyaq":          {pN:50000,dA:.16,kM:14000,cat:'SUV',      carb:['Électrique']}
},
"Suzuki": {
  "Ignis":          {pN:17000,dA:.12,kM:12000,cat:'Citadine', carb:['Essence','Hybride']},
  "Swift":          {pN:18000,dA:.12,kM:12000,cat:'Citadine', carb:['Essence','Hybride']},
  "Jimny":          {pN:22000,dA:.09,kM:14000,cat:'SUV',      carb:['Essence']},
  "Vitara":         {pN:26000,dA:.11,kM:14000,cat:'SUV',      carb:['Hybride']},
  "S-Cross":        {pN:25000,dA:.11,kM:14000,cat:'SUV',      carb:['Hybride']}
},
"Tesla": {
  "Model 3":        {pN:52000,dA:.18,kM:15000,cat:'Berline',  carb:['Électrique']},
  "Model Y":        {pN:58000,dA:.18,kM:15000,cat:'SUV',      carb:['Électrique']},
  "Model S":        {pN:110000,dA:.17,kM:15000,cat:'Berline', carb:['Électrique']},
  "Model X":        {pN:115000,dA:.18,kM:15000,cat:'SUV',     carb:['Électrique']}
},
"Toyota": {
  "Aygo X":         {pN:17000,dA:.12,kM:11000,cat:'Citadine', carb:['Essence']},
  "Yaris":          {pN:20000,dA:.10,kM:13000,cat:'Citadine', carb:['Hybride']},
  "Yaris Cross":    {pN:25000,dA:.10,kM:14000,cat:'SUV',      carb:['Hybride']},
  "C-HR":           {pN:28000,dA:.11,kM:14000,cat:'SUV',      carb:['Hybride','PHEV']},
  "Corolla":        {pN:27000,dA:.10,kM:15000,cat:'Berline',  carb:['Hybride']},
  "Corolla Touring":{pN:30000,dA:.10,kM:15000,cat:'Break',    carb:['Hybride']},
  "RAV4":           {pN:38000,dA:.11,kM:16000,cat:'SUV',      carb:['Hybride','PHEV']},
  "GR86":           {pN:35000,dA:.12,kM:13000,cat:'Coupé',    carb:['Essence']},
  "Land Cruiser":   {pN:75000,dA:.10,kM:18000,cat:'SUV',      carb:['Diesel']},
  "bZ4X":           {pN:52000,dA:.17,kM:14000,cat:'SUV',      carb:['Électrique']}
},
"Volkswagen": {
  "Up":             {pN:13000,dA:.13,kM:11000,cat:'Citadine', carb:['Essence']},
  "Polo":           {pN:22000,dA:.11,kM:14000,cat:'Citadine', carb:['Essence']},
  "Golf":           {pN:30000,dA:.10,kM:15000,cat:'Berline',  carb:['Essence','Diesel','Hybride']},
  "Golf SW":        {pN:33000,dA:.10,kM:16000,cat:'Break',    carb:['Essence','Diesel','Hybride']},
  "T-Cross":        {pN:26000,dA:.11,kM:14000,cat:'SUV',      carb:['Essence']},
  "T-Roc":          {pN:32000,dA:.11,kM:15000,cat:'SUV',      carb:['Essence','Diesel','Hybride']},
  "Tiguan":         {pN:38000,dA:.11,kM:16000,cat:'SUV',      carb:['Essence','Diesel','Hybride','PHEV']},
  "Touareg":        {pN:72000,dA:.11,kM:17000,cat:'SUV',      carb:['Diesel','Hybride','PHEV']},
  "Passat":         {pN:42000,dA:.10,kM:17000,cat:'Berline',  carb:['Diesel','Hybride']},
  "Arteon":         {pN:55000,dA:.11,kM:16000,cat:'Berline',  carb:['Essence','Diesel','Hybride']},
  "ID.3":           {pN:40000,dA:.17,kM:14000,cat:'Citadine', carb:['Électrique']},
  "ID.4":           {pN:48000,dA:.17,kM:14000,cat:'SUV',      carb:['Électrique']},
  "ID.5":           {pN:52000,dA:.17,kM:14000,cat:'SUV',      carb:['Électrique']},
  "ID.7":           {pN:62000,dA:.17,kM:15000,cat:'Berline',  carb:['Électrique']}
},
"Volvo": {
  "XC40":           {pN:42000,dA:.12,kM:14000,cat:'SUV',      carb:['Essence','Diesel','Hybride','PHEV','Électrique']},
  "XC60":           {pN:58000,dA:.11,kM:15000,cat:'SUV',      carb:['Diesel','Hybride','PHEV']},
  "XC90":           {pN:75000,dA:.11,kM:17000,cat:'SUV',      carb:['Diesel','Hybride','PHEV']},
  "V60":            {pN:45000,dA:.11,kM:15000,cat:'Break',    carb:['Diesel','Hybride','PHEV']},
  "C40":            {pN:52000,dA:.16,kM:14000,cat:'SUV',      carb:['Électrique']},
  "EX30":           {pN:42000,dA:.17,kM:13000,cat:'SUV',      carb:['Électrique']}
}
};

/* ===== INITIALISATION ===== */
async function init() {
  const selMarque = document.getElementById('sel-marque');

  try {
    const res = await fetch('/api/marques');
    if (!res.ok) throw new Error();
    const marques = await res.json();
    if (!Array.isArray(marques) || marques.length === 0) throw new Error();

    modeAPI = true;
    marques.sort((a,b) => a.nom.localeCompare(b.nom)).forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id; opt.dataset.nom = m.nom; opt.textContent = m.nom;
      selMarque.appendChild(opt);
    });

    Object.keys(VEHICULES).sort().forEach(marque => {
      const exists = [...selMarque.options].some(o => o.dataset.nom === marque);
      if (!exists) {
        const opt = document.createElement('option');
        opt.value = 'local_' + marque; opt.dataset.nom = marque; opt.dataset.local = '1';
        opt.textContent = marque + ' ★';
        selMarque.appendChild(opt);
      }
    });
  } catch {
    modeAPI = false;
    Object.keys(VEHICULES).sort().forEach(marque => {
      const opt = document.createElement('option');
      opt.value = marque; opt.textContent = marque;
      selMarque.appendChild(opt);
    });
  }

  const selAnnee = document.getElementById('sel-annee');
  for (let a = ANNEE_COURANTE; a >= 1995; a--) {
    const opt = document.createElement('option');
    opt.value = a; opt.textContent = a;
    selAnnee.appendChild(opt);
  }
}

/* ===== CHANGEMENT MARQUE ===== */
async function onMarqueChange() {
  const selMarque = document.getElementById('sel-marque');
  const selModel  = document.getElementById('sel-modele');

  selModel.innerHTML = '<option value="">Sélectionner un modèle</option>';
  selModel.disabled = true;
  selectedModele = null;
  document.getElementById('sec-motorisation').classList.remove('visible');
  document.getElementById('sec-annee-km').classList.remove('visible');
  document.getElementById('btn-avance').style.display = 'none';

  const val = selMarque.value;
  if (!val) return;

  const opt = selMarque.options[selMarque.selectedIndex];
  const isLocal = opt.dataset.local === '1';
  const marqueNom = opt.dataset.nom || val;

  if (modeAPI && !isLocal) {
    try {
      const res = await fetch('/api/modeles?marque_id=' + val);
      const items = await res.json();
      items.sort((a,b) => a.nom.localeCompare(b.nom)).forEach(m => {
        const o = document.createElement('option');
        o.value = m.id;
        const carbs = m.carburants ? m.carburants.split(',') : (VEHICULES[marqueNom]?.[m.nom]?.carb || ['Essence']);
        o.dataset.info = JSON.stringify({
          id: m.id, nom: m.nom, marqueNom,
          prixNeuf: m.prix_neuf,
          depreciationAnn: parseFloat(m.depreciation_ann),
          kmMoyenAnnuel: m.km_moyen_annuel,
          carburants: carbs,
          cat: m.categorie || ''
        });
        o.textContent = m.nom;
        selModel.appendChild(o);
      });
    } catch(e) { console.error(e); }
  } else {
    const modeles = VEHICULES[marqueNom] || {};
    Object.keys(modeles).sort().forEach(nom => {
      const d = modeles[nom];
      const o = document.createElement('option');
      o.value = nom;
      o.dataset.info = JSON.stringify({
        id: null, nom, marqueNom,
        prixNeuf: d.pN, depreciationAnn: d.dA, kmMoyenAnnuel: d.kM,
        carburants: d.carb, cat: d.cat
      });
      o.textContent = nom;
      selModel.appendChild(o);
    });
  }

  selModel.disabled = false;
}

/* ===== CHANGEMENT MODÈLE ===== */
function onModeleChange() {
  const selModel = document.getElementById('sel-modele');
  const opt = selModel.options[selModel.selectedIndex];

  if (!opt || !opt.dataset.info) { selectedModele = null; return; }

  selectedModele = JSON.parse(opt.dataset.info);
  F.carburant = null; F.boite = null;

  const container = document.getElementById('chips-carb');
  container.innerHTML = '';
  const carbs = selectedModele.carburants || ['Essence'];
  const icons = {
    'Essence':'⛽','Diesel':'🔩','Hybride':'♻️','PHEV':'🔌⛽',
    'Électrique':'🔋','GPL':'🌿'
  };
  carbs.forEach(c => {
    const span = document.createElement('span');
    span.className = 'chip';
    span.dataset.group = 'carburant';
    span.dataset.val   = c;
    span.textContent   = (icons[c] || '') + ' ' + c;
    span.onclick = () => selectChip(span);
    container.appendChild(span);
    if (carbs.length === 1) { span.classList.add('active'); F.carburant = c; }
  });

  document.getElementById('sec-motorisation').classList.add('visible');
  document.getElementById('sec-annee-km').classList.add('visible');
  document.getElementById('btn-avance').style.display = 'block';
  updateAdvCount();
}

/* ===== CHIP SÉLECTION ===== */
function selectChip(el) {
  const group = el.dataset.group;
  document.querySelectorAll(`.chip[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  F[group] = el.dataset.val;
  updateAdvCount();
}

/* ===== COULEUR ===== */
function selectCouleur(el) {
  document.querySelectorAll('.color-swatch-wrap').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  F.couleur = el.dataset.couleur;
  updateAdvCount();
}

/* ===== OPTIONS ===== */
function toggleOption(el) {
  const opt = el.dataset.opt;
  el.classList.toggle('checked');
  if (el.classList.contains('checked')) F.options.add(opt);
  else F.options.delete(opt);
  updateAdvCount();
}

/* ===== TOGGLES HISTORIQUE ===== */
function selectToggle(el) {
  const tog = el.dataset.tog;
  document.querySelectorAll(`.toggle-btn[data-tog="${tog}"]`).forEach(b => {
    b.classList.remove('oui','non');
  });
  el.classList.add(el.dataset.val === 'non' ? 'non' : (el.dataset.val === 'grave' ? 'non' : 'oui'));
  F[tog] = el.dataset.val;
  updateAdvCount();
}

/* ===== CV SLIDER ===== */
function updateCV(el) {
  document.getElementById('cv-val').textContent = el.value + ' CV';
}

/* ===== TOGGLE SECTION AVANCÉE ===== */
let avanceOuvert = false;
function toggleAvance() {
  avanceOuvert = !avanceOuvert;
  document.getElementById('sec-avance').style.display = avanceOuvert ? 'block' : 'none';
  document.getElementById('adv-arrow').textContent = avanceOuvert ? '▲' : '▼';
}

function updateAdvCount() {
  let n = 0;
  if (F.couleur) n++;
  if (F.options.size > 0) n += F.options.size;
  if (F.premiere) n++;
  if (F.carnet)   n++;
  if (F.garantie) n++;
  if (F.accident) n++;
  const badge = document.getElementById('adv-count');
  if (n > 0) { badge.textContent = n; badge.style.display = 'inline'; }
  else badge.style.display = 'none';
}

/* ===== ALGORITHME ===== */
function calculerPrix(m, annee, km) {
  const age      = ANNEE_COURANTE - annee;
  const prixBase = m.prixNeuf * Math.pow(1 - m.depreciationAnn, Math.max(0, age));
  const kmAttendu = m.kmMoyenAnnuel * Math.max(0, age);
  const ecart    = (km - kmAttendu) / 10000;
  let   coefKm   = ecart > 0 ? 1 - 0.008 * ecart : 1 - 0.005 * ecart;
  coefKm         = Math.max(0.4, Math.min(1.3, coefKm));

  const prixApresKm   = Math.round(prixBase * coefKm);
  const modCarb       = CARB_MOD[F.carburant]   || 1.0;
  const modBoite      = BOITE_MOD[F.boite]      || 1.0;
  const modCouleur    = COULEUR_MOD[F.couleur]  || 1.0;

  let optionsTotal = 0;
  F.options.forEach(o => { optionsTotal += (OPTION_PRIX[o] || 0); });

  let modHistorique = 1.0;
  if (F.premiere === 'oui') modHistorique *= 1.06;
  if (F.carnet   === 'oui') modHistorique *= 1.03;
  if (F.garantie === 'oui') modHistorique *= 1.04;
  if (F.accident === 'leger') modHistorique *= 0.92;
  if (F.accident === 'grave') modHistorique *= 0.80;

  const apresCarb    = Math.round(prixApresKm  * modCarb);
  const apresBoite   = Math.round(apresCarb    * modBoite);
  const apresCouleur = Math.round(apresBoite   * modCouleur);
  const apresOptions = apresCouleur + optionsTotal;
  const prixMoyen    = Math.round(apresOptions * modHistorique);

  return {
    base:         Math.round(prixBase),
    apresKm:      prixApresKm,
    kmDiff:       prixApresKm - Math.round(prixBase),
    modCarb, modBoite, modCouleur,
    optionsTotal, modHistorique,
    moyen:  prixMoyen,
    haut:   Math.round(prixMoyen * (1 + FOURCHETTE)),
    bas:    Math.round(prixMoyen * (1 - FOURCHETTE))
  };
}

function determinerEtat(age, km) {
  const score = age * 1.2 + km / 20000;
  if (score < 3)  return {label:'Excellent',classe:'badge-excellent'};
  if (score < 7)  return {label:'Bon',      classe:'badge-bon'};
  if (score < 12) return {label:'Correct',  classe:'badge-correct'};
  return               {label:'Fatigué', classe:'badge-fatigue'};
}

function animerCompteur(el, cible, duree) {
  const debut = Date.now();
  (function update() {
    const p = Math.min((Date.now()-debut)/duree, 1);
    el.textContent = formatPrix(Math.round(cible * (1 - Math.pow(1-p, 3))));
    if (p < 1) requestAnimationFrame(update);
  })();
}

function formatPrix(n) {
  return n.toLocaleString('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0});
}

/* ===== BREAKDOWN ===== */
function afficherBreakdown(res, m, annee, km) {
  const age = ANNEE_COURANTE - annee;
  const pct = v => v >= 0 ? '+' + v.toFixed(0) + '%' : v.toFixed(0) + '%';
  const eur = v => v >= 0 ? '+' + formatPrix(v) : '−' + formatPrix(Math.abs(v));

  const rows = [
    ['Prix neuf', formatPrix(m.prixNeuf), 'neutral'],
    [`Dépréciation ${age} an${age>1?'s':''} (${(m.depreciationAnn*100).toFixed(0)}%/an)`,
      eur(res.base - m.prixNeuf), res.base < m.prixNeuf ? 'minus' : 'plus'],
    [`Kilométrage (${km.toLocaleString('fr-FR')} km)`,
      eur(res.kmDiff), res.kmDiff >= 0 ? 'plus' : 'minus'],
  ];

  if (F.carburant && res.modCarb !== 1.0) {
    const diff = res.apresKm * res.modCarb - res.apresKm;
    rows.push([`Carburant : ${F.carburant}`, eur(diff), diff >= 0 ? 'plus' : 'minus']);
  }
  if (F.boite && res.modBoite !== 1.0) {
    const base = res.apresKm * res.modCarb;
    const diff = base * res.modBoite - base;
    rows.push([`Boîte : ${F.boite}`, eur(diff), diff >= 0 ? 'plus' : 'minus']);
  }
  if (F.couleur && res.modCouleur !== 1.0) {
    const base2 = res.apresKm * res.modCarb * res.modBoite;
    const diff2 = base2 * res.modCouleur - base2;
    rows.push([`Couleur : ${F.couleur}`, eur(diff2), diff2 >= 0 ? 'plus' : 'minus']);
  }
  if (res.optionsTotal > 0) rows.push([`Options (${F.options.size} sélectionnées)`, eur(res.optionsTotal), 'plus']);
  if (res.modHistorique !== 1.0) {
    const baseFinal = res.moyen / res.modHistorique;
    const diffH = res.moyen - baseFinal;
    rows.push([`Historique du véhicule`, eur(Math.round(diffH)), diffH >= 0 ? 'plus' : 'minus']);
  }
  rows.push(['Prix moyen estimé', formatPrix(res.moyen), 'total']);

  const container = document.getElementById('breakdown-rows');
  container.innerHTML = rows.map((r,i) =>
    `<div class="breakdown-row">
      <span class="br-label">${r[0]}</span>
      <span class="br-val ${i === rows.length-1 ? 'br-total' : 'br-' + r[2]}">${r[1]}</span>
    </div>`
  ).join('');
}

/* ===== GRAPHIQUE ===== */
let chartInstance = null;
function tracerGraphique(m, anneeVehicule) {
  const labels = [], valeurs = [];
  for (let a = anneeVehicule; a <= anneeVehicule+15; a++) {
    labels.push(a);
    valeurs.push(Math.round(Math.max(m.prixNeuf * Math.pow(1-m.depreciationAnn, a-anneeVehicule), m.prixNeuf*.05)));
  }
  document.getElementById('chart-title-model').textContent = m.marqueNom + ' ' + m.nom;
  const idx = Math.min(ANNEE_COURANTE - anneeVehicule, labels.length-1);
  if (chartInstance) chartInstance.destroy();
  const ctx = document.getElementById('chartDeprec').getContext('2d');
  const gradient = ctx.createLinearGradient(0,0,0,280);
  gradient.addColorStop(0,'rgba(230,57,70,.35)');
  gradient.addColorStop(1,'rgba(230,57,70,.01)');
  chartInstance = new Chart(ctx,{
    type:'line',
    data:{ labels, datasets:[{
      label:'Valeur estimée', data:valeurs,
      borderColor:'#e63946', backgroundColor:gradient, borderWidth:2.5,
      pointRadius: labels.map((_,i)=>i===idx?8:3),
      pointBackgroundColor: labels.map((_,i)=>i===idx?'#fff':'#e63946'),
      pointBorderColor:'#e63946',
      pointBorderWidth: labels.map((_,i)=>i===idx?3:1.5),
      tension:.4, fill:true
    }]},
    options:{
      responsive:true, interaction:{mode:'index',intersect:false},
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:'#1a1a1a',borderColor:'#2e2e2e',borderWidth:1,
          titleColor:'#f0f0f0',bodyColor:'#aaa',
          callbacks:{label:c=>' '+formatPrix(c.parsed.y)}
        }
      },
      scales:{
        x:{grid:{color:'#1f1f1f'},ticks:{color:'#888',font:{family:'Inter',size:11}}},
        y:{grid:{color:'#1f1f1f'},ticks:{color:'#888',font:{family:'Inter',size:11},callback:v=>formatPrix(v)},beginAtZero:false}
      }
    }
  });
}

/* ===== ESTIMER (principal) ===== */
async function estimer() {
  const annee = parseInt(document.getElementById('sel-annee').value);
  const km    = parseInt(document.getElementById('inp-km').value);

  if (!selectedModele) { alert('Veuillez sélectionner une marque et un modèle.'); return; }
  if (!annee)          { alert('Veuillez sélectionner une année.'); return; }
  if (isNaN(km)||km<0) { alert('Veuillez entrer un kilométrage valide.'); return; }
  if (!F.carburant)    { alert('Veuillez sélectionner un carburant.'); return; }
  if (!F.boite)        { alert('Veuillez sélectionner la boîte de vitesses.'); return; }

  const m   = selectedModele;
  const age = ANNEE_COURANTE - annee;
  const res = calculerPrix(m, annee, km);
  const etat = determinerEtat(age, km);

  const badge = document.getElementById('badge-etat');
  badge.textContent = etat.label; badge.className = 'badge ' + etat.classe;

  const optLabels = {
    gps:'GPS',cuir:'Cuir',toit:'Toit pano.',camera:'Caméra',chauffants:'Sièges chauf.',
    parking:'Aide parking',hiver:'Pack hiver',attelage:'Attelage',
    jantes:'Jantes alu',acc:'ACC',lane:'Lane assist',keyless:'Keyless'
  };

  let summaryHtml =
    `<span><strong>${m.marqueNom} ${m.nom}</strong></span>` +
    `<span>Carburant <strong>${F.carburant}</strong></span>` +
    `<span>Boîte <strong>${F.boite}</strong></span>` +
    `<span>Année <strong>${annee}</strong></span>` +
    `<span>Kilométrage <strong>${km.toLocaleString('fr-FR')} km</strong></span>` +
    `<span>Âge <strong>${age} an${age>1?'s':''}</strong></span>`;
  if (F.couleur) summaryHtml += `<span>Couleur <strong>${F.couleur}</strong></span>`;
  if (F.options.size > 0) summaryHtml += `<span>Options <strong>${[...F.options].map(o=>optLabels[o]||o).join(', ')}</strong></span>`;
  document.getElementById('vehicle-summary').innerHTML = summaryHtml;

  animerCompteur(document.getElementById('prix-haut'),  res.haut,  900);
  animerCompteur(document.getElementById('prix-moyen'), res.moyen, 1000);
  animerCompteur(document.getElementById('prix-bas'),   res.bas,   1100);

  afficherBreakdown(res, m, annee, km);
  tracerGraphique(m, annee);

  const section = document.getElementById('results');
  section.style.display = 'block';
  section.scrollIntoView({behavior:'smooth',block:'start'});

  if (modeAPI && m.id) {
    try {
      await fetch('/api/estimations', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          id_modele: m.id, annee_vehicule: annee, kilometrage: km,
          prix_bas: res.bas, prix_moyen: res.moyen, prix_haut: res.haut,
          etat_estime: etat.label
        })
      });
    } catch(_) {}
  }
}

init();
