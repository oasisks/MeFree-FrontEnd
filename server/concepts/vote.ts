import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotFoundError } from "./errors";

export interface VoteDoc extends BaseDoc {
  initiator: ObjectId;
  title: string;
  reason: string;
  scope: ObjectId;
  target: ObjectId | string;
  yesCount: Array<ObjectId>;
  banType: string;
  totalCount: Array<ObjectId>;
  startTime: Date;
  endTime: Date;
  status: string;
  noCount: Array<ObjectId>;
}

export default class VoteConcept {
  public readonly votes = new DocCollection<VoteDoc>("votes");

  /**
   *
   * @param scope the place the vote was created
   * @param title a title
   * @param reason the reason the ban was created
   * @param totalCount the total number of people relevant for this vote
   * @param startTime the start time. Default to now
   * @param endTime the end time
   * @param banType the type of ban
   */
  async createVote(
    initiator: ObjectId,
    scope: ObjectId,
    title: string,
    reason: string,
    totalCount: Array<ObjectId>,
    startTime: Date = new Date(),
    endTime: Date,
    banType: string,
    target: ObjectId | string,
  ) {
    await this.checkVoteType(banType);
    const yesCount = new Array<ObjectId>();
    const noCount = new Array<ObjectId>();
    const status = "pending";
    const _id = await this.votes.createOne({ initiator, title, reason, scope, target, yesCount, banType, totalCount, startTime, endTime, status, noCount });

    return { msg: "Successfully created a vote", vote: await this.votes.readOne({ _id }) };
  }

  /**
   * Votes yes on a vote
   * @param _id Vote id
   * @param user the user who voted
   */
  async voteYes(_id: ObjectId, user: ObjectId) {
    await this.voteExists(_id);
    await this.userInVote(_id, user);
    const vote = await this.votes.readOne({ _id });
    if (vote) {
      vote.yesCount.push(user);
      await this.votes.updateOne({ _id }, vote);
      return { msg: "Successfully voted yes", yesCount: vote.yesCount };
    }
  }

  async voteNo(_id: ObjectId, user: ObjectId) {
    await this.voteExists(_id);
    await this.userInVote(_id, user);
    const vote = await this.votes.readOne({ _id });
    if (vote) {
      vote.noCount.push(user);
      await this.votes.updateOne({ _id }, vote);
      return { msg: "Successfully voted no", noCount: vote.noCount };
    }
  }

  async getVote(_id: ObjectId) {
    return await this.votes.readOne({ _id });
  }

  async setStatus(_id: ObjectId, status: string) {
    await this.voteExists(_id);
    const vote = await this.votes.readOne({ _id });

    if (vote) {
      vote.status = status;
      await this.votes.updateOne({ _id }, vote);
      return { msg: "Successfully updated the status", vote };
    }
  }

  /**
   * Grabs all the votes within a scope
   * @param scope The scope where the vote exists
   * @returns returns all the votes within in that scope.
   */
  async getAllVotes(scope: ObjectId) {
    const votes = await this.votes.readMany({ scope });
    return { votes: votes };
  }

  /**
   * Checks that a given vote is finished.
   * Finished can either mean that the vote expired or 51% of the people have already
   * voted yes. If that happens, the vote will be deleted from the database.
   * @param _id The vote id
   * @returns a promise that gives the status and the vote
   */
  async checkVote(_id: ObjectId) {
    await this.voteExists(_id);
    const vote = await this.votes.readOne({ _id });
    if (vote) {
      const total = vote.totalCount.length;
      const yes = vote.yesCount.length;
      const now = new Date();
      const endTime = vote.endTime;

      if (now > endTime) {
        await this.votes.deleteOne({ _id });
        return { status: "Expired", vote: vote };
      }

      const percentage = yes / total;
      if (percentage >= 0.51) {
        await this.votes.deleteOne({ _id });
        return { status: "Approved", vote: vote };
      }
    }
    return { status: "Pending", vote: vote };
  }

  private async voteExists(_id: ObjectId) {
    const maybeVote = await this.votes.readOne({ _id });
    if (!maybeVote) {
      throw new BadValuesError("The vote does not exist");
    }
  }

  private async userInVote(_id: ObjectId, user: ObjectId) {
    await this.voteExists(_id);
    const vote = await this.votes.readOne({ _id });
    if (vote && !vote.totalCount.some((elt) => elt.equals(user))) {
      throw new NotFoundError(`Can't find user with id ${user}`);
    }
  }

  private async checkVoteType(vote: string) {
    const voteTypes = ["ban", "censor", "uncensor", "delete"];
    if (!voteTypes.includes(vote.toLowerCase())) {
      throw new BadValuesError(`The vote ${vote} does not exist`);
    }
  }
}
