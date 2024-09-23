"use client";

import { ACCESS_TOKEN_KEY } from "@/app/_components/auth";
import Header from "@/app/_components/Header";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import useLocalStorageState from "use-local-storage-state";
import { put } from "@/app/_lib/client";

type UserPasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export default function UpdateUserPassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<UserPasswordInput>();

  const onSubmit: SubmitHandler<UserPasswordInput> = async (values) => {
    const res = await put({
      destination: "/api/v1/users/me/password",
      token: accessToken,
      body: values,
    });

    if (res.ok) {
      toast({
        title: "パスワードを変更しました",
        description: "新しいパスワードへの変更が完了しました",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/");
    } else {
      toast({
        title: "パスワードを変更できません",
        description:
          "パスワードの変更に失敗しました。現在のパスワードを確認するか、管理者に連絡してください。",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Header></Header>
      <Container maxW="container.xl" my={20}>
        <Heading as="h2" size="2xl" mb={2}>
          パスワード変更
        </Heading>
        <Container maxW="container.md" my={20}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.currentPassword} mb={5} isRequired>
              <FormLabel htmlFor="currentPassword">現在のパスワード</FormLabel>
              <InputGroup>
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="現在のパスワードを入力してください"
                  {...register("currentPassword", {
                    required: "入力必須です",
                  })}
                />
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowCurrentPassword(
                      (showCurrentPassword) => !showCurrentPassword
                    )
                  }
                >
                  {showCurrentPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputGroup>
              <FormErrorMessage>
                {errors.currentPassword?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.newPassword} mb={5} isRequired>
              <FormLabel htmlFor="newPassword">新しいパスワード</FormLabel>
              <InputGroup>
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="新しいパスワードを入力してください"
                  {...register("newPassword", {
                    required: "入力必須です",
                  })}
                />{" "}
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowNewPassword((showNewPassword) => !showNewPassword)
                  }
                >
                  {showNewPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputGroup>
              <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
            </FormControl>
            <Button type="submit" isLoading={isSubmitting}>
              変更
            </Button>
          </form>
        </Container>
      </Container>
    </>
  );
}
