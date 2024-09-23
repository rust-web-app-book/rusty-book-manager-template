"use client";

import { Button, Flex, Spacer, Text } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";

type PaginationProps = {
  limit: number;
  offset: number;
  total: number;
};

const Pagination: FC<PaginationProps> = ({
  limit,
  offset,
  total,
}: PaginationProps) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  const createPageURL = (limit: number, offset: number) => {
    const params = new URLSearchParams();
    params.set("limit", limit.toString());
    params.set("offset", offset.toString());
    return `${pathname}?${params.toString()}`;
  };

  const last = Math.min(offset + limit, total);

  return (
    <Flex>
      <Button
        isDisabled={offset <= 0}
        onClick={() =>
          replace(createPageURL(limit, Math.max(offset - limit, 0)))
        }
      >
        Preview
      </Button>

      <Spacer />
      <Text>
        {offset + 1} - {last} / {total}
      </Text>
      <Spacer />
      <Button
        isDisabled={last == total}
        onClick={() => replace(createPageURL(limit, last))}
      >
        Next
      </Button>
    </Flex>
  );
};

export default Pagination;
