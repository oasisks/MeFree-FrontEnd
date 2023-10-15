import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface CategoryDoc extends BaseDoc {
  label: string;
  categoryType: string;
  items: Array<ObjectId>;
}

export default class CategoryConcept {
  public readonly categories = new DocCollection<CategoryDoc>("categories");

  /**
   * Creates a new category
   * @param label the title of the category must be unique
   * @param items the elements within this category
   * @param categoryType the type of the category (either "discussion" or "group")
   * @returns returns a message
   */
  async createCategory(label: string, items: Array<ObjectId>, categoryType: string) {
    await this.canCreate(label);
    this.validCategoryType(categoryType);
    const _id = await this.categories.createOne({ label, categoryType, items });
    return { msg: "Category successfully created", category: await this.categories.readOne({ _id }) };
  }

  /**
   * Deletes the category
   * @param _id the category that I want to delete
   * @returns returns a message
   */
  async deleteCategory(_id: ObjectId) {
    await this.categories.deleteOne({ _id });
    return { msg: "Category successfully deleted" };
  }

  /**
   * Deletes the element within the category
   * @param _id the category that I want to be in
   * @param elt the element I want to delete
   */
  async deleteElement(_id: ObjectId, elt: ObjectId) {
    await this.categoryExist(_id);
    const category = await this.categories.readOne({ _id });
    if (category) {
      category.items.filter((item) => item != elt);
      await this.categories.updateOne({ _id }, category);
      return { msg: `Deleted an element from the category ${category.label}` };
    }
    return { msg: `The category with element ${_id} does not exist` };
  }

  /**
   * Adds the element to the category
   * @param _id the category that I want to be in
   * @param elt the element I want to delete
   */
  async addElement(_id: ObjectId, elt: ObjectId) {
    1;
    await this.categoryExist(_id);
    const category = await this.categories.readOne({ _id });
    if (category) {
      category.items.push(elt);
      await this.categories.updateOne({ _id }, category);
      return { msg: `Adde an element to the category ${category.label}` };
    }
    return { msg: `The category with element ${_id} does not exist` };
  }

  async getAllCategories(categoryType: string) {
    const categories = await this.categories.readMany({ categoryType });
    return categories.map((elt) => elt.label);
  }

  /**
   * Checks whether if the category can be created
   * @param label the label of the category
   */
  private async canCreate(label: string) {
    if (!label) {
      throw new BadValuesError("Label must be non-empty");
    }
    await this.isLabelUnique(label);
  }

  /**
   * If the label exists, it returns an error
   * @param label the label of the category
   */
  private async isLabelUnique(label: string) {
    if (await this.categories.readOne({ label })) {
      throw new NotAllowedError(`Category with label ${label} already exists`);
    }
  }

  private async categoryExist(_id: ObjectId) {
    const maybeCategory = await this.categories.readOne({ _id });
    if (maybeCategory === null) {
      throw new NotFoundError(`Category with id ${_id} does not exist`);
    }
  }

  private validCategoryType(categoryType: string) {
    const valid = ["discussion", "groups"];

    if (!categoryType.includes(categoryType)) {
      throw new BadValuesError("The category type is not correct");
    }
  }
}
