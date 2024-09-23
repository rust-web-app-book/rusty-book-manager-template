"use client";

import BookTable from "@/app/_components/BookTable";
import Header from "@/app/_components/Header";
import ReturnButton from "@/app/_components/ReturnButton";
import { useCheckouts } from "@/app/_contexts/checkout";
import { useCurrentUser } from "@/app/_contexts/user";
import { Box, Container, Heading, Text } from "@chakra-ui/react";

export default function CheckedOutBookList() {
  const { checkouts } = useCheckouts();
  const { currentUser } = useCurrentUser();

  return (
    <>
      <Header></Header>
      <Container maxW="container.xl" my={20}>
        <Heading as="h2" size="2xl" mb={10}>
          貸出中の蔵書
        </Heading>
        {checkouts && checkouts?.length > 0 ? (
          checkouts?.map((co) => {
            return (
              <Box mb={5} key={co.id}>
                <BookTable
                  key={co.book.id}
                  data={co.book}
                  appendButton={
                    currentUser?.id === co.checkedOutBy ? (
                      <ReturnButton checkout={co} />
                    ) : undefined
                  }
                />
              </Box>
            );
          })
        ) : (
          <Text>現在貸出中の蔵書はありません</Text>
        )}
      </Container>
    </>
  );
}
