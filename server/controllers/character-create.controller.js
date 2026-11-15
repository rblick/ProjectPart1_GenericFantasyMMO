import Character from "../models/character.model.js";
import User from "../models/user.model.js";

const create = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id).select("name");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const {
      name,
      biography,
      race,
      characterClass,
      portrait,
      hairColor,
      skinTone,
      status,
      activationDate,
    } = req.body ?? {};

    const character = await Character.create({
      name,
      biography,
      race,
      characterClass,
      portrait,
      hairColor,
      skinTone,
      status,
      activationDate,
      owner: user._id,
      history: [
        {
          actorUsername: user.name,
          occurredAt: new Date(),
          description: "Character created",
        },
      ],
    });

    return res.status(201).json(character);
  } catch (error) {
    return next(error);
  }
};

export default { create };