interface ComposeOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject?: string;
  html?: string;
}

export const KindlyMailSdk = {
  // We use a CORS proxy because the backend does not return Access-Control-Allow-Origin headers for our domain.
  // In a production environment where you control the backend, you would configure CORS on the server instead.
  serverUrl: 'https://corsproxy.io/?https://backend-bice-eight-41.vercel.app',
  token: null as string | null,

  init(token: string) {
    this.token = token;
  },

  async compose(options: ComposeOptions) {
    if (!this.token) {
      throw new Error("KindlyMail SDK not initialized with token.");
    }

    const to = Array.isArray(options.to) ? options.to : options.to.split(',').map(e => e.trim());
    const cc = options.cc ? (Array.isArray(options.cc) ? options.cc : options.cc.split(',').map(e => e.trim())) : [];
    const bcc = options.bcc ? (Array.isArray(options.bcc) ? options.bcc : options.bcc.split(',').map(e => e.trim())) : [];

    try {
        const response = await fetch(`${this.serverUrl}/api/compose`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: this.token,
            to,
            cc,
            bcc,
            subject: options.subject || '',
            html: options.html || ''
          })
        });

        if (!response.ok) {
            // Attempt to parse error JSON, fallback to status text
            const errText = await response.text();
            let errMsg = response.statusText;
            try {
                const jsonErr = JSON.parse(errText);
                errMsg = jsonErr.error || errMsg;
            } catch (e) {
                errMsg = errText || errMsg;
            }
            throw new Error(`Server Error (${response.status}): ${errMsg}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error("SDK Error:", error);
        // Provide a user-friendly error if it looks like a network/CORS issue that persisted
        if (error.message === 'Failed to fetch') {
            throw new Error("Network error. The backend might be unreachable or blocking the request.");
        }
        throw error;
    }
  }
};