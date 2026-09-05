import NewReply from '../NewReply.js';

describe('a NewReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah balasan',
    };

    // Action
    const { content } = new NewReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });

  it('should consider two newReply with the same content as equal', () => {
    // Arrange
    const payload = { content: 'sebuah balasan' };
    const newReply = new NewReply(payload);

    // Action & Assert
    expect(newReply.equals(new NewReply(payload))).toBe(true);
    expect(newReply.equals(new NewReply({ content: 'balasan lain' }))).toBe(false);
  });
});
