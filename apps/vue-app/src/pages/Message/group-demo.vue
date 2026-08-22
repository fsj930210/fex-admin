<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@fex-design/vue/primitive/avatar'
import { Bubble, BubbleContent } from '@fex-design/vue/primitive/bubble'
import { Message, MessageAvatar, MessageBody, MessageContent, MessageGroup } from '@fex-design/vue/primitive/message'
import Card from '@fex-design/vue/ui/card'
</script>
<template><Card title="Group" description="Use an empty MessageAvatar on earlier rows so only the final message displays the sender avatar."><MessageGroup class="mx-auto w-full max-w-2xl py-8" spacing="compact"><Message><MessageAvatar/><MessageBody><MessageContent><Bubble><BubbleContent>I checked the registry addresses.</BubbleContent></Bubble></MessageContent></MessageBody></Message><Message><MessageAvatar><Avatar><AvatarImage src="/avatar-demo.svg" alt="Oliver"/><AvatarFallback>O</AvatarFallback></Avatar></MessageAvatar><MessageBody><MessageContent><Bubble><BubbleContent>The component and example JSON<br/>now live under the UI registry.</BubbleContent></Bubble></MessageContent></MessageBody></Message></MessageGroup></Card></template>
