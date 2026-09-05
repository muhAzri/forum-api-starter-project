import AddedThread from '../AddedThread.js';

describe('an AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'sebuah thread',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });

  it('should serialize to a plain object via toJSON', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    };
    const addedThread = new AddedThread(payload);

    // Action & Assert
    expect(JSON.parse(JSON.stringify(addedThread))).toEqual(payload);
  });

  it('should consider two addedThread with the same id, title, and owner as equal', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    };
    const addedThread = new AddedThread(payload);

    // Action & Assert
    expect(addedThread.equals(new AddedThread(payload))).toBe(true);
    expect(addedThread.equals(new AddedThread({ ...payload, owner: 'user-456' }))).toBe(false);
  });
});
