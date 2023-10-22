export type UserInfo = {
  role: String;
  username: String;
};

export type ReviewFormBody = {
  action: ReviewAction;
  body: String;
};

export enum ReviewAction {
  REVIEW,
  COMMENT,
}
