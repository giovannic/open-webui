export type Banner = {
	id: string;
	type: string;
	title?: string;
	content: string;
	url?: string;
	dismissible?: boolean;
	timestamp: number;
};

export enum TTS_RESPONSE_SPLIT {
	PUNCTUATION = 'punctuation',
	PARAGRAPHS = 'paragraphs',
	NONE = 'none'
}

// Context types for Shared Context (SC) API
export interface ContextEntry {
	id: string;
	content: string;
	timestamp: number;
}

export interface Context {
	id: string;
	uri: string;
	readme: string | null;
}

export interface CreateContextRequest {
	entries?: Array<{ content: string }>;
	readme?: string;
}

export interface ListContextsResponse {
	contexts: Context[];
	total: number;
}

export interface GetContextResponse {
	entries: ContextEntry[];
	total: number;
}
