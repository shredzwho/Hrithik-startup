/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const newStatus = e.record.get("status");
  const oldStatus = original.get("status");
  
  if (oldStatus !== "shipped" && newStatus === "shipped") {
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
        subject: "Your Order #" + e.record.get("order_number") + " Has Shipped!",
        html: "<h1>Order Shipped!</h1><p>Great news! Your order has been shipped.</p><p><strong>Order Number:</strong> " + e.record.get("order_number") + "</p><p><strong>Tracking Number:</strong> " + (e.record.get("tracking_number") || "Coming soon") + "</p><p>Track your package to see the estimated delivery date.</p>"
      });
      $app.newMailClient().send(message);
    }
  }
  
  e.next();
}, "orders");