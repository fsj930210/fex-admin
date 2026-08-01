<script setup lang="ts">
import AcceptDemo from './accept-demo.vue'
import DirectoryDemo from './directory-demo.vue'
import DropPasteDemo from './drop-paste-demo.vue'
import InstantUploadDemo from './instant-upload-demo.vue'
import MultipartMd5Demo from './multipart-md5-demo.vue'
import MultipleDemo from './multiple-demo.vue'
import ResumeUploadDemo from './resume-upload-demo.vue'
import RetryUploadDemo from './retry-upload-demo.vue'
import SingleDemo from './single-demo.vue'
import ValidationDemo from './validation-demo.vue'
</script>
<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/"
          >返回首页</RouterLink
        >
        <div>
          <h1 class="text-2xl font-semibold text-foreground">Upload 上传</h1>
          <p class="max-w-3xl text-sm leading-6 text-muted-foreground">
            基于可选 feature 组合的上传 primitive，所有请求都连接本地 Node 上传服务。
          </p>
        </div>
      </header>
      <div class="space-y-space-xl">
        <SingleDemo /><MultipleDemo /><AcceptDemo /><DirectoryDemo /><DropPasteDemo /><MultipartMd5Demo /><ResumeUploadDemo /><RetryUploadDemo /><InstantUploadDemo /><ValidationDemo />
      </div>
    </div>
  </main>
</template>
