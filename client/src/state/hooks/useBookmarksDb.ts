import create from "zustand";
import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";


interface UseBookmarksDb {
  bookmarksDb: BookmarkDatabase_i[] | null;
  updateBookmarksDb: (newBookmarksDb: BookmarkDatabase_i[]) => void;
}

export const useBookmarksDb = create<UseBookmarksDb>((set) => ({
  bookmarksDb: null,
  updateBookmarksDb: (newBookmarksDb) =>
    set((state) => ({
      ...state,
      bookmarksDb: [...newBookmarksDb],
    })),
}));
