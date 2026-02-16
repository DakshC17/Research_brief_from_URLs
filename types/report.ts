export interface SourceUsed {
    id: number;
    url: string;
    what_used: string;
}

export interface KeyPoint {
    point: string;
    sources: number[];
    snippet: string;
}

export interface ConflictingClaim {
    claim: string;
    sources: number[];
}

export interface ResearchBrief {
    summary: string;
    key_points: KeyPoint[];
    conflicting_claims: ConflictingClaim[];
    verification_checklist: string[];
    sources_used: SourceUsed[];
}

export interface SavedReport {
    id: number;
    urls: string[];
    report: ResearchBrief;
    created_at: string;
}
