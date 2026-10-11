/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const userEmail = e.record.get("user_id");
  let recipientEmail = "";
  
  if (userEmail) {
    try {
      const user = $app.findRecordById("users", userEmail);
      recipientEmail = user.get("email");
    } catch (err) {
      console.log("Could not find user email");
    }
  }
  
  if (recipientEmail) {
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: recipientEmail }],
      subject: "Your referral was successful!",
      html: "<h1>Referral Reward!</h1><p>Great news! Your referral has been completed.</p><p><strong>Total Referrals:</strong> " + e.record.get("total_referrals") + "</p><p><strong>Total Earnings:</strong> $" + e.record.get("total_earnings") + "</p><p>Keep sharing your referral link to earn more rewards!</p>"
    });
    $app.newMailClient().send(message);
  }
  
  e.next();
}, "referral_program");