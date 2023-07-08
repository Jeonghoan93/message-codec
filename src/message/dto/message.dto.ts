export class MessageDto {
  headers: Map<string, string>;
  payload: Buffer;
}

export class HttpMessageDto {
  headers: Record<string, string>;
  payload: string;
}
