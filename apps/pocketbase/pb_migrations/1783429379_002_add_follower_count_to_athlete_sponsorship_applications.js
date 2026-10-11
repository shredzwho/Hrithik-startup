/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("athlete_sponsorship_applications");

  const existing = collection.fields.getByName("follower_count");
  if (existing) {
    if (existing.type === "number") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("follower_count"); // exists with wrong type, remove first
  }

  collection.fields.add(new NumberField({
    name: "follower_count"
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("athlete_sponsorship_applications");
    collection.fields.removeByName("follower_count");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})