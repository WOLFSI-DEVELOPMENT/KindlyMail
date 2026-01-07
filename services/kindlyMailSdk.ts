interface ComposeOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject?: string;
  html?: string;
}

export const KindlyMailSdk = {
  serverUrl: 'https://backend-5r4si90ry-emanuels-projects-2b249438.vercel.app',
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
          headers: { 'Content-Type': 'application/json' },
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
            const err = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(err.error || response.statusText);
        }

        return await response.json();
    } catch (error) {
        console.error("SDK Error:", error);
        throw error;
    }
  }
};