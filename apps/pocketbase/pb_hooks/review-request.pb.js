/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const newStatus = e.record.get("status");
  const oldStatus = original.get("status");
  
  if (oldStatus !== "delivered" && newStatus === "delivered") {
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
        subject: "How did you like your order? Leave a review!",
        html: "<h1>We'd Love Your Feedback!</h1><p>Your order #" + e.record.get("order_number") + " has been delivered.</p><p>Please take a moment to leave a review and let us know what you think of your new gear.</p><p>Your feedback helps us improve and helps other athletes make informed decisions.</p>"
      });
      $app.newMailClient().send(message);
    }
  }
  
  e.next();
}, "orders");