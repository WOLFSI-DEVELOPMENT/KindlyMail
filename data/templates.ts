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
  }
];