import NewThread from '../NewThread.js';

describe('a NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 123,
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    // Action
    const { title, body } = new NewThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });

  it('should consider two newThread with the same title and body as equal', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };
    const newThread = new NewThread(payload);

    // Action & Assert
    expect(newThread.equals(new NewThread(payload))).toBe(true);
    expect(newThread.equals(new NewThread({ ...payload, title: 'thread lain' }))).toBe(false);
    expect(newThread.equals({ title: payload.title, body: payload.body })).toBe(false);
  });
});
