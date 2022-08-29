import create from "zustand";
import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";

type ReexuteBookmarks = (opts?: Partial<any> | undefined) => void;

interface UseBookmarksDb {
  bookmarksDb: BookmarkDatabase_i[] | null;
  updateBookmarksDb: (newBookmarksDb: BookmarkDatabase_i[]) => void;
  reexecuteBookmarks: ReexuteBookmarks | null;
  updateReexecuteBookmarks: (reexecuteBookmarksFunc: ReexuteBookmarks) => void;
}

export const useBookmarksDb = create<UseBookmarksDb>((set) => ({
  bookmarksDb: null,
  updateBookmarksDb: (newBookmarksDb) =>
    set((state) => ({
      ...state,
      bookmarksDb: [...newBookmarksDb],
    })),
  reexecuteBookmarks: null,
  updateReexecuteBookmarks: (reexecuteBookmarksFunc) =>
    set((state) => ({
      ...state,
      reexecuteBookmarks: reexecuteBookmarksFunc,
    })),
}));
