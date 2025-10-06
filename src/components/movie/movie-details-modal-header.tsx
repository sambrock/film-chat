'use client';

import { ChevronDown, ChevronsRight, ChevronUp } from 'lucide-react';

import { Button } from '../common/button';
import { ModalClose } from '../common/modal';
import { Header } from '../layout/header';

type Props = {
  addToWatchlistButton?: React.ReactNode;
  nextMovie: () => void;
  previousMovie: () => void;
};

export const MovieDetailsModalHeader = ({ addToWatchlistButton, nextMovie, previousMovie }: Props) => {
  return (
    <Header className="sticky top-0 z-50">
      <ModalClose asChild>
        <Button size="icon">
          <ChevronsRight className="size-5" strokeWidth={2.5} />
        </Button>
      </ModalClose>

      <div className="ml-auto flex items-center gap-1">
        <Button size="icon" onClick={previousMovie}>
          <ChevronUp className="size-5" strokeWidth={2.5} />
        </Button>
        <Button size="icon" onClick={nextMovie}>
          <ChevronDown className="size-5" strokeWidth={2.5} />
        </Button>
        {/* {addToWatchlistButton} */}
      </div>
    </Header>
  );
};
