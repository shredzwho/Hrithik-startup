/// <reference path="../pb_data/types.d.ts" />
// Admin notification when affiliate applies
onRecordAfterCreateSuccess((e) => {
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: "Affiliate Program"
    },
    to: [{ address: $os.getenv("ADMIN_NOTIFICATION_EMAIL") || "support@strongbuild.in" }],
    subject: "New Affiliate Application - STRONGBUILD",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">New Affiliate Application</h1>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Applicant Information</h2>
          
          <p><strong>Name:</strong> ${e.record.get("name")}</p>
          <p><strong>Email:</strong> ${e.record.get("email")}</p>
          <p><strong>Phone:</strong> ${e.record.get("phone") || "N/A"}</p>
          <p><strong>Website:</strong> ${e.record.get("website") || "N/A"}</p>
          
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-top: 20px;">Social Media</h2>
          <p><strong>Instagram:</strong> ${e.record.get("instagram") || "N/A"}</p>
          <p><strong>YouTube:</strong> ${e.record.get("youtube") || "N/A"}</p>
          <p><strong>TikTok:</strong> ${e.record.get("tiktok") || "N/A"}</p>
          <p><strong>Follower Count:</strong> ${e.record.get("follower_count") || "N/A"}</p>
          
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-top: 20px;">Affiliate Details</h2>
          <p><strong>Niche:</strong> ${e.record.get("niche") || "N/A"}</p>
          <p><strong>Promotion Method:</strong> ${e.record.get("promotion_method") || "N/A"}</p>
          <p><strong>Monthly Traffic:</strong> ${e.record.get("monthly_traffic") || "N/A"}</p>
          <p><strong>Traffic Estimate:</strong> ${e.record.get("traffic_estimate") || "N/A"}</p>
          <p><strong>Affiliate Experience:</strong> ${e.record.get("affiliate_experience") || "N/A"}</p>
          
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-top: 20px;">Application Message</h2>
          <p><strong>Why Join:</strong> ${e.record.get("why_join") || "N/A"}</p>
          <p><strong>Message:</strong> ${e.record.get("message") || "N/A"}</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://strongbuild.in/admin" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Review in Admin Panel</a>
          </div>
        </div>
      </div>
    `
  });
  $app.newMailClient().send(message);
  e.next();
}, "affiliate_applications");

// Confirmation email to applicant
onRecordAfterCreateSuccess((e) => {
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: "Affiliate Program"
    },
    to: [{ address: e.record.get("email") }],
    subject: "Your Affiliate Application Has Been Received",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Application Received</h1>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <p>Hi ${e.record.get("name")},</p>
          
          <p>Thank you for applying to our affiliate program! We've received your application and our team will review it shortly.</p>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #7f1d1d;"><strong>What's Next?</strong></p>
            <p style="margin: 5px 0 0 0; color: #7f1d1d;">Our affiliate team will review your application within 3-5 business days. We'll send you an email with our decision and next steps.</p>
          </div>
          
          <h3 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Your Application Details</h3>
          <p><strong>Name:</strong> ${e.record.get("name")}</p>
          <p><strong>Website/Niche:</strong> ${e.record.get("niche") || "N/A"}</p>
          <p><strong>Promotion Method:</strong> ${e.record.get("promotion_method") || "N/A"}</p>
          
          <p style="margin-top: 30px; color: #666;">If you have any questions about the application process, feel free to reach out.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://yoursite.com" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Visit Our Site</a>
          </div>
          
          <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">© 2024 Affiliate Program. All rights reserved.</p>
        </div>
      </div>
    `
  });
  $app.newMailClient().send(message);
  e.next();
}, "affiliate_applications");