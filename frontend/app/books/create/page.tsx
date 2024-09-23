"use client";

import { ACCESS_TOKEN_KEY } from "@/app/_components/auth";
import Header from "@/app/_components/Header";
import { post } from "@/app/_lib/client";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import useLocalStorageState from "use-local-storage-state";

type BookInput = {
  title: string;
  isbn: string;
  author: string;
  description: string;
};

export default function CreateBook() {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<BookInput>();

  const onSubmit: SubmitHandler<BookInput> = async (values) => {
    const res = await post({
      destination: "/api/v1/books",
      token: accessToken,
      body: values,
    });

    if (res.ok) {
      router.push("/");
    }
  };

  return (
    <>
      <Header></Header>
      <Container maxW="container.xl" my={20}>
        <Heading as="h2" size="2xl" mb={2}>
          新しい蔵書を登録する
        </Heading>
        <Container maxW="container.md" my={20}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.isbn} mb={5} isRequired>
              <FormLabel htmlFor="isbn">ISBN</FormLabel>
              <Input
                id="isbn"
                placeholder="ISBN (ISBN-10またはISBN-13)"
                {...register("isbn", {
                  required: "ISBNは必須です",
                  maxLength: {
                    value: 13,
                    message:
                      "ISBNは最大で13文字まで入力可能です（ハイフンなし）",
                  },
                })}
              />
              <FormErrorMessage>{errors.isbn?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.title} mb={5} isRequired>
              <FormLabel htmlFor="title">タイトル</FormLabel>
              <Input
                id="title"
                placeholder="書籍タイトル"
                {...register("title", { required: "タイトルは必須です" })}
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>
            <FormLabel htmlFor="author">著者名</FormLabel>
            <Input
              id="author"
              placeholder="著者名"
              {...register("author", { required: "著者名は必須です" })}
            />
            <FormErrorMessage>{errors.author?.message}</FormErrorMessage>
            <FormControl isInvalid={!!errors.description} mb={5} isRequired>
              <FormLabel htmlFor="description">書籍概要</FormLabel>
              <Textarea
                id="description"
                placeholder="書籍の概要"
                {...register("description", {
                  required: "書籍概要は必須です",
                  maxLength: {
                    value: 2048,
                    message: "書籍概要は最大で2048文字まで入力可能です",
                  },
                })}
                rows={6}
              />
              <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
            </FormControl>
            <Button type="submit" isLoading={isSubmitting}>
              蔵書を新規登録する
            </Button>
          </form>
        </Container>
      </Container>
    </>
  );
}
