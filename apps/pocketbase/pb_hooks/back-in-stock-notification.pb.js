/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const original = e.record.original();
  const newStock = e.record.get("stock");
  const oldStock = original.get("stock");
  
  if (oldStock <= 0 && newStock > 0) {
    const productId = e.record.id;
    
    try {
      const subscriptions = $app.findRecordsByFilter("back_in_stock_subscriptions", "product_id = '" + productId + "'", { limit: 100 });
      
      subscriptions.forEach((sub) => {
        const email = sub.get("email");
        if (email) {
          const message = new MailerMessage({
            from: {
              address: $app.settings().meta.senderAddress,
              name: $app.settings().meta.senderName
            },
            to: [{ address: email }],
            subject: e.record.get("name") + " is back in stock!",
            html: "<h1>Great News!</h1><p>The " + e.record.get("name") + " you were waiting for is back in stock!</p><p>Hurry, limited quantities available.</p>"
          });
          $app.newMailClient().send(message);
          
          sub.set("notified", true);
          $app.save(sub);
        }
      });
    } catch (err) {
      console.log("Error sending back in stock notifications: " + err);
    }
  }
  
  e.next();
}, "products");