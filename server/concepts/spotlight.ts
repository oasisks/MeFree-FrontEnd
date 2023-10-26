import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface SpotlightDoc extends BaseDoc {
  title: string;
  creator: ObjectId;
  content: string;
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
  async createTopic(title: string, creator: ObjectId) {
    const content = "";
    const _id = await this.topics.createOne({ title, creator, content });
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

  async updateContent(_id: ObjectId, content: string) {
    const spotlight = await this.topics.readOne({ _id });
    if (spotlight) {
      spotlight.content = content;
      return await this.topics.updateOne({ _id }, spotlight);
    }
    return { msg: "Can't find the spotlight" };
  }
}
