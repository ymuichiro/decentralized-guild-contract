export enum Evaluation {
  GOOD,
  BAD,
}
export enum QuestStatus {
  WANTED = "WANTED",
  WORKING = "WORKING",
  COMPLETED = "COMPLETED",
}

/**
 * Requester により投稿されたクエスト内容
 */
export interface Quest {
  transaction_hash: string;
  title: string;
  description: string;
  reward: number;
  requester_public_key: string;
  worker_public_key: string;
  status: QuestStatus;
  created: string;
}
