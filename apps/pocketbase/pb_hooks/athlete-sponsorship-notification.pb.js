/// <reference path="../pb_data/types.d.ts" />
// Admin notification when athlete applies
onRecordAfterCreateSuccess((e) => {
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: "Athlete Sponsorship"
    },
    to: [{ address: $os.getenv("ADMIN_NOTIFICATION_EMAIL") || "support@strongbuild.in" }],
    subject: "New Athlete Sponsorship Application - STRONGBUILD",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">New Sponsorship Application</h1>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Applicant Details</h2>
          
          <p><strong>Name:</strong> ${e.record.get("name")}</p>
          <p><strong>Email:</strong> ${e.record.get("email")}</p>
          <p><strong>Phone:</strong> ${e.record.get("phone") || "N/A"}</p>
          <p><strong>Age:</strong> ${e.record.get("age") || "N/A"}</p>
          <p><strong>Location:</strong> ${e.record.get("location") || "N/A"}</p>
          <p><strong>Sport:</strong> ${e.record.get("sport") || "N/A"}</p>
          <p><strong>Competition Level:</strong> ${e.record.get("competition_level") || "N/A"}</p>
          
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-top: 20px;">Performance Records</h2>
          <p><strong>Squat PR:</strong> ${e.record.get("squat_pr") || "N/A"}</p>
          <p><strong>Bench PR:</strong> ${e.record.get("bench_pr") || "N/A"}</p>
          <p><strong>Deadlift PR:</strong> ${e.record.get("deadlift_pr") || "N/A"}</p>
          
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-top: 20px;">Social Media</h2>
          <p><strong>Instagram:</strong> ${e.record.get("instagram") || "N/A"}</p>
          <p><strong>YouTube:</strong> ${e.record.get("youtube") || "N/A"}</p>
          <p><strong>TikTok:</strong> ${e.record.get("tiktok") || "N/A"}</p>
          <p><strong>Follower Count:</strong> ${e.record.get("follower_count") || "N/A"}</p>
          
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-top: 20px;">Application Details</h2>
          <p><strong>Bio:</strong> ${e.record.get("bio") || "N/A"}</p>
          <p><strong>Why Sponsorship:</strong> ${e.record.get("sponsorship_reason") || "N/A"}</p>
          <p><strong>Equipment Used:</strong> ${e.record.get("equipment_used") || "N/A"}</p>
          <p><strong>Achievements:</strong> ${e.record.get("achievements") || "N/A"}</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://strongbuild.in/admin" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Review in Admin Panel</a>
          </div>
        </div>
      </div>
    `
  });
  $app.newMailClient().send(message);
  e.next();
}, "athlete_sponsorship_applications");

// Confirmation email to applicant
onRecordAfterCreateSuccess((e) => {
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: "Athlete Sponsorship"
    },
    to: [{ address: e.record.get("email") }],
    subject: "Your Sponsorship Application Has Been Received",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Application Received</h1>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <p>Hi ${e.record.get("name")},</p>
          
          <p>Thank you for submitting your athlete sponsorship application! We've received your submission and our team will review it carefully.</p>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #7f1d1d;"><strong>What happens next?</strong></p>
            <p style="margin: 5px 0 0 0; color: #7f1d1d;">Our sponsorship team will review your application within 5-7 business days. We'll contact you via email with our decision.</p>
          </div>
          
          <h3 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Your Application Summary</h3>
          <p><strong>Name:</strong> ${e.record.get("name")}</p>
          <p><strong>Sport:</strong> ${e.record.get("sport") || "N/A"}</p>
          <p><strong>Competition Level:</strong> ${e.record.get("competition_level") || "N/A"}</p>
          
          <p style="margin-top: 30px; color: #666;">If you have any questions, feel free to reach out to us.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://yoursite.com" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Visit Our Site</a>
          </div>
          
          <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">© 2024 Athlete Sponsorship Program. All rights reserved.</p>
        </div>
      </div>
    `
  });
  $app.newMailClient().send(message);
  e.next();
}, "athlete_sponsorship_applications");