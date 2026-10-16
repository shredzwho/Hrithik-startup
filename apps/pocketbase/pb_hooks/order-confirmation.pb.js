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
      subject: "Order Confirmation #" + e.record.get("order_number"),
      html: "<h1>Order Confirmed!</h1><p>Thank you for your order with STRONGBUILD.</p><p><strong>Order Number:</strong> " + e.record.get("order_number") + "</p><p><strong>Total Amount:</strong> ₹" + e.record.get("total_amount") + "</p><p>We'll notify you when your order ships.</p>"
    });
    $app.newMailClient().send(message);
  }
  
  e.next();
}, "orders");