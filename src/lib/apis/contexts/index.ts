import type {
	Context,
	ContextEntry,
	CreateContextRequest,
	ListContextsResponse,
	GetContextResponse
} from '$lib/types';

// Get SC API base URL from environment or fallback to WEBUI base
const getSCApiBaseUrl = () => {
	const publicUrl =
		typeof window !== 'undefined'
			? (window as any).__PUBLIC_SC_API_URL
			: import.meta.env.PUBLIC_SC_API_URL;
	return publicUrl || 'http://localhost:8000';
};

export const listContexts = async (
	token: string,
	limit: number = 50,
	offset: number = 0
): Promise<ListContextsResponse> => {
	let error = null;
	const baseUrl = getSCApiBaseUrl();

	const res = await fetch(
		`${baseUrl}/contexts?limit=${limit}&offset=${offset}`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				authorization: `Bearer ${token}`
			}
		}
	)
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			error = err;
			console.error(err);
			return null;
		});

	if (error) {
		throw error;
	}

	return res;
};

export const createContext = async (
	token: string,
	data: CreateContextRequest
): Promise<{ uri: string; contextId: string }> => {
	let error = null;
	const baseUrl = getSCApiBaseUrl();

	const res = await fetch(`${baseUrl}/contexts`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify(data)
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			error = err;
			console.error(err);
			return null;
		});

	if (error) {
		throw error;
	}

	return res;
};

export const getContext = async (
	token: string,
	contextId: string,
	order: string = 'asc',
	limit: number = 20,
	offset: number = 0
): Promise<GetContextResponse> => {
	let error = null;
	const baseUrl = getSCApiBaseUrl();

	const res = await fetch(
		`${baseUrl}/contexts/${contextId}/context?order=${order}&limit=${limit}&offset=${offset}`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				authorization: `Bearer ${token}`
			}
		}
	)
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			error = err;
			console.error(err);
			return null;
		});

	if (error) {
		throw error;
	}

	return res;
};

export const getContextReadme = async (
	token: string,
	contextId: string
): Promise<{ readme: string | null }> => {
	let error = null;
	const baseUrl = getSCApiBaseUrl();

	const res = await fetch(`${baseUrl}/contexts/${contextId}/readme`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`
		}
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			error = err;
			console.error(err);
			return null;
		});

	if (error) {
		throw error;
	}

	return res;
};

export const updateContextReadme = async (
	token: string,
	contextId: string,
	readme: string
): Promise<{ success: boolean }> => {
	let error = null;
	const baseUrl = getSCApiBaseUrl();

	const res = await fetch(`${baseUrl}/contexts/${contextId}/readme`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ readme })
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			error = err;
			console.error(err);
			return null;
		});

	if (error) {
		throw error;
	}

	return res;
};

export const addContextEntry = async (
	token: string,
	contextId: string,
	content: string
): Promise<{ id: string; timestamp: number }> => {
	let error = null;
	const baseUrl = getSCApiBaseUrl();

	const res = await fetch(`${baseUrl}/contexts/${contextId}/context`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ content })
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			error = err;
			console.error(err);
			return null;
		});

	if (error) {
		throw error;
	}

	return res;
};
