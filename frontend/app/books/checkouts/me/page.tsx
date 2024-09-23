"use client";

import BookTable from "@/app/_components/BookTable";
import Header from "@/app/_components/Header";
import ReturnButton from "@/app/_components/ReturnButton";
import { useMyCheckouts } from "@/app/_contexts/checkout";
import { Box, Container, Heading, Text } from "@chakra-ui/react";

export default function CheckedOutBookList() {
  const { checkouts } = useMyCheckouts();

  return (
    <>
      <Header></Header>
      <Container maxW="container.xl" my={20}>
        <Heading as="h2" size="2xl" mb={10}>
          借りている蔵書
        </Heading>
        {checkouts && checkouts?.length > 0 ? (
          checkouts?.map((co) => {
            return (
              <Box mb={5} key={co.id}>
                <BookTable
                  key={co.book.id}
                  data={co.book}
                  appendButton={<ReturnButton checkout={co} />}
                />
              </Box>
            );
          })
        ) : (
          <Text>現在借りている蔵書はありません</Text>
        )}
      </Container>
    </>
  );
}
