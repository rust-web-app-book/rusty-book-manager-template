import {
  Card,
  CardBody,
  CardFooter,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FC } from "react";

export type Book = {
  id: string;
  title: string;
  author: string;
};

type BookTableProps = {
  data: Book;
  appendButton?: React.ReactNode;
};

const BookTable: FC<BookTableProps> = ({ data, appendButton }) => {
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

        <CardFooter>{appendButton}</CardFooter>
      </Stack>
    </LinkBox>
  );
};

export default BookTable;
