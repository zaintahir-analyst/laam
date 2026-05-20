// ─────────────────────────────────────────────────────────────────────────────
// LAAM Analytics Tracker — config.js
// Put this file in the same directory as index.html and submit.html.
// Add it to .gitignore — do NOT commit API keys to git.
// ─────────────────────────────────────────────────────────────────────────────

// 1. Supabase — from your Supabase project → Settings → API
window.SUPABASE_URL      = 'https://aeypavbnvxttdagtuxyl.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFleXBhdmJudnh0dGRhZ3R1eHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NTE1NjQsImV4cCI6MjA5NDIyNzU2NH0.S0TBn2V8RvC6wDKuqz2Zg25SYMrqfoge5VVwqEfIxzA';

// 2. Resend — from resend.com → API Keys → Create API Key
//    Free tier: 3,000 emails/month, 100/day. No limits beyond that for paid.
//    IMPORTANT: RESEND_FROM must use a domain you've verified in Resend.
//    Until you verify a domain, use the sandbox sender below (only delivers to
//    your own verified email address, good for testing):
window.RESEND_API_KEY = 're_7RUBdRcu_J9FD9cioAuiB4qDv3H5yhFXJ';
window.RESEND_FROM    = 'LAAM Analytics <noreply@yourdomain.com>';
//    Once you verify laam.pk in Resend DNS settings, change the above to:
//    window.RESEND_FROM = 'LAAM Analytics <noreply@laam.pk>';

// 3. Who gets notified on every new request submission
//    Add or remove emails from this array freely.
window.NOTIFY_EMAILS = [
  'zain.tahir@laam.pk',
  'zarrar.ahmed@laam.pk'   // ← update to Zarrar's actual email
];
