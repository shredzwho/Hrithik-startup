/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: e.record.get("email") }],
    subject: "Welcome to STRONGBUILD!",
    html: "<h1>Welcome to the Ranks!</h1><p>Thank you for signing up with STRONGBUILD. We're excited to support your powerlifting and strength journey.</p><p>Explore our competition-grade lever belts, wrist wraps and gear today!</p>"
  });
  $app.newMailClient().send(message);
  e.next();
}, "users");