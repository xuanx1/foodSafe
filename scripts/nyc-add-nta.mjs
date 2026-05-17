// One-off preprocess: append an `NTA` column to the NYC inspection CSV by
// point-in-polygon against data/geo/nyc-ntas.geojson (NTA 2020).
//
//   node scripts/nyc-add-nta.mjs
//
// Reads:  nyc-DOHMH_New_York_City_Restaurant_Inspection_Results_20250726.csv
// Writes: nyc-DOHMH_New_York_City_Restaurant_Inspection_Results_20250726.csv (in place,
//         via temp file + rename so a failure can't corrupt the source).
//
// Rows with empty / zero / out-of-NYC coordinates get an empty NTA value and
// will be excluded from the choropleth at runtime, exactly like rows without a
// borough or zip in the other cities' configs.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GEO_PATH = path.join(ROOT, 'data', 'geo', 'nyc-ntas.geojson');
const SRC_CSV = path.join(ROOT, 'nyc-DOHMH_New_York_City_Restaurant_Inspection_Results_20250726.csv');
const TMP_CSV = SRC_CSV + '.tmp';

const geo = JSON.parse(fs.readFileSync(GEO_PATH, 'utf8'));

const ntas = geo.features.map(f => {
    const code = f.properties.nta2020;
    const polys = []; // array of polygons; each polygon is [outerRing, ...holes]
    const g = f.geometry;
    if (g.type === 'Polygon') polys.push(g.coordinates);
    else if (g.type === 'MultiPolygon') for (const p of g.coordinates) polys.push(p);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const poly of polys) for (const ring of poly) for (const [x, y] of ring) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    }
    return { code, polys, bbox: [minX, minY, maxX, maxY] };
});
console.log(`Loaded ${ntas.length} NTA polygons.`);

function pointInRing(x, y, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i][0], yi = ring[i][1];
        const xj = ring[j][0], yj = ring[j][1];
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
}

function findNTA(lng, lat) {
    for (const n of ntas) {
        const b = n.bbox;
        if (lng < b[0] || lng > b[2] || lat < b[1] || lat > b[3]) continue;
        for (const poly of n.polys) {
            if (!poly.length || !pointInRing(lng, lat, poly[0])) continue;
            let inHole = false;
            for (let h = 1; h < poly.length; h++) {
                if (pointInRing(lng, lat, poly[h])) { inHole = true; break; }
            }
            if (!inHole) return n.code;
        }
    }
    return '';
}

const text = fs.readFileSync(SRC_CSV, 'utf8');
console.log(`Loaded ${text.length.toLocaleString()} bytes of CSV.`);

const out = fs.createWriteStream(TMP_CSV);

let recStart = 0;
let fieldStart = 0;
let inQuotes = false;
let fields = [];
let headerDone = false;
let latIdx = -1, lonIdx = -1;
let processed = 0, matched = 0;

function flushRecord(recEnd) {
    if (!headerDone) {
        for (let i = 0; i < fields.length; i++) {
            const name = fields[i].replace(/^"|"$/g, '').trim();
            if (name === 'Latitude') latIdx = i;
            else if (name === 'Longitude') lonIdx = i;
        }
        if (latIdx < 0 || lonIdx < 0) throw new Error('Could not find Latitude/Longitude columns in header');
        out.write(text.slice(recStart, recEnd) + ',NTA\n');
        headerDone = true;
        return;
    }
    let nta = '';
    if (fields.length > Math.max(latIdx, lonIdx)) {
        const lat = parseFloat(fields[latIdx]);
        const lng = parseFloat(fields[lonIdx]);
        if (Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0) {
            nta = findNTA(lng, lat);
            if (nta) matched++;
        }
    }
    out.write(text.slice(recStart, recEnd) + ',' + nta + '\n');
    processed++;
    if (processed % 50000 === 0) console.log(`  ${processed.toLocaleString()} rows processed, ${matched.toLocaleString()} matched...`);
}

for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (inQuotes) {
        if (c === 34) {
            if (i + 1 < text.length && text.charCodeAt(i + 1) === 34) { i++; continue; }
            inQuotes = false;
        }
        continue;
    }
    if (c === 34) { inQuotes = true; continue; }
    if (c === 44) {
        fields.push(text.slice(fieldStart, i));
        fieldStart = i + 1;
        continue;
    }
    if (c === 10 || c === 13) {
        fields.push(text.slice(fieldStart, i));
        const recEnd = i;
        if (c === 13 && i + 1 < text.length && text.charCodeAt(i + 1) === 10) i++;
        flushRecord(recEnd);
        recStart = i + 1;
        fieldStart = i + 1;
        fields = [];
    }
}
if (recStart < text.length) {
    fields.push(text.slice(fieldStart));
    flushRecord(text.length);
}

out.end(() => {
    fs.renameSync(TMP_CSV, SRC_CSV);
    console.log(`Done. ${processed.toLocaleString()} rows; ${matched.toLocaleString()} got an NTA (${(100 * matched / processed).toFixed(1)}%).`);
});
