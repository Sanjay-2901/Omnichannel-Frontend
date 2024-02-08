export enum WEBSOCKET_EVENTS {
  MESSAGE_CREATED = 'message.created',
  MESSAGE_UPDATED = 'message.updated',
  CONVERSATION_CREATED = 'conversation.created',
  MESSAGE_DELETED = 'This message was deleted',
}

export enum MESSAGE_TYPE {
  RECEIVED = 0,
  SENT = 1,
  INFORMATION = 2,
}
