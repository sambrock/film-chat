import { ChevronDown } from 'lucide-react';

import { models } from '~/lib/ai/models';
import { cn } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { Button } from '../ui/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../ui/dropdown';
import { useChatContext } from './chat-context-provider';

export const ChatModelSelect = () => {
  const { conversationId } = useChatContext();

  const selectedModel = useGlobalStore((s) => s.model.get(conversationId) || s.defaultModel);
  const dispatch = useGlobalStore((s) => s.dispatch);

  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <Button variant="ghost" className="!text-foreground-0/60 !rounded-full !px-2">
          {models.get(selectedModel)?.name}
          <ChevronDown className="size-5" />
        </Button>
      </DropdownTrigger>

      <DropdownContent className="min-w-80 origin-bottom-left" align="start" side="top" sideOffset={2}>
        {[...models.values()].map((model) => (
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
