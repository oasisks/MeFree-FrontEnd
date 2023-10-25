import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface SpotlightDoc extends BaseDoc {
  title: string;
  posts: ObjectId;
  creator: ObjectId;
}

export default class SpotLightConcept {
  public readonly topics = new DocCollection<SpotlightDoc>("spotlights");

  /**
   *
   * @param title the title of the topic
   * @param posts the posts within the topic
   * @param creator the creator of the topic
   * @returns success message and the topic
   */
  async createTopic(title: string, posts: ObjectId, creator: ObjectId) {
    const _id = await this.topics.createOne({ title, posts, creator });
    return { msg: "Successfully created a spotlight topic", topic: await this.topics.readOne({ _id }) };
  }

  /**
   * Returns a list of spotlights
   */
  async getSpotLights() {
    return await this.topics.readMany({});
  }

  async deleteAllSpotLights() {
    return await this.topics.deleteMany({});
  }

  async deleteSpotlight(_id: ObjectId) {
    return await this.topics.deleteOne({ creator: _id });
  }
}
