/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: e.record.get("email") }],
    subject: "Welcome to Powerlifting Pro!",
    html: "<h1>Welcome!</h1><p>Thank you for signing up. We're excited to have you join our powerlifting community.</p><p>Start exploring our products and training resources today!</p>"
  });
  $app.newMailClient().send(message);
  e.next();
}, "users");