#!/usr/bin/env node
/**
 * Isolated Go-API stand-in for Clinic Ranking FE verification.
 * Serves contract-shaped fixture data on 127.0.0.1 (default :18080).
 * Well-known values are documented in ../SKILL.md — keep them stable.
 */
import http from "node:http";
import { URL } from "node:url";

const HOST = process.env.CLINIC_RANKING_VERIFY_MOCK_HOST || "127.0.0.1";
const PORT = Number(process.env.CLINIC_RANKING_VERIFY_MOCK_PORT || 18080);
const PAGE_SIZE = 3;
const COUNTRY = "Deutschland";

const VERIFY_OK = "clinic-ranking-verify-ok";
const VERIFY_DEAD = new Set(["expired", "already_used", "invalid", "wrong_status"]);

/** Stable RFC UUIDs — first id is the reviews.md backend-down / mock-success example. */
const ID = {
  innenstadt: "62db672b-d95a-4eeb-97f1-a97935095622",
  schwabing: "550e8400-e29b-41d4-a716-446655440001",
  augsburg: "550e8400-e29b-41d4-a716-446655440002",
  chariteInner: "550e8400-e29b-41d4-a716-446655440003",
  chariteAnesth: "550e8400-e29b-41d4-a716-446655440004",
  vivantes: "550e8400-e29b-41d4-a716-446655440005",
  uke: "550e8400-e29b-41d4-a716-446655440006",
};

const DETAIL_BASE = {
  yearOfTraining: 3,
  yearAtHospital: 2,
  homeUniversity: "LMU München",
  trainingHospitalChanged: false,
  rotations: ["generalWard", "icu"],
  otherRotations: "",
  surgeryRoles: ["firstAssist"],
  surgeryComplexProcedures: false,
  surgeryTimePercentage: 20,
  ownDiagnosticsExecution: true,
  diagnosticsTimePercentage: 25,
  trainingQuality: ["structuredOnboarding", "mentor"],
  workStructure: ["structuredTrainingProgram"],
  averageTrainingTimeYears: 6,
  workAtmosphere: ["niceColleagues", "flatHierarchies"],
  weeklyHours: 50,
  contractualHours: 42,
  overtimeCompensationType: null,
  correctOvertimeLogging: true,
  onCallShiftsPerMonth: 3,
  gradeTheoreticalKnowledge: 2,
  gradePracticalKnowledge: 2,
  gradeAtmosphere: 3,
  gradeFacilities: 2,
  gradeWorkingConditions: 3,
  gradeFamilyFriendliness: 4,
  wouldRecommendHospital: true,
  textReviewTraining: "Solide Weiterbildung, viel Eigenverantwortung.",
  textReviewApplication: "Bewerbung über Online-Portal, Rückmeldung in zwei Wochen.",
};

const REVIEWS = [
  row(ID.innenstadt, "2026-03-12T10:15:00.000+01:00", "Bayern", "München", "Klinikum Innenstadt", "Innere Medizin", 2),
  row(ID.schwabing, "2026-02-20T09:00:00.000+01:00", "Bayern", "München", "Klinikum Schwabing", "Chirurgie", 3),
  row(ID.augsburg, "2026-01-08T14:30:00.000+01:00", "Bayern", "Augsburg", "Uniklinik Augsburg", "Innere Medizin", 4),
  row(ID.chariteInner, "2025-11-18T11:45:00.000+01:00", "Berlin", "Berlin", "Charité Campus Mitte", "Innere Medizin", 2),
  row(ID.chariteAnesth, "2025-10-02T08:20:00.000+02:00", "Berlin", "Berlin", "Charité Campus Mitte", "Anästhesie", 3),
  row(ID.vivantes, "2025-09-14T16:00:00.000+02:00", "Berlin", "Berlin", "Vivantes Klinikum", "Chirurgie", 5),
  row(ID.uke, "2025-08-01T12:00:00.000+02:00", "Hamburg", "Hamburg", "UKE", "Innere Medizin", 1),
];

function row(id, dateTime, state, city, hospital, specialty, totalGrade) {
  return {
    id,
    dateTime,
    state,
    city,
    hospital,
    specialty,
    totalGrade,
    ...DETAIL_BASE,
  };
}

const STATES = ["Bayern", "Berlin", "Hamburg", "Sachsen"].map((name) => ({
  name,
  countryName: COUNTRY,
}));

const CITIES = [
  { name: "München", stateName: "Bayern" },
  { name: "Augsburg", stateName: "Bayern" },
  { name: "Berlin", stateName: "Berlin" },
  { name: "Hamburg", stateName: "Hamburg" },
  { name: "Leipzig", stateName: "Sachsen" },
].map((c) => ({ ...c, countryName: COUNTRY }));

const HOSPITALS = [
  { name: "Klinikum Innenstadt", cityName: "München", stateName: "Bayern" },
  { name: "Klinikum Schwabing", cityName: "München", stateName: "Bayern" },
  { name: "Uniklinik Augsburg", cityName: "Augsburg", stateName: "Bayern" },
  { name: "Charité Campus Mitte", cityName: "Berlin", stateName: "Berlin" },
  { name: "Vivantes Klinikum", cityName: "Berlin", stateName: "Berlin" },
  { name: "UKE", cityName: "Hamburg", stateName: "Hamburg" },
  { name: "Uniklinik Leipzig", cityName: "Leipzig", stateName: "Sachsen" },
].map((h) => ({ ...h, countryName: COUNTRY }));

const SPECIALTIES = ["Innere Medizin", "Chirurgie", "Anästhesie", "Biochemie"].map((name) => ({
  name,
}));

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
    "cache-control": "no-store",
  });
  res.end(payload);
}

function apiError(res, status, code, message) {
  json(res, status, { status, code, message, details: null });
}

function encodeCursor(offset) {
  return `cursor-${String(offset).padStart(4, "0")}-end`;
}

function decodeCursor(raw) {
  const m = /^cursor-(\d+)-end$/.exec(raw || "");
  if (!m) return 0;
  return Number(m[1]);
}

function summaryOf(review) {
  return {
    id: review.id,
    dateTime: review.dateTime,
    state: review.state,
    city: review.city,
    hospital: review.hospital,
    specialty: review.specialty,
    totalGrade: review.totalGrade,
  };
}

function filterReviews(params) {
  return REVIEWS.filter((r) => {
    if (params.get("state") && r.state !== params.get("state")) return false;
    if (params.get("city") && r.city !== params.get("city")) return false;
    if (params.get("hospital") && r.hospital !== params.get("hospital")) return false;
    if (params.get("specialty") && r.specialty !== params.get("specialty")) return false;
    return true;
  });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

async function handle(req, res) {
  const url = new URL(req.url || "/", `http://${HOST}:${PORT}`);
  const { pathname } = url;
  const method = req.method || "GET";

  if (method === "GET" && pathname === "/health") {
    json(res, 200, { ok: true, reviews: REVIEWS.length, pageSize: PAGE_SIZE });
    return;
  }

  if (method === "GET" && pathname === "/reviews") {
    const items = filterReviews(url.searchParams);
    const offset = decodeCursor(url.searchParams.get("cursor") || "");
    const page = items.slice(offset, offset + PAGE_SIZE);
    const nextOffset = offset + PAGE_SIZE;
    const hasNext = nextOffset < items.length;
    json(res, 200, {
      data: page.map(summaryOf),
      pagination: {
        pageSize: PAGE_SIZE,
        hasNext,
        ...(hasNext ? { nextCursor: encodeCursor(nextOffset) } : {}),
      },
    });
    return;
  }

  const reviewMatch = /^\/reviews\/([^/]+)$/.exec(pathname);
  if (method === "GET" && reviewMatch) {
    const review = REVIEWS.find((r) => r.id === reviewMatch[1]);
    if (!review) {
      apiError(res, 404, "not_found", "review not found");
      return;
    }
    json(res, 200, review);
    return;
  }

  if (method === "GET" && pathname === "/types/states") {
    json(res, 200, { data: STATES });
    return;
  }
  if (method === "GET" && pathname === "/types/specialties") {
    json(res, 200, { data: SPECIALTIES });
    return;
  }
  if (method === "GET" && pathname === "/types/cities") {
    const state = url.searchParams.get("state");
    const data = state ? CITIES.filter((c) => c.stateName === state) : CITIES;
    json(res, 200, { data });
    return;
  }
  if (method === "GET" && pathname === "/types/hospitals") {
    const state = url.searchParams.get("state");
    const city = url.searchParams.get("city");
    const data = HOSPITALS.filter((h) => {
      if (state && h.stateName !== state) return false;
      if (city && h.cityName !== city) return false;
      return true;
    });
    json(res, 200, { data });
    return;
  }

  if (method === "POST" && pathname === "/review") {
    let body;
    try {
      body = await readJsonBody(req);
    } catch {
      apiError(res, 400, "invalid_json", "invalid json");
      return;
    }
    if (!body || typeof body.email !== "string" || !body.email.includes("@")) {
      apiError(res, 400, "invalid", "email required");
      return;
    }
    json(res, 201, {
      id: "550e8400-e29b-41d4-a716-446655440099",
      createdAt: new Date().toISOString(),
    });
    return;
  }

  if (method === "POST" && pathname === "/feedback") {
    let body;
    try {
      body = await readJsonBody(req);
    } catch {
      apiError(res, 400, "invalid_json", "invalid json");
      return;
    }
    if (!body || typeof body.feedback !== "string" || typeof body.email !== "string") {
      apiError(res, 400, "invalid", "feedback and email required");
      return;
    }
    json(res, 201, {
      id: "550e8400-e29b-41d4-a716-446655440098",
      createdAt: new Date().toISOString(),
    });
    return;
  }

  if (method === "POST" && pathname === "/review-requests/verify") {
    let body;
    try {
      body = await readJsonBody(req);
    } catch {
      apiError(res, 400, "invalid_json", "invalid json");
      return;
    }
    const token = typeof body.token === "string" ? body.token : "";
    if (token === VERIFY_OK) {
      json(res, 200, { ok: true });
      return;
    }
    if (VERIFY_DEAD.has(token)) {
      apiError(res, 400, token, token);
      return;
    }
    if (!token) {
      apiError(res, 400, "invalid", "invalid");
      return;
    }
    apiError(res, 400, "invalid", "invalid");
    return;
  }

  apiError(res, 404, "not_found", `no mock handler for ${method} ${pathname}`);
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((error) => {
    apiError(res, 500, "BACKEND_ERROR", error instanceof Error ? error.message : "mock error");
  });
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`ready http://${HOST}:${PORT}\n`);
});

server.on("error", (error) => {
  process.stderr.write(`mock-backend failed: ${error.message}\n`);
  process.exit(1);
});
