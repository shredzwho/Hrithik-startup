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
        subject: "Your Order #" + e.record.get("order_number") + " Has Been Delivered!",
        html: "<h1>Order Delivered!</h1><p>Your order has been delivered successfully.</p><p><strong>Order Number:</strong> " + e.record.get("order_number") + "</p><p>We hope you enjoy your new powerlifting gear!</p>"
      });
      $app.newMailClient().send(message);
    }
  }
  
  e.next();
}, "orders");