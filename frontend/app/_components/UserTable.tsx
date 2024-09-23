import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { User } from "../_types/user";
import DeleteUserButton from "./DeleteUserButton";
import UpdateUserRoleSelector from "./UpdateUserRoleSelector";
import { FC } from "react";

type UserTableProps = {
  users: User[];
  currentUser: User;
};

const UserTable: FC<UserTableProps> = ({
  users,
  currentUser,
}: UserTableProps) => {
  const isAdmin = currentUser.role === "Admin";

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            {isAdmin && <Th></Th>}
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                {isAdmin ? (
                  <UpdateUserRoleSelector
                    user={user}
                    isCurrentUser={user.id === currentUser.id}
                  />
                ) : (
                  user.role
                )}
              </Td>
              {isAdmin && (
                <Td>
                  {user.id !== currentUser.id && (
                    <DeleteUserButton user={user} />
                  )}
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
