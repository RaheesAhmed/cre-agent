import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cre-backend-uk58.onrender.com';

export interface ChatRequest {
    message: string;
    thread_id: string;
    agent?: string;
    context?: Record<string, any>;
}

export interface ChatResponse {
    response: string;
    agent_used: string;
    thread_id: string;
    processing_time?: number;
}

export interface AgentListResponse {
    agents: string[];
    default_agent: string;
}

export interface ExcelFile {
    filename: string;
    sheets: string[];
    row_count: Record<string, number>;
    column_names: Record<string, string[]>;
    preview: Record<string, any[]>;
}

export interface CREAgentResponse {
  response: string;
  agent_used?: string;
  processing_time?: number;
  conversation_id?: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
}

export class ApiClient {
    private static instance: ApiClient;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = API_BASE_URL;
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    // Health check
    async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1`);
            return response.ok;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }

    // Agent endpoints
    async getAvailableAgents(): Promise<AgentListResponse> {
        const response = await fetch(`${this.baseUrl}/api/v1/agent/agents`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to fetch agents');
        }
        return response.json();
    }

    async sendMessage(message: string, threadId: string, agent: string = 'main', context?: Record<string, any>): Promise<ChatResponse> {
        const response = await fetch(`${this.baseUrl}/api/v1/agent/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                thread_id: threadId,
                agent,
                context
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to send message');
        }

        return response.json();
    }

    getStreamingResponse(message: string, threadId: string, agent: string = 'main'): EventSource {
        const params = new URLSearchParams({
            message,
            thread_id: threadId,
            agent
        });
        return new EventSource(`${this.baseUrl}/api/v1/agent/stream?${params.toString()}`);
    }

    // Excel tools endpoints
    async listExcelFiles(): Promise<Record<string, ExcelFile>> {
        const response = await fetch(`${this.baseUrl}/api/v1/tools/excel/files`);
        if (!response.ok) throw new Error('Failed to fetch Excel files');
        const data = await response.json();
        return data.files;
    }

    async searchExcelFiles(query: string): Promise<Record<string, any[]>> {
        const response = await fetch(`${this.baseUrl}/api/v1/tools/excel/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        if (!response.ok) throw new Error('Failed to search Excel files');
        const data = await response.json();
        return data.results;
    }

    async readExcelSheet(filename: string, sheetName: string, maxRows: number = 100): Promise<any[]> {
        const response = await fetch(`${this.baseUrl}/api/v1/tools/excel/read`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filename,
                sheet_name: sheetName,
                max_rows: maxRows
            })
        });

        if (!response.ok) throw new Error('Failed to read Excel sheet');
        const data = await response.json();
        return data.data;
    }

    async getExcelPreview(filename: string): Promise<Record<string, any[]>> {
        const response = await fetch(`${this.baseUrl}/api/v1/tools/excel/preview/${encodeURIComponent(filename)}`);
        if (!response.ok) throw new Error('Failed to get Excel preview');
        const data = await response.json();
        return data.preview;
    }

    // Vector store operations
    async listVectorStores() {
        const response = await fetch(`${this.baseUrl}/api/v1/vector-stores`);
        if (!response.ok) throw new Error('Failed to list vector stores');
        return response.json();
    }
    
    async searchVectorStore(storeId: string, query: string) {
        const response = await fetch(
            `${this.baseUrl}/api/v1/vector-stores/${storeId}/search?${new URLSearchParams({ query })}`
        );
        if (!response.ok) throw new Error('Failed to search vector store');
        return response.json();
    }
}

// Export a singleton instance
export const apiClient = ApiClient.getInstance();