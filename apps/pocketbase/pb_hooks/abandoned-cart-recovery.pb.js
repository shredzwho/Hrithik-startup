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
      subject: "Don't forget about your cart!",
      html: "<h1>You left something behind!</h1><p>We noticed you have items in your cart.</p><p>Complete your purchase now and get free shipping on orders over $50!</p><p>Your cart is waiting for you.</p>"
    });
    $app.newMailClient().send(message);
  }
  
  e.next();
}, "abandoned_carts");