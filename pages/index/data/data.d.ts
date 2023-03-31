// 消息类型
export type MessageType = 'in' | 'out';

// 消息数组
export interface Message {
  type: MessageType;
  content: string;
}

export interface Data {
  msgList: Message[];
  scrollIntoView: string;
  inputVal: string;
}
