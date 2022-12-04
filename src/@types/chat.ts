// ----------------------------------------------------------------------

export type ChatState = {
  isLoading: boolean;
  error: Error | string | null;
  allUserConversations: any;
  allUsers: any;
  currentConversationUid: any;
};
