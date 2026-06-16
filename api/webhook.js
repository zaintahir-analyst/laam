import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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

    // A: NEW TICKET SUBMITTED
    if (type === 'INSERT') {
      await transporter.sendMail({
        from: `"LAAM Analytics" <${process.env.GMAIL_USER}>`,
        to: teamEmails,
        subject: `[New Request] ${record.ticket_id} — ${record.title}`,
        text: `A new analytics request has been submitted by ${record.submitter}.\n\nPriority: ${record.priority}\nTeam: ${record.team}\nType: ${record.format}\n\nDescription:\n${record.description}\n\nPlease review this in the tracker.`
      });

      if (requesterEmail) {
        await transporter.sendMail({
          from: `"LAAM Analytics" <${process.env.GMAIL_USER}>`,
          to: requesterEmail,
          subject: `Request Received: ${record.ticket_id}`,
          text: `Hi ${record.submitter},\n\nWe have received your analytics request and our team will review it shortly. Keep this email for your records.\n\nTicket ID: ${record.ticket_id}\nTitle: ${record.title}`
        });
      }
    }

    // B: TICKET UPDATED
    if (type === 'UPDATE' && old_record) {
      
      // Check the state of the frontend toggle!
      const userWantsToNotify = record.notify_update !== false; 

      // 1. Status Change -> Only email if toggle was checked
      if (userWantsToNotify && record.status !== old_record.status) {
        const recipients = requesterEmail ? `${requesterEmail}, ${teamEmails}` : teamEmails;

        await transporter.sendMail({
          from: `"LAAM Analytics" <${process.env.GMAIL_USER}>`,
          to: recipients,
          subject: `Status Update: ${record.ticket_id} is now ${record.status}`,
          text: `Hi ${record.submitter},\n\nThe status of the request (${record.ticket_id}: ${record.title}) has been changed from "${old_record.status}" to "${record.status}".\n\nPlease check the tracker for details.`
        });
      }

      // 2. New Comment -> Always email (comments usually shouldn't be silent)
      const oldComments = typeof old_record.comments === 'string' ? JSON.parse(old_record.comments || '[]') : (old_record.comments || []);
      const newComments = typeof record.comments === 'string' ? JSON.parse(record.comments || '[]') : (record.comments || []);

      if (newComments.length > oldComments.length) {
        const latestComment = newComments[newComments.length - 1];
        const commentText = latestComment.text || JSON.stringify(latestComment);
        const commentRecipients = requesterEmail ? `${requesterEmail}, ${teamEmails}` : teamEmails;

        await transporter.sendMail({
          from: `"LAAM Analytics" <${process.env.GMAIL_USER}>`,
          to: commentRecipients, 
          subject: `New Comment on ${record.ticket_id}`,
          text: `A new comment was added to request ${record.ticket_id}:\n\n"${commentText}"\n\nPlease check the dashboard to reply or view details.`
        });
      }
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
