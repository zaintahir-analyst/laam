import nodemailer from 'nodemailer';

// --- HTML EMAIL TEMPLATE HELPERS ---
const emailStyle = `font-family:'DM Sans',Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border:1px solid #e8e4db;border-radius:12px;overflow:hidden;`;
const emailHeader = (bgColor = '#1a4a2e') => `<div style="background:${bgColor};padding:20px 28px"><div style="font-family:'Georgia',serif;font-size:20px;font-weight:600;color:#fff">LAAM Analytics</div><div style="font-size:11px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.1em;margin-top:3px">Request Tracker</div></div>`;
const emailFooter = `<div style="background:#f5f3ee;padding:14px 28px;font-size:11px;color:#a8a49a;border-top:1px solid #e8e4db;line-height:1.5;">This is an automated notification from the LAAM Analytics team.<br><strong>Need to respond?</strong> Just reply directly to this email.</div>`;

const ticketBlock = (record) => {
  const rows = [
    ['Ticket ID', record.ticket_id],
    ['Title', record.title],
    ['Team', record.team],
    ['Priority', record.priority],
    ['Status', record.status || 'New'],
  ].map(([l, v]) => `<tr><td style="padding:7px 0;font-size:11px;color:#a8a49a;font-family:monospace;text-transform:uppercase;width:130px;vertical-align:top">${l}</td><td style="padding:7px 0;font-size:13px;color:#1a1a18">${v}</td></tr>`).join('');
  return `<table style="width:100%;border-collapse:collapse;margin-top:16px;margin-bottom:16px">${rows}</table>`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { type, record, old_record } = req.body;
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const teamEmails = "zain.tahir@laam.pk, zarrar.ahmed@laam.pk";
    const requesterEmail = record.email;

    // ==========================================
    // TRIGGER A: NEW TICKET SUBMITTED
    // ==========================================
    if (type === 'INSERT') {
      
      // Email Team
      await transporter.sendMail({
        from: `"LAAM Analytics" <${process.env.GMAIL_USER}>`,
        to: teamEmails,
        subject: `[New Request] ${record.ticket_id} — ${record.title}`,
        html: `<div style="${emailStyle}">${emailHeader()}
          <div style="padding:24px 28px">
            <div style="font-size:14px;color:#1a1a18;margin-bottom:12px"><strong>${record.submitter}</strong> submitted a new analytics request.</div>
            ${ticketBlock(record)}
            <div style="padding:12px 14px;background:#f5f3ee;border-radius:8px;font-size:13px;color:#1a1a18;line-height:1.6"><strong>Description:</strong><br>${record.description}</div>
          </div>
        ${emailFooter}</div>`
      });

      // Email Requester
      if (requesterEmail) {
        await transporter.sendMail({
          from: `"LAAM Analytics" <${process.env.GMAIL_USER}>`,
          to: requesterEmail,
          subject: `Request Received: ${record.ticket_id}`,
          html: `<div style="${emailStyle}">${emailHeader()}
            <div style="padding:24px 28px">
              <div style="font-size:16px;font-weight:600;margin-bottom:6px">Request received, ${record.submitter}.</div>
              <div style="font-size:13px;color:#6b6860;line-height:1.6">Your analytics request has been logged. The team will review it shortly. Keep this email for your records, or reply to it to add more context.</div>
              ${ticketBlock(record)}
            </div>
          ${emailFooter}</div>`
        });
      }
    }

    // ==========================================
    // TRIGGER B: TICKET UPDATED
    // ==========================================
    if (type === 'UPDATE' && old_record) {
      
      const userWantsToNotify = record.notify_update !== false; 

      // 1. Status Change
      if (userWantsToNotify && record.status !== old_record.status) {
        const recipients = requesterEmail ? `${requesterEmail}, ${teamEmails}` : teamEmails;
        
        // Color code the header based on status
        const statusColor = { 'New': '#1a4a2e', 'In Progress': '#4a1a6b', 'Review': '#b8621a', 'Blocked': '#c0392b', 'Done': '#1a4a2e' }[record.status] || '#1a4a2e';

        await transporter.sendMail({
          from: `"LAAM Analytics" <${process.env.GMAIL_USER}>`,
          to: recipients,
          subject: `Status Update: ${record.ticket_id} is now ${record.status}`,
          html: `<div style="${emailStyle}">${emailHeader(statusColor)}
            <div style="padding:24px 28px">
              <div style="font-size:16px;font-weight:600;margin-bottom:6px">Update on your request</div>
              <div style="font-size:13px;color:#6b6860;margin-bottom:20px;line-height:1.6">Hi ${record.submitter}, there's been an update to your analytics request.</div>
              <div style="padding:14px 18px;background:#f5f3ee;border-radius:10px;margin-bottom:18px;display:flex;align-items:center;gap:12px">
                <div>
                  <div style="font-size:11px;color:#a8a49a;font-family:monospace;text-transform:uppercase">Status updated to</div>
                  <div style="font-size:18px;font-weight:600;color:${statusColor};margin-top:2px">${record.status}</div>
                </div>
              </div>
              ${ticketBlock(record)}
            </div>
          ${emailFooter}</div>`
        });
      }

      // 2. New Comment
      const oldComments = typeof old_record.comments === 'string' ? JSON.parse(old_record.comments || '[]') : (old_record.comments || []);
      const newComments = typeof record.comments === 'string' ? JSON.parse(record.comments || '[]') : (record.comments || []);

      if (newComments.length > oldComments.length) {
        const latestComment = newComments[newComments.length - 1];
        const commentText = latestComment.text || JSON.stringify(latestComment);
        const authorName = latestComment.author || "Team Member";
        const commentRecipients = requesterEmail ? `${requesterEmail}, ${teamEmails}` : teamEmails;

        await transporter.sendMail({
          from: `"LAAM Analytics" <${process.env.GMAIL_USER}>`,
          to: commentRecipients, 
          subject: `New Comment on ${record.ticket_id}`,
          html: `<div style="${emailStyle}">${emailHeader()}
            <div style="padding:24px 28px">
              <div style="font-size:14px;color:#1a1a18;margin-bottom:16px"><strong>${authorName}</strong> left a new comment on your request:</div>
              <div style="padding:16px;background:#fdfdfc;border-left:4px solid #1a4a2e;border-radius:0 8px 8px 0;font-size:14px;color:#1a1a18;line-height:1.6;font-style:italic;">
                "${commentText}"
              </div>
              ${ticketBlock(record)}
            </div>
          ${emailFooter}</div>`
        });
      }
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
