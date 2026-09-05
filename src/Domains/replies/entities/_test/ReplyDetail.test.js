import ReplyDetail from '../ReplyDetail.js';

describe('a ReplyDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:26:21.338Z',
    };

    // Action and Assert
    expect(() => new ReplyDetail(payload)).toThrowError('REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:26:21.338Z',
      username: 'dicoding',
      isDelete: 'bukan boolean',
    };

    // Action and Assert
    expect(() => new ReplyDetail(payload)).toThrowError('REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create replyDetail object correctly when reply is not deleted', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:26:21.338Z',
      username: 'dicoding',
      isDelete: false,
    };

    // Action
    const replyDetail = new ReplyDetail(payload);

    // Assert
    expect(replyDetail.id).toEqual(payload.id);
    expect(replyDetail.content).toEqual(payload.content);
    expect(replyDetail.date).toEqual(payload.date);
    expect(replyDetail.username).toEqual(payload.username);
  });

  it('should display **balasan telah dihapus** when reply is deleted', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:26:21.338Z',
      username: 'dicoding',
      isDelete: true,
    };

    // Action
    const replyDetail = new ReplyDetail(payload);

    // Assert
    expect(replyDetail.content).toEqual('**balasan telah dihapus**');
  });

  it('should serialize to a plain object via toJSON', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:26:21.338Z',
      username: 'dicoding',
      isDelete: false,
    };
    const replyDetail = new ReplyDetail(payload);

    // Action & Assert
    expect(JSON.parse(JSON.stringify(replyDetail))).toEqual({
      id: payload.id,
      content: payload.content,
      date: payload.date,
      username: payload.username,
    });
  });

  it('should consider two replyDetail with the same fields as equal', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:26:21.338Z',
      username: 'dicoding',
      isDelete: false,
    };
    const replyDetail = new ReplyDetail(payload);

    // Action & Assert
    expect(replyDetail.equals(new ReplyDetail(payload))).toBe(true);
    expect(replyDetail.equals(new ReplyDetail({ ...payload, content: 'balasan lain' }))).toBe(false);
  });
});
