import { Template } from '../types';

export const TEMPLATES: Template[] = [
  {
    id: 'welcome-minimal',
    name: 'Minimal Welcome',
    category: 'Onboarding',
    subject: 'Welcome to the future',
    body: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin: 0; padding: 0; background-color: #fafafa; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;"><div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; padding: 60px 40px; text-align: center;"><h1 style="margin: 0 0 24px; font-size: 32px; font-weight: 700; color: #111;">Welcome aboard.</h1><p style="margin: 0 0 40px; font-size: 18px; line-height: 1.6; color: #555;">You've joined a community of creators building the next generation of digital experiences.</p><a href="#" style="display: inline-block; padding: 16px 32px; background-color: #000; color: #fff; text-decoration: none; border-radius: 50px; font-weight: 600;">Get Started</a></div></body></html>`
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    category: 'E-commerce',
    subject: 'Introducing: The Collection',
    body: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;"><div style="max-width: 600px; margin: 0 auto;"><div style="position: relative;"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" style="width: 100%; display: block;"><div style="position: absolute; bottom: 40px; left: 40px;"><h1 style="margin: 0; font-size: 42px; font-weight: 700;">Object 01</h1><p style="margin: 8px 0 0; font-size: 18px; opacity: 0.9;">Redefining daily essentials.</p></div></div><div style="padding: 60px 40px; text-align: center;"><a href="#" style="display: inline-block; padding: 18px 48px; background-color: #ffffff; color: #000000; text-decoration: none; border-radius: 4px; font-weight: 700;">Shop Now</a></div></div></body></html>`
  },
  {
    id: 'neural-ide',
    name: 'Neural IDE',
    category: 'Newsletter',
    subject: 'NEURAL_IDE // WEEKLY_DUMP',
    body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>NEURAL_IDE // WEEKLY_DUMP</title><link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet"><style>body{margin:0;padding:0;background-color:#050505;font-family:'VT323',monospace;color:#ccc}.scanline{background:linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,0) 50%,rgba(0,0,0,0.2) 50%,rgba(0,0,0,0.2));background-size:100% 4px;position:fixed;inset:0;pointer-events:none;opacity:0.1}.container{max-width:640px;margin:0 auto;background:#000;border-left:2px solid #333;border-right:2px solid #333}.header{padding:24px;border-bottom:2px solid #333;background:#09090b}.brand{color:#33ff00;font-size:48px;line-height:1;text-transform:uppercase;text-shadow:0 0 10px rgba(51,255,0,0.4);margin:0}.hero{padding:32px;border-bottom:2px solid #333;background-image:url('https://www.transparenttextures.com/patterns/diagmonds-light.png')}.box{border:2px solid #33ff00;background:#000;padding:24px;box-shadow:4px 4px 0 #1a8000}.btn{display:inline-block;background:#33ff00;color:#000;padding:8px 24px;font-size:24px;text-decoration:none;font-weight:bold;text-transform:uppercase;box-shadow:4px 4px 0 #1a8000;margin-top:16px}.section{padding:32px;border-bottom:2px solid #333}.code{background:#111;border:1px solid #333;padding:16px;font-family:monospace;color:#bc13fe;position:relative}.footer{padding:32px;text-align:center;background:#000;color:#666}</style></head><body><div class="scanline"></div><div class="container"><header class="header"><p style="font-size:12px;color:#666;margin:0 0 4px 0">ISSUE_042 // BUILD_99.1A</p><h1 class="brand">Neural<br>IDE</h1></header><div class="hero"><div class="box"><p style="color:#33ff00;margin:0 0 8px 0">$ cat message_from_dev.txt</p><p style="font-size:24px;line-height:1.2;color:#fff;margin:0 0 16px 0">The compiler is watching.<br>Version 4.0 is finally stable.</p><p style="color:#888;margin:0">We've refactored the predictive engine. Autocomplete now predicts your bugs before you write them.</p><a href="#" class="btn">Download v4.0</a></div></div><div class="section"><h2 style="color:#bc13fe;font-size:32px;margin:0 0 16px 0;text-transform:uppercase">Cognitive Intellisense</h2><div class="code">def optimize_reality(self):<br>&nbsp;&nbsp;<span style="color:#888"># AI Generated</span><br>&nbsp;&nbsp;return self.conscious</div></div><div class="footer"><p>NEURAL_IDE Inc. Void Sector.</p><a href="#" style="color:#666">Unsubscribe</a></div></div></body></html>`
  },
  {
    id: 'saas-welcome',
    name: 'SaaS Welcome Series',
    category: 'SaaS',
    subject: 'Let’s set up your workspace',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
    <div style="background:#4F46E5;padding:40px 40px 30px;text-align:center;">
      <img src="https://cdn-icons-png.flaticon.com/512/4206/4206001.png" width="48" style="background:#fff;padding:12px;border-radius:12px;margin-bottom:20px;">
      <h1 style="color:#fff;margin:0;font-size:24px;">Welcome to Aura.</h1>
    </div>
    <div style="padding:40px;">
      <p style="color:#374151;font-size:16px;line-height:1.6;">Hello there,</p>
      <p style="color:#374151;font-size:16px;line-height:1.6;">Thanks for joining. You're now part of a community of 50,000+ teams moving faster than ever. To help you get the most out of your trial, we've put together a quick checklist.</p>
      
      <div style="background:#F9FAFB;border-radius:12px;padding:24px;margin:24px 0;">
        <div style="display:flex;align-items:center;margin-bottom:16px;">
          <div style="width:24px;height:24px;background:#D1D5DB;border-radius:50%;margin-right:12px;"></div>
          <span style="color:#111827;font-weight:500;">Complete your profile</span>
        </div>
        <div style="display:flex;align-items:center;margin-bottom:16px;">
          <div style="width:24px;height:24px;background:#D1D5DB;border-radius:50%;margin-right:12px;"></div>
          <span style="color:#111827;font-weight:500;">Create your first project</span>
        </div>
        <div style="display:flex;align-items:center;">
          <div style="width:24px;height:24px;background:#D1D5DB;border-radius:50%;margin-right:12px;"></div>
          <span style="color:#111827;font-weight:500;">Invite your team members</span>
        </div>
      </div>

      <a href="#" style="display:block;width:100%;text-align:center;background:#4F46E5;color:#fff;padding:16px 0;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:32px;">Go to Dashboard</a>
    </div>
    <div style="background:#F9FAFB;padding:24px;text-align:center;border-top:1px solid #E5E7EB;">
      <p style="font-size:12px;color:#6B7280;margin:0;">&copy; 2026 Aura Inc. 123 Innovation Dr, Tech City.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'fashion-collection',
    name: 'Fashion Collection',
    category: 'E-commerce',
    subject: 'Spring / Summer 2026',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Times New Roman', Times, serif;">
  <div style="max-width:640px;margin:0 auto;">
    <div style="text-align:center;padding:30px 0;">
      <span style="font-size:24px;letter-spacing:4px;font-weight:bold;text-transform:uppercase;">Atelier</span>
    </div>
    
    <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80" style="width:100%;display:block;">
    
    <div style="padding:60px 40px;text-align:center;">
      <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#666;margin-bottom:16px;">New Arrivals</p>
      <h1 style="font-size:36px;margin:0 0 24px 0;font-weight:400;line-height:1.2;">The Earth Tones<br>Collection</h1>
      <p style="font-size:16px;color:#444;line-height:1.6;max-width:400px;margin:0 auto 40px;">Designed for the modern wanderer. Sustainable fabrics meet timeless silhouettes in our latest drop.</p>
      <a href="#" style="display:inline-block;border:1px solid #000;color:#000;padding:16px 40px;text-decoration:none;text-transform:uppercase;font-size:12px;letter-spacing:1px;transition:0.3s;">Shop Collection</a>
    </div>

    <div style="display:flex;flex-wrap:wrap;">
      <div style="width:50%;box-sizing:border-box;padding:0 10px 20px 20px;">
         <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" style="width:100%;display:block;margin-bottom:12px;">
         <h3 style="margin:0;font-size:14px;font-weight:400;">Linen Blazer</h3>
         <p style="margin:4px 0 0;color:#666;font-size:14px;">$180.00</p>
      </div>
      <div style="width:50%;box-sizing:border-box;padding:0 20px 20px 10px;">
         <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80" style="width:100%;display:block;margin-bottom:12px;">
         <h3 style="margin:0;font-size:14px;font-weight:400;">Silk Tunic</h3>
         <p style="margin:4px 0 0;color:#666;font-size:14px;">$120.00</p>
      </div>
    </div>
    
    <div style="background:#F5F5F5;padding:40px;text-align:center;margin-top:40px;">
       <p style="font-family:Arial,sans-serif;font-size:10px;color:#999;letter-spacing:1px;text-transform:uppercase;">Free Shipping Worldwide</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'editorial-digest',
    name: 'Editorial Digest',
    category: 'Newsletter',
    subject: 'Sunday Read: The Quiet Revolution',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#FDFBF7;font-family:Georgia, serif;color:#1A1A1A;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="border-bottom:1px solid #E5E5E5;padding-bottom:20px;margin-bottom:40px;text-align:center;">
      <span style="font-family:'Helvetica Neue',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#888;">Issue #142 • May 12, 2026</span>
      <h1 style="font-size:28px;margin:16px 0 0;letter-spacing:-0.5px;">The Weekly Journal</h1>
    </div>

    <img src="https://images.unsplash.com/photo-1499750310159-525446b095df?auto=format&fit=crop&w=1200&q=80" style="width:100%;display:block;border-radius:4px;margin-bottom:32px;filter:grayscale(20%);">

    <h2 style="font-size:24px;line-height:1.3;margin-bottom:16px;">The Art of Slowing Down</h2>
    <p style="font-size:18px;line-height:1.8;color:#333;margin-bottom:24px;">
      In a world obsessed with speed, there is a quiet revolution happening in the margins. It’s not about doing less, but about doing things with deliberate intent. We explore how creators are finding more meaning by subtracting the noise.
    </p>
    <p style="font-size:18px;line-height:1.8;color:#333;margin-bottom:32px;">
      "Focus is not saying yes to the one thing you prioritize, it's saying no to the hundred other good ideas that there are."
    </p>
    <a href="#" style="font-family:'Helvetica Neue',sans-serif;font-size:14px;font-weight:bold;color:#1A1A1A;text-decoration:underline;text-underline-offset:4px;">Read the full story &rarr;</a>

    <div style="margin-top:60px;padding-top:40px;border-top:1px solid #E5E5E5;">
      <h3 style="font-family:'Helvetica Neue',sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:24px;">Curated Links</h3>
      
      <div style="margin-bottom:24px;">
        <a href="#" style="text-decoration:none;font-size:16px;font-weight:bold;color:#1A1A1A;">Design Engineering in 2026</a>
        <p style="margin:4px 0 0;font-size:14px;color:#666;font-family:'Helvetica Neue',sans-serif;">A deep dive into the merging roles.</p>
      </div>
      
      <div style="margin-bottom:24px;">
        <a href="#" style="text-decoration:none;font-size:16px;font-weight:bold;color:#1A1A1A;">The Typography of Transit</a>
        <p style="margin:4px 0 0;font-size:14px;color:#666;font-family:'Helvetica Neue',sans-serif;">How wayfinding systems shape our cities.</p>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'feature-spotlight',
    name: 'Feature Spotlight',
    category: 'SaaS',
    subject: 'Introducing Dark Mode',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#111111;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ffffff;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="text-align:center;padding:60px 20px;">
      <span style="background:rgba(255,255,255,0.1);color:#fff;font-size:10px;font-weight:bold;padding:4px 12px;border-radius:100px;text-transform:uppercase;letter-spacing:1px;">New Update 2.4</span>
      
      <h1 style="font-size:48px;font-weight:800;letter-spacing:-1px;margin:32px 0 16px;background:linear-gradient(to right, #fff, #888);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Lights out.</h1>
      
      <p style="font-size:18px;color:#888;max-width:400px;margin:0 auto 40px;line-height:1.5;">Experience your workflow in a whole new light. Or lack thereof. Our most requested feature is finally here.</p>
      
      <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" style="width:100%;border-radius:16px;box-shadow:0 0 0 1px rgba(255,255,255,0.1);margin-bottom:40px;">
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;text-align:left;margin-bottom:40px;">
        <div style="background:rgba(255,255,255,0.05);padding:24px;border-radius:16px;">
          <h3 style="margin:0 0 8px 0;font-size:16px;">True Black</h3>
          <p style="margin:0;font-size:14px;color:#666;">Optimized for OLED displays.</p>
        </div>
        <div style="background:rgba(255,255,255,0.05);padding:24px;border-radius:16px;">
          <h3 style="margin:0 0 8px 0;font-size:16px;">Auto-Switch</h3>
          <p style="margin:0;font-size:14px;color:#666;">Syncs with your system settings.</p>
        </div>
      </div>

      <a href="#" style="display:inline-block;background:#fff;color:#000;padding:16px 40px;border-radius:100px;text-decoration:none;font-weight:bold;font-size:16px;">Enable Dark Mode</a>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'transaction-receipt',
    name: 'Modern Receipt',
    category: 'Transactional',
    subject: 'Receipt for your recent payment',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F5F5F5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:500px;margin:40px auto;background:#fff;border-radius:8px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;">
      <div style="font-weight:bold;font-size:20px;">Acme Inc.</div>
      <div style="color:#888;font-size:14px;">#INV-2024-001</div>
    </div>

    <div style="text-align:center;margin-bottom:40px;">
      <div style="font-size:14px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Amount Paid</div>
      <div style="font-size:48px;font-weight:bold;color:#111;">$129.00</div>
      <div style="font-size:14px;color:#22C55E;margin-top:8px;background:#DCFCE7;display:inline-block;padding:4px 12px;border-radius:100px;">Paid on May 12, 2026</div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:30px;">
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding:16px 0;color:#111;">Pro Plan (Yearly)</td>
        <td style="padding:16px 0;text-align:right;color:#111;">$129.00</td>
      </tr>
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding:16px 0;color:#666;">Tax</td>
        <td style="padding:16px 0;text-align:right;color:#666;">$0.00</td>
      </tr>
      <tr>
        <td style="padding:16px 0;font-weight:bold;">Total</td>
        <td style="padding:16px 0;text-align:right;font-weight:bold;">$129.00</td>
      </tr>
    </table>

    <div style="background:#F9FAFB;padding:20px;border-radius:8px;margin-bottom:30px;">
      <div style="font-size:12px;color:#666;margin-bottom:4px;">Payment Method</div>
      <div style="font-size:14px;color:#111;font-weight:500;">Visa ending in 4242</div>
    </div>

    <div style="text-align:center;">
      <a href="#" style="color:#3B82F6;text-decoration:none;font-size:14px;">Download PDF Invoice</a>
    </div>
  </div>
  <div style="text-align:center;color:#999;font-size:12px;margin-bottom:40px;">
    Questions? Contact support@acme.inc
  </div>
</body>
</html>`
  },
  {
    id: 'webinar-invite',
    name: 'Webinar Invitation',
    category: 'Events',
    subject: 'Mastering AI Design Workflows',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="background:#2563EB;padding:60px 40px;color:#fff;border-radius:0 0 24px 24px;">
      <div style="font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;background:rgba(255,255,255,0.2);display:inline-block;padding:4px 12px;border-radius:100px;margin-bottom:24px;">Live Webinar</div>
      <h1 style="font-size:36px;margin:0 0 16px 0;line-height:1.2;">Mastering AI Design Workflows in 2026</h1>
      <p style="font-size:18px;opacity:0.9;max-width:480px;">Join us for a deep dive into generative UI, automated asset creation, and the future of creative tooling.</p>
    </div>

    <div style="padding:40px;">
      <div style="display:flex;gap:20px;margin-bottom:40px;">
        <div style="flex:1;background:#F3F4F6;padding:20px;border-radius:12px;text-align:center;">
          <div style="font-size:24px;font-weight:bold;color:#111;margin-bottom:4px;">12</div>
          <div style="font-size:12px;color:#666;text-transform:uppercase;">May</div>
        </div>
        <div style="flex:1;background:#F3F4F6;padding:20px;border-radius:12px;text-align:center;">
          <div style="font-size:24px;font-weight:bold;color:#111;margin-bottom:4px;">10:00</div>
          <div style="font-size:12px;color:#666;text-transform:uppercase;">AM PST</div>
        </div>
      </div>

      <div style="margin-bottom:40px;">
        <h3 style="font-size:14px;color:#666;text-transform:uppercase;margin-bottom:16px;">Hosted by</h3>
        <div style="display:flex;align-items:center;">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" style="width:50px;height:50px;border-radius:50%;margin-right:16px;">
          <div>
            <div style="font-weight:bold;color:#111;">Sarah Jenks</div>
            <div style="font-size:14px;color:#666;">Product Design Lead</div>
          </div>
        </div>
      </div>

      <a href="#" style="display:block;background:#2563EB;color:#fff;text-align:center;padding:18px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px;">Save my spot</a>
      <p style="text-align:center;font-size:14px;color:#666;margin-top:16px;">Can't make it? Register to get the recording.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'luxury-real-estate',
    name: 'Luxury Real Estate',
    category: 'Real Estate',
    subject: 'Just Listed: The Penthouse',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F2F2F2;font-family:'Times New Roman', serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;">
    <img src="https://images.unsplash.com/photo-1600596542815-2495db98dada?auto=format&fit=crop&w=1200&q=80" style="width:100%;display:block;">
    
    <div style="padding:50px 40px;text-align:center;">
      <h2 style="font-family:'Helvetica Neue', sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-bottom:16px;">Tribeca, New York</h2>
      <h1 style="font-size:32px;margin:0 0 16px 0;font-weight:400;">The Hudson Penthouse</h1>
      <div style="width:40px;height:1px;background:#000;margin:24px auto;"></div>
      <p style="font-size:16px;line-height:1.6;color:#444;margin-bottom:32px;">
        Floor-to-ceiling windows, private terrace, and bespoke finishes throughout. Experience unparalleled city views from this 4,000 sq ft masterpiece.
      </p>
      
      <div style="display:flex;justify-content:center;gap:32px;margin-bottom:40px;font-family:'Helvetica Neue', sans-serif;font-size:14px;">
        <div><strong>4</strong> Beds</div>
        <div><strong>3.5</strong> Baths</div>
        <div><strong>$12.5M</strong></div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:40px;">
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80" style="width:100%;display:block;">
        <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=600&q=80" style="width:100%;display:block;">
      </div>

      <a href="#" style="font-family:'Helvetica Neue', sans-serif;display:inline-block;background:#000;color:#fff;padding:16px 32px;text-decoration:none;text-transform:uppercase;font-size:12px;letter-spacing:1px;">Schedule Viewing</a>
    </div>
    
    <div style="background:#1a1a1a;color:#fff;padding:40px;text-align:center;font-family:'Helvetica Neue', sans-serif;">
      <p style="margin:0;font-size:12px;letter-spacing:1px;">LUXE ESTATES GROUP</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'minimalist-letter',
    name: 'Minimalist Letter',
    category: 'Personal',
    subject: 'A personal note',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;color:#333;">
  <div style="max-width:540px;margin:60px auto;padding:0 20px;">
    <img src="https://via.placeholder.com/40x40/000000/ffffff?text=JM" style="width:40px;height:40px;border-radius:50%;margin-bottom:40px;">
    
    <p style="font-size:18px;line-height:1.6;margin-bottom:24px;">Hi there,</p>
    
    <p style="font-size:18px;line-height:1.6;margin-bottom:24px;">
      I wanted to reach out personally to thank you for your support over the last year. We've been building quietly, and your feedback has been instrumental in shaping what we're about to launch.
    </p>
    
    <p style="font-size:18px;line-height:1.6;margin-bottom:24px;">
      Simplicity is at the core of everything we do. We believe that by removing the unnecessary, the necessary may speak.
    </p>

    <p style="font-size:18px;line-height:1.6;margin-bottom:40px;">
      Stay tuned for next week.
    </p>

    <div style="border-top:1px solid #eee;padding-top:24px;">
      <p style="font-size:18px;font-weight:bold;margin:0;">James Morris</p>
      <p style="font-size:14px;color:#888;margin:4px 0 0;">Founder, Studio</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'fitness-motivation',
    name: 'Fitness Motivation',
    category: 'Health',
    subject: 'Your weekly progress report',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#000000;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ffffff;">
  <div style="max-width:600px;margin:0 auto;background:#121212;">
    <div style="padding:40px;background:linear-gradient(45deg, #FF3B30, #FF9500);">
      <h1 style="font-size:32px;font-weight:900;font-style:italic;margin:0;text-transform:uppercase;">Keep Pushing.</h1>
    </div>
    
    <div style="padding:40px;">
      <div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:24px;">
        <h2 style="margin:0;font-size:20px;">Weekly Activity</h2>
        <span style="color:#FF9500;font-weight:bold;">Top 5%</span>
      </div>

      <div style="display:flex;gap:10px;height:120px;align-items:flex-end;margin-bottom:40px;">
        <div style="flex:1;background:#333;height:40%;border-radius:4px;"></div>
        <div style="flex:1;background:#333;height:60%;border-radius:4px;"></div>
        <div style="flex:1;background:#FF3B30;height:90%;border-radius:4px;"></div>
        <div style="flex:1;background:#333;height:50%;border-radius:4px;"></div>
        <div style="flex:1;background:#333;height:70%;border-radius:4px;"></div>
        <div style="flex:1;background:#333;height:30%;border-radius:4px;"></div>
        <div style="flex:1;background:#333;height:80%;border-radius:4px;"></div>
      </div>

      <div style="background:#222;border-radius:16px;padding:24px;display:flex;align-items:center;gap:20px;margin-bottom:20px;">
        <div style="width:60px;height:60px;background:#FF9500;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:20px;color:#000;">3</div>
        <div>
          <h3 style="margin:0 0 4px 0;font-size:16px;">Workouts completed</h3>
          <p style="margin:0;color:#888;font-size:14px;">You crushed your goal this week!</p>
        </div>
      </div>

      <a href="#" style="display:block;text-align:center;background:#fff;color:#000;font-weight:bold;text-decoration:none;padding:16px;border-radius:8px;text-transform:uppercase;margin-top:40px;">View Full Stats</a>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'culinary-delight',
    name: 'Culinary Delight',
    category: 'Food',
    subject: 'Menu of the week',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#FFF8F0;font-family:'Georgia', serif;color:#4A3B32;">
  <div style="max-width:600px;margin:0 auto;background:#fff;box-shadow:0 10px 30px rgba(0,0,0,0.05);">
    <div style="text-align:center;padding:40px;">
      <div style="font-family:'Helvetica Neue',sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#D97706;margin-bottom:16px;">Taste of Italy</div>
      <h1 style="font-size:36px;margin:0;font-style:italic;">The Tuscan Table</h1>
    </div>

    <img src="https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=1200&q=80" style="width:100%;display:block;">

    <div style="padding:40px;">
      <p style="text-align:center;font-size:18px;line-height:1.6;margin-bottom:40px;">
        This week, we're bringing the rolling hills of Tuscany to your doorstep. Fresh handmade pasta, sun-ripened tomatoes, and robust olive oils.
      </p>

      <div style="border-top:1px solid #F3E6D5;border-bottom:1px solid #F3E6D5;padding:30px 0;margin-bottom:40px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:20px;">
          <div>
            <h3 style="margin:0;font-size:18px;">Pappardelle al Cinghiale</h3>
            <p style="margin:4px 0 0;font-size:14px;color:#888;font-family:sans-serif;">Wild boar ragu, parmesan</p>
          </div>
          <div style="font-weight:bold;font-family:sans-serif;">$24</div>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <div>
            <h3 style="margin:0;font-size:18px;">Burrata & Figs</h3>
            <p style="margin:4px 0 0;font-size:14px;color:#888;font-family:sans-serif;">Balsamic glaze, toasted nuts</p>
          </div>
          <div style="font-weight:bold;font-family:sans-serif;">$18</div>
        </div>
      </div>

      <a href="#" style="display:block;text-align:center;background:#D97706;color:#fff;font-family:'Helvetica Neue',sans-serif;font-weight:bold;text-decoration:none;padding:16px;border-radius:4px;text-transform:uppercase;letter-spacing:1px;">Order Now</a>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'wanderlust-travel',
    name: 'Wanderlust Travel',
    category: 'Travel',
    subject: 'Escape to Bali',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F0F9FF;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;">
    <div style="position:relative;">
      <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80" style="width:100%;display:block;height:400px;object-fit:cover;">
      <div style="position:absolute;bottom:0;left:0;right:0;padding:40px;background:linear-gradient(to top, rgba(0,0,0,0.8), transparent);">
        <h1 style="color:#fff;margin:0;font-size:42px;">Bali awaits.</h1>
        <p style="color:#fff;opacity:0.9;margin:8px 0 0;font-size:18px;">7 Nights from $899</p>
      </div>
    </div>
    
    <div style="padding:40px;">
      <p style="font-size:18px;line-height:1.6;color:#333;margin-bottom:30px;">
        Immerse yourself in the lush jungles of Ubud. Wake up to the sound of nature, practice yoga at sunrise, and discover hidden waterfalls.
      </p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px;">
         <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80" style="width:100%;height:150px;object-fit:cover;border-radius:12px;">
         <img src="https://images.unsplash.com/photo-1552160753-f1397c6d7cc8?auto=format&fit=crop&w=600&q=80" style="width:100%;height:150px;object-fit:cover;border-radius:12px;">
      </div>

      <a href="#" style="display:block;text-align:center;background:#0EA5E9;color:#fff;font-weight:bold;text-decoration:none;padding:18px;border-radius:100px;">View Itinerary</a>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'corporate-update',
    name: 'Corporate Update',
    category: 'Corporate',
    subject: 'Q2 Company Update',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F5F7FA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-top:4px solid #003366;">
    <div style="padding:40px;">
      <div style="text-align:right;margin-bottom:40px;">
        <img src="https://via.placeholder.com/120x40/ffffff/003366?text=LOGO" style="height:32px;">
      </div>
      
      <h1 style="font-size:28px;color:#003366;margin:0 0 24px 0;">Q2 Performance Update</h1>
      
      <p style="font-size:16px;line-height:1.6;color:#333;margin-bottom:24px;">Team,</p>
      
      <p style="font-size:16px;line-height:1.6;color:#333;margin-bottom:24px;">
        I'm pleased to share that Q2 has been a record-breaking quarter for us. We've exceeded our revenue targets by 15% and launched two major product initiatives.
      </p>

      <div style="background:#F0F4F8;border-left:4px solid #003366;padding:20px;margin:30px 0;">
        <h3 style="margin:0 0 8px 0;font-size:18px;color:#003366;">Key Highlights</h3>
        <ul style="margin:0;padding-left:20px;color:#444;">
          <li style="margin-bottom:8px;">User growth up 22% YoY</li>
          <li style="margin-bottom:8px;">Launched Enterprise API</li>
          <li>Opened new London office</li>
        </ul>
      </div>

      <p style="font-size:16px;line-height:1.6;color:#333;margin-bottom:32px;">
        Thank you for your hard work and dedication. Let's keep this momentum going into the second half of the year.
      </p>

      <p style="font-size:16px;font-weight:bold;color:#003366;margin:0;">John Smith</p>
      <p style="font-size:14px;color:#666;margin:0;">CEO</p>
    </div>
    <div style="background:#003366;color:#fff;padding:20px 40px;font-size:12px;text-align:center;">
      &copy; 2026 Corporation Inc. Confidential.
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'event-ticket',
    name: 'Event Ticket',
    category: 'Events',
    subject: 'Your Ticket for Design Summit',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#EEEEEE;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:400px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,0.1);">
    <div style="background:#000;color:#fff;padding:32px;text-align:center;">
      <h1 style="margin:0;font-size:24px;text-transform:uppercase;letter-spacing:1px;">Design Summit</h1>
      <p style="margin:8px 0 0;opacity:0.7;">San Francisco • 2026</p>
    </div>
    
    <div style="padding:32px;text-align:center;border-bottom:2px dashed #eee;">
      <div style="font-size:12px;color:#888;text-transform:uppercase;margin-bottom:4px;">Attendee</div>
      <div style="font-size:18px;font-weight:bold;margin-bottom:24px;">Alex Johnson</div>
      
      <div style="font-size:12px;color:#888;text-transform:uppercase;margin-bottom:4px;">Date</div>
      <div style="font-size:18px;font-weight:bold;margin-bottom:24px;">Oct 12-14, 2026</div>

      <div style="font-size:12px;color:#888;text-transform:uppercase;margin-bottom:4px;">Venue</div>
      <div style="font-size:18px;font-weight:bold;">Moscone Center</div>
    </div>

    <div style="padding:32px;text-align:center;">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket123456" style="width:120px;height:120px;display:block;margin:0 auto 20px;">
      <p style="margin:0;font-size:12px;color:#888;">Scan this code at the entrance</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'feedback-request',
    name: 'Feedback Request',
    category: 'SaaS',
    subject: 'How did we do?',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F9FAFB;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:60px auto;text-align:center;">
    <h1 style="font-size:24px;color:#111;margin-bottom:16px;">How would you rate your support experience?</h1>
    <p style="font-size:16px;color:#666;margin-bottom:40px;max-width:400px;margin-left:auto;margin-right:auto;">We'd love to hear how our team did on your recent ticket #9231.</p>
    
    <div style="background:#fff;padding:40px;border-radius:16px;box-shadow:0 2px 4px rgba(0,0,0,0.05);display:inline-block;">
      <div style="display:flex;gap:12px;justify-content:center;">
        <a href="#" style="text-decoration:none;font-size:32px;transition:0.2s;display:block;">😡</a>
        <a href="#" style="text-decoration:none;font-size:32px;transition:0.2s;display:block;">😕</a>
        <a href="#" style="text-decoration:none;font-size:32px;transition:0.2s;display:block;">😐</a>
        <a href="#" style="text-decoration:none;font-size:32px;transition:0.2s;display:block;">🙂</a>
        <a href="#" style="text-decoration:none;font-size:32px;transition:0.2s;display:block;">😍</a>
      </div>
    </div>
    
    <p style="font-size:12px;color:#999;margin-top:40px;">If you have more to say, simply reply to this email.</p>
  </div>
</body>
</html>`
  },
  {
    id: 'neon-music',
    name: 'Artist Update',
    category: 'Entertainment',
    subject: 'TOUR ANNOUNCEMENT',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#000000;font-family:'Arial Black', 'Helvetica Neue', sans-serif;color:#ffffff;">
  <div style="max-width:600px;margin:0 auto;text-align:center;padding-bottom:40px;">
    <div style="padding:60px 20px;background-image:url('https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=1200&q=80');background-size:cover;background-position:center;height:300px;display:flex;align-items:center;justify-content:center;">
       <h1 style="font-size:64px;text-transform:uppercase;color:#fff;text-shadow:0 0 20px #FF00FF, 0 0 40px #FF00FF;margin:0;mix-blend-mode:screen;">Neon<br>Nights</h1>
    </div>

    <div style="padding:40px 20px;">
      <h2 style="font-size:32px;text-transform:uppercase;margin-bottom:16px;color:#00FFFF;">World Tour 2026</h2>
      <p style="font-family:'Helvetica Neue', sans-serif;font-size:18px;color:#ccc;margin-bottom:40px;max-width:400px;margin-left:auto;margin-right:auto;">
        We are hitting the road. 20 cities. 3 continents. The loudest show on earth.
      </p>

      <div style="font-family:'Helvetica Neue', sans-serif;text-align:left;max-width:300px;margin:0 auto 40px;border-top:1px solid #333;">
        <div style="padding:16px 0;border-bottom:1px solid #333;display:flex;justify-content:space-between;">
           <span>London</span> <span style="color:#666;">Nov 12</span>
        </div>
        <div style="padding:16px 0;border-bottom:1px solid #333;display:flex;justify-content:space-between;">
           <span>Berlin</span> <span style="color:#666;">Nov 15</span>
        </div>
        <div style="padding:16px 0;border-bottom:1px solid #333;display:flex;justify-content:space-between;">
           <span>Tokyo</span> <span style="color:#666;">Nov 22</span>
        </div>
      </div>

      <a href="#" style="display:inline-block;background:#FF00FF;color:#fff;padding:20px 50px;font-size:20px;text-transform:uppercase;text-decoration:none;transform:skew(-10deg);border:2px solid #fff;">Get Tickets</a>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'secure-banking',
    name: 'Secure Banking',
    category: 'Finance',
    subject: 'Security Alert: New sign-in',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F0F2F5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:8px;border-top:4px solid #0052CC;padding:40px;">
    <img src="https://via.placeholder.com/40x40/0052CC/ffffff?text=B" style="width:40px;height:40px;border-radius:4px;margin-bottom:24px;">
    
    <h1 style="font-size:20px;color:#172B4D;margin:0 0 16px 0;">New sign-in detected</h1>
    
    <p style="font-size:16px;color:#42526E;line-height:1.5;margin-bottom:24px;">
      We detected a new sign-in to your Horizon Bank account from a new device.
    </p>

    <div style="background:#F4F5F7;padding:20px;border-radius:4px;margin-bottom:24px;">
      <div style="font-size:14px;color:#5E6C84;margin-bottom:4px;">Device</div>
      <div style="font-size:14px;color:#172B4D;font-weight:bold;margin-bottom:12px;">iPhone 15 Pro</div>
      
      <div style="font-size:14px;color:#5E6C84;margin-bottom:4px;">Location</div>
      <div style="font-size:14px;color:#172B4D;font-weight:bold;margin-bottom:12px;">San Francisco, CA, USA</div>
      
      <div style="font-size:14px;color:#5E6C84;margin-bottom:4px;">Time</div>
      <div style="font-size:14px;color:#172B4D;font-weight:bold;">May 12, 2026 at 10:42 AM PST</div>
    </div>

    <p style="font-size:14px;color:#42526E;margin-bottom:32px;">
      If this was you, you can ignore this email. If you don't recognize this activity, please secure your account immediately.
    </p>

    <a href="#" style="display:inline-block;background:#DE350B;color:#fff;padding:12px 24px;border-radius:3px;text-decoration:none;font-weight:500;font-size:14px;">Secure Account</a>
  </div>
</body>
</html>`
  },
  {
    id: 'learning-path',
    name: 'Course Progress',
    category: 'Education',
    subject: 'You’re halfway there!',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;margin-top:40px;">
    <div style="background:#10B981;padding:40px;text-align:center;color:#fff;">
      <div style="font-size:64px;font-weight:bold;line-height:1;">50%</div>
      <div style="font-size:18px;opacity:0.9;margin-top:8px;">Course Complete</div>
    </div>
    
    <div style="padding:40px;">
      <h2 style="font-size:24px;margin:0 0 16px 0;color:#111;">Keep up the momentum, Sarah!</h2>
      <p style="font-size:16px;color:#666;line-height:1.6;margin-bottom:32px;">
        You've just completed Module 4: "Advanced React Patterns". You're doing great. Up next is one of our most exciting sections.
      </p>
      
      <div style="border:1px solid #E5E7EB;border-radius:8px;padding:24px;margin-bottom:32px;">
        <div style="font-size:12px;color:#10B981;font-weight:bold;text-transform:uppercase;margin-bottom:8px;">Up Next</div>
        <h3 style="font-size:18px;margin:0 0 8px 0;">Module 5: Server Components</h3>
        <p style="font-size:14px;color:#666;margin:0;">Learn how to leverage the server for faster page loads.</p>
        <div style="margin-top:16px;font-size:12px;color:#999;">🕒 45 mins</div>
      </div>

      <a href="#" style="display:block;background:#111;color:#fff;text-align:center;padding:16px;border-radius:8px;text-decoration:none;font-weight:bold;">Continue Learning</a>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'charity-impact',
    name: 'Charity Impact',
    category: 'Non-Profit',
    subject: 'What your donation made possible',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#F8FAF8;font-family:'Georgia', serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;">
    <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80" style="width:100%;display:block;">
    
    <div style="padding:40px;">
      <h1 style="font-size:32px;color:#111;margin:0 0 24px 0;font-family:'Helvetica Neue',sans-serif;font-weight:bold;">Thank you for being a hero.</h1>
      
      <p style="font-size:18px;line-height:1.8;color:#444;margin-bottom:24px;">
        Because of you, we were able to provide clean water to 3 new villages in the region this month. That's over 400 families who no longer have to walk miles for basic necessities.
      </p>
      
      <div style="background:#F0FDF4;border-radius:8px;padding:24px;margin:32px 0;text-align:center;">
        <div style="font-size:42px;font-weight:bold;color:#15803D;font-family:'Helvetica Neue',sans-serif;">$42,000</div>
        <div style="font-size:14px;color:#15803D;font-family:'Helvetica Neue',sans-serif;">RAISED IN MAY</div>
      </div>

      <p style="font-size:18px;line-height:1.8;color:#444;margin-bottom:32px;">
        "It changes everything for us. My children can go to school instead of fetching water." - Amara, Village Elder
      </p>

      <a href="#" style="color:#15803D;font-family:'Helvetica Neue',sans-serif;font-weight:bold;text-decoration:none;font-size:16px;">Read the full impact report &rarr;</a>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'exclusive-drop',
    name: 'Exclusive Drop',
    category: 'E-commerce',
    subject: 'Access Granted: The Archive',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#EFEFEF;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#EFEFEF;">
    <div style="border:1px solid #000;padding:2px;">
      <div style="border:1px solid #000;padding:40px;text-align:center;background:#fff;">
        <div style="font-size:12px;font-weight:bold;text-transform:uppercase;margin-bottom:20px;letter-spacing:2px;">Members Only</div>
        <h1 style="font-size:64px;margin:0 0 10px 0;line-height:0.9;letter-spacing:-2px;">ARCHIVE<br>SALE</h1>
        <p style="font-size:16px;max-width:300px;margin:20px auto 40px;">Rare items from past seasons. Extremely limited quantities. Once they're gone, they're gone.</p>
        
        <div style="position:relative;margin-bottom:40px;">
           <img src="https://images.unsplash.com/photo-1512353087810-25dfcd100962?auto=format&fit=crop&w=800&q=80" style="width:100%;filter:grayscale(100%) contrast(120%);display:block;">
           <div style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);background:#fff;padding:10px 20px;font-weight:bold;text-transform:uppercase;font-size:12px;">Enter</div>
        </div>

        <a href="#" style="display:inline-block;background:#000;color:#fff;padding:20px 60px;text-decoration:none;font-weight:bold;text-transform:uppercase;letter-spacing:1px;font-size:14px;">Shop The Archive</a>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'win-back',
    name: 'Re-engagement',
    category: 'Marketing',
    subject: 'We miss you (here’s a gift)',
    body: `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;text-align:center;">
    <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" width="120" style="margin-bottom:30px;">
    
    <h1 style="font-size:32px;color:#111;margin-bottom:16px;">It's been a while.</h1>
    <p style="font-size:18px;color:#666;line-height:1.6;margin-bottom:32px;max-width:400px;margin-left:auto;margin-right:auto;">
      We've added a lot of new features since you've been gone. We'd love for you to give us another try.
    </p>
    
    <div style="background:#F9FAFB;padding:32px;border-radius:16px;display:inline-block;margin-bottom:32px;">
      <div style="font-size:14px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Your exclusive offer</div>
      <div style="font-size:42px;font-weight:bold;color:#4F46E5;">30% OFF</div>
      <div style="font-size:14px;color:#111;margin-top:8px;">Use code: <span style="font-family:monospace;background:#eee;padding:2px 6px;border-radius:4px;">COMEBACK30</span></div>
    </div>

    <div>
      <a href="#" style="display:inline-block;background:#111;color:#fff;padding:16px 32px;border-radius:100px;text-decoration:none;font-weight:bold;">Claim Offer</a>
    </div>
    
    <p style="font-size:12px;color:#999;margin-top:40px;">Offer expires in 72 hours.</p>
  </div>
</body>
</html>`
  }
];