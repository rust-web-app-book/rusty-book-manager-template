"use client";

import { ACCESS_TOKEN_KEY } from "@/app/_components/auth";
import Header from "@/app/_components/Header";
import { useBook } from "@/app/_contexts/book";
import { put } from "@/app/_lib/client";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";

export default function EditBook({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();

  const { book } = useBook(params.id);
  const [input, setInput] = useState(
    book ?? {
      title: "",
      isbn: "",
      author: "",
      description: "",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const onClickSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const res = await put({
      destination: `/api/v1/books/${params.id}`,
      token: accessToken,
      body: input,
    });

    if (res.ok) {
      router.push(`/books/${params.id}`);
    }
  };

  return (
    <>
      <Header></Header>
      <Container maxW="container.xl" my={20}>
        <Heading as="h2" size="2xl" mb={2}>
          蔵書を編集する
        </Heading>
        <Container maxW="container.md" my={20}>
          <FormControl id="isbn" mb={5} isRequired>
            <FormLabel htmlFor="isbn">ISBN</FormLabel>
            <Stack direction="row">
              <Input
                id="isbn"
                name="isbn"
                value={input.isbn}
                onChange={handleChange}
                placeholder="ISBN10またはISBN13を入力"
              />
              <Button>自動入力</Button>
            </Stack>
          </FormControl>
          <FormControl id="title" mb={5} isRequired>
            <FormLabel htmlFor="title">書籍タイトル</FormLabel>
            <Input
              id="title"
              name="title"
              value={input.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="author" mb={5} isRequired>
            <FormLabel htmlFor="author">著者</FormLabel>
            <Input
              id="author"
              name="author"
              value={input.author}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="description" mb={5} isRequired>
            <FormLabel htmlFor="description">書籍概要</FormLabel>
            <Textarea
              id="description"
              name="description"
              value={input.description}
              onChange={handleChange}
              placeholder="1024文字以内で入力してください"
              rows={6}
            />
          </FormControl>
          <Button onClick={onClickSubmit}>蔵書を更新する</Button>
        </Container>
      </Container>
    </>
  );
}
