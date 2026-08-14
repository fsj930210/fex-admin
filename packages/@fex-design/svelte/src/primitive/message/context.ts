import type{MessageSide}from'@fex-design/core/message/types';export const messageContextKey=Symbol('Message');export interface MessageContextValue{side:()=>MessageSide;busy:()=>boolean}
