"use client";

import Header from "@/app/_components/Header";
import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useCurrentUser, useUsers } from "@/app/_contexts/user";
import UserTable from "@/app/_components/UserTable";
import AddUserButton from "@/app/_components/AddUserButton";

export default function ListUser() {
  const { currentUser } = useCurrentUser();
  const { users } = useUsers();

  return (
    <>
      <Header></Header>
      <Container maxW="container.xl" my={20}>
        <Heading as="h2" size="2xl" mb={2}>
          ユーザー一覧
        </Heading>
        <Container maxW="container.md" my={20}>
          {users && currentUser ? (
            <Stack>
              {currentUser.role === "Admin" && <AddUserButton />}
              <UserTable users={users.items} currentUser={currentUser} />
            </Stack>
          ) : (
            <Text>ユーザーの一覧を取得できませんでした</Text>
          )}
        </Container>
      </Container>
    </>
  );
}
