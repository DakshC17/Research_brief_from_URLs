import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { ResearchBrief, SavedReport } from '@/types/report';

// Use /tmp directory for Vercel serverless environment
// Note: Data will be ephemeral and reset between deployments
const DB_PATH = process.env.DATABASE_PATH || '/tmp/research.db';

// Ensure directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new Database(DB_PATH);

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    urls TEXT NOT NULL,
    report TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export function saveReport(urls: string[], report: ResearchBrief): number {
    const stmt = db.prepare(
        'INSERT INTO reports (urls, report) VALUES (?, ?)'
    );
    const result = stmt.run(JSON.stringify(urls), JSON.stringify(report));
    return result.lastInsertRowid as number;
}

export function getReport(id: number): SavedReport | null {
    const stmt = db.prepare(
        'SELECT id, urls, report, created_at FROM reports WHERE id = ?'
    );
    const row = stmt.get(id) as any;

    if (!row) return null;

    return {
        id: row.id,
        urls: JSON.parse(row.urls),
        report: JSON.parse(row.report),
        created_at: row.created_at,
    };
}

export function getRecentReports(limit: number = 5): SavedReport[] {
    const stmt = db.prepare(
        'SELECT id, urls, report, created_at FROM reports ORDER BY created_at DESC LIMIT ?'
    );
    const rows = stmt.all(limit) as any[];

    return rows.map(row => ({
        id: row.id,
        urls: JSON.parse(row.urls),
        report: JSON.parse(row.report),
        created_at: row.created_at,
    }));
}

export function checkDatabaseConnection(): boolean {
    try {
        db.prepare('SELECT 1').get();
        return true;
    } catch (error) {
        return false;
    }
}

export default db;
