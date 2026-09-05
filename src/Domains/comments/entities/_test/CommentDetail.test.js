import CommentDetail from '../CommentDetail.js';
import ReplyDetail from '../../../replies/entities/ReplyDetail.js';

describe('a CommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDelete: 'bukan boolean',
      replies: [],
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create commentDetail object correctly when comment is not deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDelete: false,
      replies: [],
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.content).toEqual(payload.content);
    expect(commentDetail.replies).toEqual(payload.replies);
  });

  it('should display **komentar telah dihapus** when comment is deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDelete: true,
      replies: [],
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.content).toEqual('**komentar telah dihapus**');
  });

  it('should serialize to a plain object via toJSON', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDelete: false,
      replies: [],
    };
    const commentDetail = new CommentDetail(payload);

    // Action & Assert
    expect(JSON.parse(JSON.stringify(commentDetail))).toEqual({
      id: payload.id,
      username: payload.username,
      date: payload.date,
      replies: payload.replies,
      content: payload.content,
    });
  });

  it('should consider two commentDetail with the same fields and replies as equal', () => {
    // Arrange
    const reply = new ReplyDetail({
      id: 'reply-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:26:21.338Z',
      username: 'johndoe',
      isDelete: false,
    });
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDelete: false,
      replies: [reply],
    };
    const commentDetail = new CommentDetail(payload);

    // Action & Assert
    expect(commentDetail.equals(new CommentDetail(payload))).toBe(true);
    expect(commentDetail.equals(new CommentDetail({ ...payload, replies: [] }))).toBe(false);
  });
});
