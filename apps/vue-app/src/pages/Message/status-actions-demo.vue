<script setup lang="ts">
import { Bubble, BubbleContent } from '@fex-design/vue/primitive/bubble'
import { Message, MessageAction, MessageActions, MessageBody, MessageContent, MessageFooter, MessageStatus } from '@fex-design/vue/primitive/message'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'
const liked = ref(false)
</script>
<template><Card title="Actions" description="Place message-level controls and delivery operations in MessageFooter; business events remain caller-owned."><div class="mx-auto grid w-full max-w-2xl gap-10 py-8"><Message><MessageBody><MessageContent><Bubble><BubbleContent>The install failure is coming from the<br/>workspace package.</BubbleContent></Bubble></MessageContent><MessageFooter><MessageActions visibility="always"><MessageAction aria-label="Copy response">Copy</MessageAction><MessageAction aria-label="Helpful" :pressed="liked" @change="liked=$event">Like</MessageAction><MessageAction aria-label="Not helpful">Dislike</MessageAction></MessageActions></MessageFooter></MessageBody></Message><Message side="end"><MessageBody><MessageContent><Bubble variant="solid"><BubbleContent>Okay, drop me a link. Taking a look...</BubbleContent></Bubble></MessageContent><MessageFooter><MessageStatus tone="danger">Failed to send</MessageStatus><MessageActions visibility="always"><MessageAction><template #render="{ props }"><Button v-bind="props" variant="ghost" size="xs">Retry</Button></template></MessageAction></MessageActions></MessageFooter></MessageBody></Message></div></Card></template>
