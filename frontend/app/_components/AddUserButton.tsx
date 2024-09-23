import { ACCESS_TOKEN_KEY } from "@/app/_components/auth";
import React, { FC, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Text,
  Flex,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import useLocalStorageState from "use-local-storage-state";
import { SubmitHandler, useForm } from "react-hook-form";
import { post } from "../_lib/client";
import { useSWRConfig } from "swr";

type UserInput = {
  name: string;
  email: string;
  password: string;
};

const AddUserButton: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // 成功メッセージモーダルの表示制御
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const toast = useToast();
  const { mutate } = useSWRConfig();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserInput>();

  const onSubmit: SubmitHandler<UserInput> = async (values) => {
    const res = await post({
      destination: "/api/v1/users",
      token: accessToken,
      body: values,
    });

    if (res.ok) {
      setUserInput(values);
      reset();
      onClose();
      setIsSuccessModalOpen(true);
      mutate(["/api/v1/users", accessToken]);
    } else {
      toast({
        title: "ユーザーを作成できませんでした",
        description: "サーバーからエラー応答が返却されました。",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Flex justifyContent="flex-end" mb="4">
        <Button colorScheme="green" onClick={onOpen}>
          Add User
        </Button>
      </Flex>

      {/* ユーザー追加モーダル */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mb={4} isInvalid={!!errors.name} isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  id="name"
                  placeholder="User Name"
                  {...register("name", {
                    required: "ユーザー名は必須です",
                  })}
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>{" "}
              </FormControl>
              <FormControl my={4} isInvalid={!!errors.email} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  id="email"
                  placeholder="User Email"
                  {...register("email", {
                    required: "Eメールアドレスは必須です",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Eメールアドレス形式で入力してください",
                    },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl my={4} isInvalid={!!errors.password} isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  id="password"
                  placeholder="User Password"
                  {...register("password", { required: "パスワード必須です" })}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>
              <Flex justifyContent="flex-end">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="blue"
                  mr={3}
                >
                  Submit
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </Flex>
            </form>
          </ModalBody>

          <ModalFooter />
        </ModalContent>
      </Modal>

      {/* 成功メッセージモーダル */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ユーザーを作成しました</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>ユーザー名：{userInput?.name}</Text>
            <Text>メールアドレス：{userInput?.email}</Text>
            <Text>パスワード：{userInput?.password}</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                setUserInput(null);
                setIsSuccessModalOpen(false); // 成功メッセージモーダルを閉じる
              }}
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddUserButton;
