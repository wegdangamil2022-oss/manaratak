const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || '/api/v1';
export const ADMIN_BEARER_TOKEN_STORAGE_KEY = 'manaratak_admin_bearer_token';

export const adminApiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem(ADMIN_BEARER_TOKEN_STORAGE_KEY);
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      let errorMessage = `API Error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMessage = errorData.error;
      } catch (e) {
        // ignore JSON parse error
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  listInternationalTests(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<any>(`/admin/international-tests${query}`);
  },

  getInternationalTest(id: string) {
    return this.request<any>(`/admin/international-tests/${id}`);
  },

  listInternationalTestVariants(testId: string) {
    return this.request<any[]>(`/admin/international-tests/${testId}/variants`);
  },

  upsertInternationalTestVariant(testId: string, payload: any) {
    return this.request<any>(`/admin/international-tests/${testId}/variants`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  listInternationalTestSections(testId: string) {
    return this.request<any[]>(`/admin/international-tests/${testId}/sections`);
  },

  upsertInternationalTestSection(testId: string, payload: any) {
    return this.request<any>(`/admin/international-tests/${testId}/sections`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  upsertInternationalTestScoreScale(testId: string, payload: any) {
    return this.request<any>(`/admin/international-tests/${testId}/score-scale`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  upsertInternationalTestFeeMetadata(testId: string, payload: any) {
    return this.request<any>(`/admin/international-tests/${testId}/fees`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  upsertInternationalTestOfficialLink(testId: string, payload: any) {
    return this.request<any>(`/admin/international-tests/${testId}/official-links`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  listInternationalTestAvailability(testId: string) {
    return this.request<any>(`/admin/international-tests/${testId}/availability`);
  },

  upsertInternationalTestAvailability(testId: string, payload: any) {
    return this.request<any>(`/admin/international-tests/${testId}/availability`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  listInternationalTestPreparationMaterials(testId: string) {
    return this.request<any[]>(`/admin/international-tests/${testId}/preparation-materials`);
  },

  upsertInternationalTestPreparationMaterial(testId: string, payload: any) {
    return this.request<any>(`/admin/international-tests/${testId}/preparation-materials`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  listInternationalTestEvidence(testId: string) {
    return this.request<any>(`/admin/international-tests/${testId}/evidence`);
  },

  addInternationalTestEvidence(testId: string, payload: any) {
    return this.request<any>(`/admin/international-tests/${testId}/evidence`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  markInternationalTestReadyToPublish(testId: string) {
    return this.request<any>(`/admin/international-tests/${testId}/mark-publishable`, {
      method: 'POST',
    });
  },

  publishInternationalTest(testId: string) {
    return this.request<any>(`/admin/international-tests/${testId}/publish`, {
      method: 'POST',
    });
  },

  archiveInternationalTest(testId: string) {
    return this.request<any>(`/admin/international-tests/${testId}/archive`, {
      method: 'POST',
    });
  }
};
