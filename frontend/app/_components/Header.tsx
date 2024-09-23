import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import useLocalStorageState from "use-local-storage-state";
import { ACCESS_TOKEN_KEY } from "./auth";
import { FC } from "react";
import { useCurrentUser } from "../_contexts/user";
import { post } from "../_lib/client";

const Header: FC = () => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();

  const onClickLogout = async () => {
    // TODO: components内でリクエストを飛ばさないようにしたい。外からpropsで渡す。
    await post({ destination: "/auth/logout", token: accessToken });
    router.push("/login");
  };

  const { currentUser } = useCurrentUser();

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            color={useColorModeValue("gray.800", "white")}
            fontFamily={"heading"}
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            as={NextLink}
            href="/"
          >
            Rusty Book Manager
          </Text>
        </Flex>
        <Spacer />
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          alignItems={"center"}
          spacing={6}
        >
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <Avatar size={"sm"} name={currentUser?.name} />
            </MenuButton>
            <MenuList>
              <MenuGroup title="メニュー">
                <MenuItem as={NextLink} href="/books/checkouts/me">
                  借りている本
                </MenuItem>
                <MenuItem as={NextLink} href="/books/create">
                  蔵書の新規登録
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="管理メニュー">
                <MenuItem as={NextLink} href="/books/checkouts">
                  貸出中の蔵書一覧
                </MenuItem>
                <MenuItem as={NextLink} href="/users">
                  ユーザー一覧
                </MenuItem>
              </MenuGroup>
              <MenuGroup title="個人設定">
                <MenuItem as={NextLink} href="/users/password">
                  パスワード変更
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuItem onClick={onClickLogout}>ログアウト</MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Header;
