<script
  setup
  lang="ts"
  generic="
    T extends {
      label: string;
      value: string;
    }
  "
>
import { TabsList, TabsRoot, TabsTrigger } from "reka-ui";

defineProps<{ tabs: T[]; defaultTab: string, action?: (tab: T) => void, tabListClass?: string }>();
</script>

<template>
  <TabsRoot :default-value="defaultTab" class="space-y-4">
    <TabsList
      :class="['items-center justify-center rounded-2xl bg-neutral p-1 text-neutral-content grid w-full grid-cols-2 mb-6', tabListClass]"
    >
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.label"
        :value="tab.value"
        @click="action?.(tab)"
        :class="[
          'inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2',
          'text-sm font-medium ring-offset-base-100 transition-all data-[state=active]:bg-base-100',
          'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          'data-[state=active]:text-base-content data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2',
        ]"
      >
        <slot name="tab" :tab="tab">{{ tab.label }}</slot>
      </TabsTrigger>
    </TabsList>
    <slot />
  </TabsRoot>
</template>
