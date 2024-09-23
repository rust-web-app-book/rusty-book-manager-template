"use client";

import {
  Card,
  Stack,
  CardBody,
  Heading,
  Text,
  Container,
  SimpleGrid,
  Box,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  LinkBox,
  LinkOverlay,
  Tag,
  CardFooter,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Header from "./_components/Header";
import { FC } from "react";
import NextLink from "next/link";
import { Book } from "./_types/book";
import { useBooks } from "./_contexts/book";
import { NextPage } from "next";
import Pagination from "./_components/Pagination";

const BOOKS_PER_PAGE = 12;

const Home: NextPage = ({
  searchParams,
}: {
  searchParams?: {
    limit?: string;
    offset?: string;
  };
}) => {
  const currentLimit = Number(searchParams?.limit) || BOOKS_PER_PAGE;
  const currentOffset = Number(searchParams?.offset) || 0;

  const { books } = useBooks({ limit: currentLimit, offset: currentOffset });
  const limit = books?.limit ?? BOOKS_PER_PAGE;
  const offset = books?.offset ?? 0;
  const total = books?.total ?? 0;

  return (
    <>
      <Header></Header>
      <Container maxW="container.xl" my={20}>
        <Pagination limit={limit} offset={offset} total={total} />

        <SimpleGrid minChildWidth={300} spacing={10} margin={10}>
          {books?.items.map((book) => (
            <BookCard key={book.id} data={book} />
          ))}
        </SimpleGrid>

        <Pagination limit={limit} offset={offset} total={total} />
      </Container>
    </>
  );
};

export default Home;

type BookTableProps = {
  data: Book;
};

const BookCard: FC<BookTableProps> = ({ data }: BookTableProps) => {
  return (
    <LinkBox
      as={Card}
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
    >
      <Stack>
        <CardBody>
          <Heading size="md">
            <LinkOverlay as={NextLink} href={`/books/${data.id}`}>
              {data.title}
            </LinkOverlay>
          </Heading>
          <Text py="2">{data.author}</Text>
        </CardBody>
        <CardFooter>
          {data.checkout ? (
            <Tag>{`${data.checkout?.checkedOutBy?.name} に貸出中`}</Tag>
          ) : (
            <></>
          )}
        </CardFooter>
      </Stack>
    </LinkBox>
  );
};
