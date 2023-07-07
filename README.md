# Message Codec Service ( High Level )

This is a message codec service as part of coding test for JavaScript (TypeScript) Developer at Sinch.

This service provides a simple binary message encoding and decoding functionalities to handle the transmission of messages between peers in a real-time communication app.


## Getting Started

1. git clone url
2. yarn (install)
3. yarn start

## Testing

1. yarn test
2. yarn test:e2e


## Solution

- MessageDto: A data transfer object representing the message, containing headers as a Map<string, string> and the payload as a Buffer.
- IMessageCodec: An interface defining the methods for encoding and decoding messages.
- MessageCodecService: A service that implements the IMessageCodec interface. It provides methods to encode a MessageDto into a binary format and decode a binary data buffer into a MessageDto.

The encoding scheme is designed to be minimal. The encode method converts the headers to a JSON string and stores it as a buffer, followed by a separator buffer ([0]), and then the payload buffer. The decode method extracts the headers and payload from the data buffer based on the separator index and reconstructs the MessageDto object.

The service includes input validation and error handling to meet the requirements.
