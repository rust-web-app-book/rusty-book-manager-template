import { FC, useRef } from "react";
import { ACCESS_TOKEN_KEY } from "./auth";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import useLocalStorageState from "use-local-storage-state";
import { User } from "../_types/user";
import { del } from "../_lib/client";
import { useSWRConfig } from "swr";

type DeleteUserButtonProps = {
  user: User;
};

const DeleteUserButton: FC<DeleteUserButtonProps> = ({
  user,
}: DeleteUserButtonProps) => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const { isOpen, onOpen, onClose } = useDisclosure({ id: "delete-book" });
  const toast = useToast();
  const cancelRef = useRef(null);
  const { mutate } = useSWRConfig();

  const handleDelete = async () => {
    const res = await del({
      destination: `/api/v1/users/${user.id}`,
      token: accessToken,
    });

    if (res.ok) {
      toast({
        title: "ユーザーを削除しました",
        description: `ユーザー「${user.name}」を削除しました`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      mutate(["/api/v1/users", accessToken]);
    } else {
      toast({
        title: "ユーザーを削除できませんでした",
        description: "サーバーからエラー応答が返却されました。",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <IconButton
        aria-label="delete user"
        id="delete-user"
        icon={<DeleteIcon />}
        onClick={onOpen}
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontWeight="bold"></AlertDialogHeader>
            <AlertDialogBody>{`ユーザー「${user.name}」を削除しますか？`}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteUserButton;
