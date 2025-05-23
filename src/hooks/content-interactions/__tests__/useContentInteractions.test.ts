
/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useContentInteractions } from '../../../hooks/useContentInteractions';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/types/unified-content-types';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis()
    }),
    removeChannel: jest.fn(),
    rpc: jest.fn().mockResolvedValue({ data: null, error: null })
  }
}));

describe('useContentInteractions Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with empty interactions', () => {
    const { result } = renderHook(() => useContentInteractions());
    
    expect(result.current.userLikes).toEqual({});
    expect(result.current.userBookmarks).toEqual({});
  });

  test('handleLike should call supabase for content like', async () => {
    // Mock the supabase response for content_likes
    const mockInsert = jest.fn().mockResolvedValue({ data: null, error: null });
    (supabase.from as jest.Mock) = jest.fn().mockImplementation((table) => {
      return {
        insert: mockInsert,
        delete: jest.fn().mockResolvedValue({ data: null, error: null }),
        select: jest.fn().mockResolvedValue({ data: [], error: null }),
        eq: jest.fn().mockReturnThis(),
      };
    });

    const { result } = renderHook(() => useContentInteractions());
    
    await act(async () => {
      await result.current.handleLike('test-id', ContentType.Forum);
    });
    
    // Check if supabase.from was called with the right table
    expect(supabase.from).toHaveBeenCalledWith('content_likes');
    
    // Check if RPC was called to update counters
    expect(supabase.rpc).toHaveBeenCalledWith(
      'increment_counter_fn',
      expect.objectContaining({
        row_id: 'test-id',
        column_name: 'upvotes',
        table_name: 'forum_posts'
      })
    );
  });

  test('handleBookmark should call supabase for content bookmark', async () => {
    // Mock the supabase response for content_bookmarks
    const mockInsert = jest.fn().mockResolvedValue({ data: null, error: null });
    (supabase.from as jest.Mock) = jest.fn().mockImplementation((table) => {
      return {
        insert: mockInsert,
        delete: jest.fn().mockResolvedValue({ data: null, error: null }),
        select: jest.fn().mockResolvedValue({ data: [], error: null }),
        eq: jest.fn().mockReturnThis(),
      };
    });

    const { result } = renderHook(() => useContentInteractions());
    
    await act(async () => {
      await result.current.handleBookmark('test-id', ContentType.Forum);
    });
    
    // Check if supabase.from was called with the right table
    expect(supabase.from).toHaveBeenCalledWith('content_bookmarks');
  });
});
