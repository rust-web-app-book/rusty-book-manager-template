"use client";

import { ACCESS_TOKEN_KEY } from "@/app/_components/auth";
import Header from "@/app/_components/Header";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  IconButton,
  Flex,
  Spacer,
  ButtonGroup,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import useLocalStorageState from "use-local-storage-state";
import NextLink from "next/link";
import { useBook } from "@/app/_contexts/book";
import { del } from "@/app/_lib/client";
import CheckoutButton from "@/app/_components/CheckoutButton";
import CheckoutHistory from "@/app/_components/CheckoutHistory";

export default function Page({ params }: Readonly<{ params: { id: string } }>) {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure({ id: "delete-book" });
  const cancelRef = useRef(null);

  const { book } = useBook(params.id);

  const onClickDeleteSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const res = await del({
      destination: `/api/v1/books/${params.id}`,
      token: accessToken,
    });
    if (res.ok) {
      router.push("/");
    }
  };

  return (
    <>
      <Header />
      <Container maxW="container.xl" my={20}>
        <Heading as="h2" size="2xl" mb={4} noOfLines={1}>
          書籍情報 : {book?.title}
        </Heading>
        <Stack m={10}>
          <Flex minWidth="max-content" alignItems="center" gap={2} mb={4}>
            {book && <CheckoutButton book={book} />}
            <Spacer />
            <ButtonGroup gap={2}>
              <IconButton
                aria-label="edit book"
                as={NextLink}
                href={`/books/${params.id}/edit`}
                icon={<EditIcon />}
              />
              <IconButton
                aria-label="delete book"
                id="delete-book"
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={onOpenDelete}
              />
            </ButtonGroup>
            <AlertDialog
              isOpen={isOpenDelete}
              leastDestructiveRef={cancelRef}
              onClose={onCloseDelete}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontWeight="bold">
                    蔵書の削除
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    本当に蔵書「{book?.title}」を削除しますか？
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onCloseDelete}>
                      キャンセル
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={onClickDeleteSubmit}
                      ml={3}
                    >
                      削除する
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Flex>

          <Box mb={5}>
            <Heading as="h3" size="1xl">
              タイトル:
            </Heading>
            <Text>{book?.title}</Text>
          </Box>
          <Box mb={5}>
            <Heading as="h3" size="1xl">
              著者:
            </Heading>
            <Text>{book?.author}</Text>
          </Box>
          <Box mb={5}>
            <Heading as="h3" size="1xl">
              ISBN:
            </Heading>
            <Text>{book?.isbn}</Text>
          </Box>
          <Box mb={5}>
            <Heading as="h3" size="1xl">
              書籍の概要:
            </Heading>
            <Text>{book?.description}</Text>
          </Box>
          <Box mb={5}>
            <Heading as="h3" size="1xl">
              この本の所有者:
            </Heading>
            <Text>{book?.owner?.name}</Text>
          </Box>
        </Stack>
        {book?.id && <CheckoutHistory bookId={book?.id} />}
      </Container>
    </>
  );
}
