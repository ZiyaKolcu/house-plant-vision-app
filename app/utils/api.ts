const timeoutPromise = (ms: number, message: string): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout after ${ms}ms: ${message}`));
    }, ms);
  });
};

export async function fetchData<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const controller = new AbortController();
    const signal = options?.signal || controller.signal;
    const fetchOptions = { ...options, signal };

    const response = await Promise.race([
      fetch(url, fetchOptions),
      timeoutPromise(30000, `Request to ${url} timed out`),
    ]);

    if (!response.ok) {
      let errorDetail = '';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorDetail = JSON.stringify(errorData);
        } else {
          errorDetail = await response.text();
        }
      } catch (e) {}

      throw new Error(
        `API Error: ${response.status} ${response.statusText}${
          errorDetail ? ` - ${errorDetail}` : ''
        }`
      );
    }

    const contentType = response.headers.get('content-type');

    if (
      options?.method === 'DELETE' ||
      !contentType ||
      response.headers.get('content-length') === '0'
    ) {
      return {} as T;
    }

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return {} as T;
    }
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      console.log('Request aborted:', url);
    } else {
      console.error('Fetch error:', error);
    }
    throw error;
  }
}

export async function uploadFile(
  url: string,
  formData: FormData,
  options?: {
    token?: string;
    signal?: AbortSignal;
  }
): Promise<any> {
  try {
    const controller = new AbortController();
    const signal = options?.signal || controller.signal;

    const headers: Record<string, string> = {};
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await Promise.race([
      fetch(url, {
        method: 'POST',
        body: formData,
        headers,
        signal,
      }),
      timeoutPromise(30000, `Upload to ${url} timed out`),
    ]);

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function fetchBlob(
  url: string,
  options?: RequestInit
): Promise<Blob> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('API Error');
    }
    return await response.blob();
  } catch (error) {
    throw error;
  }
}

export default fetchData;
