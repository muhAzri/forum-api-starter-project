import { vi } from 'vitest';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddThreadUseCase from '../AddThreadUseCase.js';

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };
    const owner = 'user-123';

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = vi.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload, owner);

    // Assert: the use case must hand back exactly what the repository returned,
    // and must have asked the repository to persist a NewThread built from the payload.
    expect(addedThread).toBe(mockAddedThread);
    expect(mockThreadRepository.addThread).toHaveBeenCalledTimes(1);
    const [calledNewThread, calledOwner] = mockThreadRepository.addThread.mock.calls[0];
    expect(calledNewThread.equals(new NewThread(useCasePayload))).toBe(true);
    expect(calledOwner).toEqual(owner);
  });
});
