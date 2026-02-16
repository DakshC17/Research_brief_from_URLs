// In-memory storage for Vercel deployment
// Note: Data will be lost between serverless function invocations
// For production, use Vercel KV, Postgres, or Supabase

import { ResearchBrief, SavedReport } from '@/types/report';

// In-memory storage
let reports: SavedReport[] = [];
let nextId = 1;

export function saveReport(urls: string[], report: ResearchBrief): number {
    const id = nextId++;
    const savedReport: SavedReport = {
        id,
        urls,
        report,
        created_at: new Date().toISOString(),
    };
    reports.unshift(savedReport); // Add to beginning

    // Keep only last 10 reports to prevent memory issues
    if (reports.length > 10) {
        reports = reports.slice(0, 10);
    }

    return id;
}

export function getReport(id: number): SavedReport | null {
    return reports.find(r => r.id === id) || null;
}

export function getRecentReports(limit: number = 5): SavedReport[] {
    return reports.slice(0, Math.min(limit, reports.length));
}

export function checkDatabaseConnection(): boolean {
    // Always return true for in-memory storage
    return true;
}

export default { saveReport, getReport, getRecentReports, checkDatabaseConnection };
