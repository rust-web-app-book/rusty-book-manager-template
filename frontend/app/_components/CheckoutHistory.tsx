import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useBookCheckouts } from "../_contexts/checkout";
import { useUsers } from "../_contexts/user";
import { FC } from "react";

type CheckoutHistoryProps = {
  bookId: string;
};

const CheckoutHistory: FC<CheckoutHistoryProps> = ({
  bookId,
}: CheckoutHistoryProps) => {
  const { checkouts } = useBookCheckouts(bookId);
  const { users } = useUsers();
  const userItems = users?.items;

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>貸出日</Th>
            <Th>返却日</Th>
            <Th>貸出者</Th>
          </Tr>
        </Thead>
        <Tbody>
          {checkouts?.map((co) => (
            <Tr key={co.id}>
              <Td>{co.checkedOutAt}</Td>
              <Td>{co.returnedAt ?? "-"}</Td>
              <Td>
                {userItems?.find((user) => user.id === co.checkedOutBy)?.name}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CheckoutHistory;
