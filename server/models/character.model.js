import mongoose from "mongoose";

const historyEntrySchema = new mongoose.Schema({
  actorUsername: { type: String, required: true },
  occurredAt: { type: Date, required: true },
  description: { type: String, required: true },
});

const characterSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, maxlength: 40 },
    biography: { type: String, trim: true, required: true, maxlength: 1000 },
    race: {
      type: String,
      enum: ["Human", "Elf", "Dwarf", "Orc"],
      required: true,
    },
    characterClass: {
      type: String,
      enum: ["Warrior", "Mage", "Rogue", "Cleric"],
      required: true,
    },
    portrait: {
      type: String,
      enum: ["portrait1.png", "portrait2.png"],
      default: "portrait1.png",
    },
    hairColor: {
      type: String,
      enum: ["black", "brown", "blonde"],
      default: "brown",
    },
    skinTone: {
      type: String,
      enum: ["light", "medium", "dark"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["draft", "active", "retired"],
      default: "draft",
    },
    activationDate: { type: Date, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    history: { type: [historyEntrySchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Character", characterSchema);