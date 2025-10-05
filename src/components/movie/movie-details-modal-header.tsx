'use client';

import { ChevronDown, ChevronsRight, ChevronUp } from 'lucide-react';

import { Button } from '../common/button';
import { ModalClose } from '../common/modal';
import { Header } from '../layout/header';

type Props = {
  addToWatchlistButton?: React.ReactNode;
};

export const MovieDetailsModalHeader = ({ addToWatchlistButton }: Props) => {
  return (
    <Header className="bg-background-1/80 sticky top-0 z-50 backdrop-blur-md">
      <ModalClose asChild>
        <Button className="!mix-blend-difference" size="icon">
          <ChevronsRight className="size-5" strokeWidth={2.5} />
        </Button>
      </ModalClose>
      <div className="ml-auto flex items-center gap-1">
        <Button className="!mix-blend-difference" size="icon">
          <ChevronUp className="size-5" strokeWidth={2.5} />
        </Button>
        <Button className="!mix-blend-difference" size="icon">
          <ChevronDown className="size-5" strokeWidth={2.5} />
        </Button>
        {addToWatchlistButton}
      </div>
    </Header>
  );
};
