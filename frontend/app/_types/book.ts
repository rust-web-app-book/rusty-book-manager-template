export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  owner?: BookOwner;
  checkout?: CheckoutState;
};

export type BookOwner = {
  id: string;
  name: string;
};

export type CheckoutUser = {
  id: string;
  name: string;
};

export type CheckoutState = {
  id: string;
  checkedOutBy: CheckoutUser;
  checkedOutAt: string;
};

export type PaginatedList<T> = {
  items: T[];
  limit: number;
  offset: number;
  total: number;
};

export type Checkout = {
  id: string;
  checkedOutBy: string;
  checkedOutAt: string;
  returnedAt?: string;
  book: Book;
};

