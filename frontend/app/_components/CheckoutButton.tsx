"use client";

import { ACCESS_TOKEN_KEY } from "@/app/_components/auth";
import { Book } from "../_types/book";
import { useRouter } from "next/navigation";
import useLocalStorageState from "use-local-storage-state";
import { post, put } from "../_lib/client";
import { useCurrentUser } from "../_contexts/user";
import { Button } from "@chakra-ui/react";
import { useSWRConfig } from "swr";
import { FC } from "react";

export type CheckoutButtonProps = {
  book: Book;
};

const CheckoutButton: FC<CheckoutButtonProps> = ({
  book,
}: CheckoutButtonProps) => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { mutate } = useSWRConfig();

  const onClickCheckoutSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const res = await post({
      destination: `/api/v1/books/${book.id}/checkouts`,
      token: accessToken,
    });

    if (res.ok) {
      mutate([`/api/v1/books/${book.id}`, accessToken]);
      mutate([`/api/v1/books/${book.id}/checkout-history`, accessToken]);
      router.refresh();
    }
  };

  const onClickReturningSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const res = await put({
      destination: `/api/v1/books/${book.id}/checkouts/${book.checkout?.id}/returned`,
      token: accessToken,
    });

    if (res.ok) {
      mutate([`/api/v1/books/${book.id}`, accessToken]);
      mutate([`/api/v1/books/${book.id}/checkout-history`, accessToken]);
      router.refresh();
    }
  };

  return !book.checkout ? (
    <Button colorScheme="blue" size="lg" onClick={onClickCheckoutSubmit}>
      この書籍を借りる
    </Button>
  ) : book.checkout?.checkedOutBy.id === currentUser?.id ? (
    <Button colorScheme="yellow" size="lg" onClick={onClickReturningSubmit}>
      この書籍を返却する
    </Button>
  ) : (
    <Button isDisabled colorScheme="red" size="lg">
      {`${book.checkout?.checkedOutBy.name}に貸出中`}
    </Button>
  );
};

export default CheckoutButton;
