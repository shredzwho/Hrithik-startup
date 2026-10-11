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
    const points = e.record.get("points");
    const earnedFrom = e.record.get("earned_from");
    
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: recipientEmail }],
      subject: "You earned " + points + " loyalty points!",
      html: "<h1>Loyalty Points Earned!</h1><p>Congratulations! You've earned <strong>" + points + " points</strong> from your " + earnedFrom + ".</p><p>Keep earning points and redeem them for exclusive rewards!</p>"
    });
    $app.newMailClient().send(message);
  }
  
  e.next();
}, "loyalty_points");