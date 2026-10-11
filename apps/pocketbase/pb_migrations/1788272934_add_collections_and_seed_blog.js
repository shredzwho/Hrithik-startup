/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // 1. Newsletter subscribers collection (public create)
    let newsletter;
    try {
      newsletter = app.findCollectionByNameOrId("newsletter_subscribers");
    } catch (_) {
      newsletter = new Collection({
        type: "base",
        name: "newsletter_subscribers",
        listRule: null,
        viewRule: null,
        createRule: "",
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: "email", type: "email", required: true },
          { name: "source", type: "text" },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
      });
      app.save(newsletter);
    }

    // 2. Track order queries collection (public create)
    let trackOrders;
    try {
      trackOrders = app.findCollectionByNameOrId("track_order_queries");
    } catch (_) {
      trackOrders = new Collection({
        type: "base",
        name: "track_order_queries",
        listRule: null,
        viewRule: null,
        createRule: "",
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: "order_number", type: "text", required: true, max: 100 },
          { name: "email", type: "email", required: true },
          { name: "name", type: "text", max: 200 },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
      });
      app.save(trackOrders);
    }

    // 3. Add product_external_id text field to reviews (links to Online Store product id)
    //    and make product_id optional so reviews can be created for external store products.
    const reviews = app.findCollectionByNameOrId("reviews");
    if (!reviews.fields.getByName("product_external_id")) {
      reviews.fields.add(new TextField({ name: "product_external_id" }));
    }
    const productIdField = reviews.fields.getByName("product_id");
    if (productIdField && productIdField.required) {
      productIdField.required = false;
    }
    app.save(reviews);

    // 3b. Extend wishlist to store Online Store product details (the relation
    //     field points at the PocketBase products collection, not the Online
    //     Store, so we store external details for display and make product_id
    //     optional).
    const wishlist = app.findCollectionByNameOrId("wishlist");
    if (!wishlist.fields.getByName("product_external_id")) {
      wishlist.fields.add(new TextField({ name: "product_external_id" }));
      wishlist.fields.add(new TextField({ name: "product_title" }));
      wishlist.fields.add(new TextField({ name: "product_image" }));
      wishlist.fields.add(new TextField({ name: "product_price" }));
    }
    const wishProductId = wishlist.fields.getByName("product_id");
    if (wishProductId && wishProductId.required) {
      wishProductId.required = false;
    }
    app.save(wishlist);

    // 4. Seed sample blog posts
    const blog = app.findCollectionByNameOrId("blog_posts");

    const existing = app.findRecordsByFilter(
      "blog_posts",
      "slug = {:slug}",
      "",
      1,
      0,
      { slug: "how-to-choose-your-first-lever-belt" },
    );

    if (!existing || existing.length === 0) {
      const posts = [
        {
          title: "How to Choose Your First Lever Belt",
          slug: "how-to-choose-your-first-lever-belt",
          excerpt:
            "10mm or 13mm? Suede or leather? A practical guide to picking the right lever belt for your lifting career.",
          category: "Equipment Guides",
          author: "STRONGBUILD Team",
          reading_time: 7,
          content:
            "Choosing your first lever belt is a rite of passage for any serious strength athlete. The right belt adds support, stability and confidence under heavy load — the wrong one collects dust in your gym bag.\n\n10mm vs 13mm\nMost lifters should start with a 10mm belt. It breaks in faster, feels less restrictive, and is more than stiff enough for sub-elite pulls. Move to 13mm only when you are chasing elite totals and want maximum intra-abdominal pressure.\n\nWidth and fit\nCompetition-spec belts are 10cm wide and taper-free. Measure at your navel, over your training gear, and size so the belt sits in the middle of the prong holes — you want room to tighten as you lean out or bulk.\n\nLever vs prong\nLever belts lock tight and release fast, ideal for max-effort singles. Prong belts adjust in smaller increments and are friendlier if your waist fluctuates. Both are competition-legal in most Indian federations.\n\nBreak-in\nRoll your belt backwards around a post, wear it during warm-ups, and store it rolled. A few sessions is all it takes to stop a quality leather belt from feeling like a plank.\n\nThe bottom line: buy once, buy right. A well-built lever belt will outlast a decade of training cycles.",
        },
        {
          title: "Peaking for Your First Powerlifting Meet",
          slug: "peaking-for-your-first-powerlifting-meet",
          excerpt:
            "The final four weeks decide everything. Here is how to taper volume, manage fatigue and walk onto the platform ready.",
          category: "Competition Preparation",
          author: "Vikram Rathore",
          reading_time: 9,
          content:
            "Your first meet is less about how strong you are and more about how well you display that strength on the day. Peaking is the art of shedding fatigue while keeping intensity high.\n\nWeeks 4-3 out\nHold your working weights but cut volume by roughly a third. Keep the main lifts at RPE 8-9 for doubles and singles. This is where you preserve the skill of heavy lifting without accumulating more fatigue.\n\nWeek 2 out\nDrop volume to about half of your heaviest block. Openers should feel smooth and fast. Add a light technique day midweek to stay grooved.\n\nMeet week\nTwo light sessions early in the week, then rest. Hydrate, eat at maintenance, and sleep more than you think you need. Resist the urge to test openers — you already know them.\n\nSelecting attempts\nOpen with something you can hit for a triple on a bad day — usually 90-92% of your best. Your second attempt is your qualifier. Your third is where records live. Never open heavy to feed your ego.\n\nPack your kit the night before: singlet, belt, wraps, chalk, and a spare shirt. Arrive early, weigh in calm, and treat the platform like just another set. You have already done the work.",
        },
        {
          title: "Why Wrist Wraps Are Not Optional for Heavy Pressing",
          slug: "why-wrist-wraps-are-not-optional-for-heavy-pressing",
          excerpt:
            "Your wrists take a beating under heavy bench and overhead work. Stiff wraps protect the joint and transfer more force to the bar.",
          category: "Strength Tips",
          author: "Meera Shah",
          reading_time: 5,
          content:
            "If you bench more than your bodyweight or press overhead regularly, your wrists are working overtime. Over time, the small stabilisers fatigue, the bar path drifts, and the joint itself takes wear it was never built to handle.\n\nWhat wraps actually do\nA stiff wrist wrap acts like an external ligament. It keeps the wrist in a neutral, stacked position under load, which means better force transfer from your forearms to the bar and less energy wasted fighting the wobble.\n\nStiffness matters\nCheaper wraps stretch under load and give you comfort, not support. Competition-grade wraps are stiff — they are uncomfortable to cinch tight, and that is exactly the point. Look for a wrap rated for heavy pressing, not a generic gym wrap.\n\nHow tight\nTight enough that your wrist does not bend under the bar, but not so tight your hand goes numb. Most lifters wrap for the working set and remove it between sets to keep blood flowing.\n\nWhen to wear them\nHeavy bench, overhead press, and any max-effort pressing day. You do not need them for curls or light accessory work — let the joint strengthen on its own there.\n\nProtect the joint now and it will keep pressing heavy for years.",
        },
      ];

      posts.forEach((p) => {
        const rec = new Record(blog);
        rec.set("title", p.title);
        rec.set("slug", p.slug);
        rec.set("content", p.content);
        rec.set("excerpt", p.excerpt);
        rec.set("category", p.category);
        rec.set("author", p.author);
        rec.set("reading_time", p.reading_time);
        rec.set("publish_date", new Date().toISOString().slice(0, 10));
        app.save(rec);
      });
    }
  },
  (app) => {
    // down
    try {
      const newsletter = app.findCollectionByNameOrId("newsletter_subscribers");
      app.delete(newsletter);
    } catch (_) {}
    try {
      const trackOrders = app.findCollectionByNameOrId("track_order_queries");
      app.delete(trackOrders);
    } catch (_) {}
    try {
      const reviews = app.findCollectionByNameOrId("reviews");
      reviews.fields.removeByName("product_external_id");
      app.save(reviews);
    } catch (_) {}
    try {
      const seeded = app.findRecordsByFilter(
        "blog_posts",
        "slug = {:a} || slug = {:b} || slug = {:c}",
        "",
        10,
        0,
        {
          a: "how-to-choose-your-first-lever-belt",
          b: "peaking-for-your-first-powerlifting-meet",
          c: "why-wrist-wraps-are-not-optional-for-heavy-pressing",
        },
      );
      seeded.forEach((r) => app.delete(r));
    } catch (_) {}
  },
);
