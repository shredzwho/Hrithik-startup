/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("athlete_sponsorship_applications");

  const existing = collection.fields.getByName("photos");
  if (existing) {
    if (existing.type === "file") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("photos"); // exists with wrong type, remove first
  }

  collection.fields.add(new FileField({
    name: "photos",
    maxSelect: 5,
    maxSize: 20971520
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("athlete_sponsorship_applications");
    collection.fields.removeByName("photos");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})