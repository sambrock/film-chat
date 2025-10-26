import { useRef } from 'react';

import { useGlobalStore } from '~/stores/global-store-provider';
import { useMutationRenameChat, useMutationRenameChatUtils } from '~/hooks/use-mutation-rename-chat';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type Props = {
  conversationId: string;
  title: string;
};

export const PopoverRenameChat = ({
  conversationId,
  title,

  ...props
}: React.PropsWithChildren<Props>) => {
  const isActive = useGlobalStore((s) => s.renameChat === conversationId);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const mutationRenameChat = useMutationRenameChat();
  const { optimisticRenameChat } = useMutationRenameChatUtils();

  const timeoutRef = useRef<NodeJS.Timeout>(null);

  return (
    <Popover
      open={isActive}
      onOpenChange={(open) => {
        dispatch({ type: 'SET_RENAME_CHAT', payload: open ? { conversationId } : undefined });
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="transparent" size="sm" className="hover:bg-secondary px-1" asChild>
          {props.children}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="rounded-lg p-1">
        <Input
          defaultValue={title}
          minLength={1}
          maxLength={30}
          onChange={(e) => {
            if (e.target.value && e.target.value.length !== 0) {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              timeoutRef.current = setTimeout(() => {
                mutationRenameChat.mutate({ conversationId, title: e.target.value });
              }, 300);
              optimisticRenameChat(conversationId, e.target.value);
            }
          }}
          onFocus={(e) => {
            e.target.select();
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
};
