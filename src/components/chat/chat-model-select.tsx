'use client';

import { ChevronDown } from 'lucide-react';

import { models } from '@/lib/ai/models';
import { cn } from '@/lib/utils';
import { useConversationContext } from '@/providers/conversation-context-provider';
import { useGlobalStore } from '@/providers/global-store-provider';
import { Button } from '../common/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../common/dropdown';

export const ChatModelSelect = () => {
  const { conversationId } = useConversationContext();

  const selectedModel = useGlobalStore((s) => s.chatModel.get(conversationId) || s.model);
  const dispatch = useGlobalStore((s) => s.dispatch);

  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <Button className="text-sm" size="sm" variant="ghost">
          {models.get(selectedModel)?.name}
          <ChevronDown className="size-5" />
        </Button>
      </DropdownTrigger>

      <DropdownContent className="min-w-80 origin-bottom-left" align="start" side="top" sideOffset={2}>
        {models.values().map((model) => (
          <DropdownItem
            key={model.model}
            className={cn(model.model === selectedModel && 'bg-background-1/50')}
            onClick={() => dispatch({ type: 'SET_MODEL', payload: { conversationId, model: model.model } })}
          >
            <div className="flex items-end gap-3">
              <span className="font-medium">{model.name}</span>
              <span className="text-foreground-1 ml-auto w-14 text-right text-xs">{model.provider}</span>
            </div>
          </DropdownItem>
        ))}
      </DropdownContent>
    </DropdownRoot>
  );
};
