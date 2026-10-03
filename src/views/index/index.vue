<!-- 布局容器 -->
<template>
  <div class="app-layout">
    <aside id="app-sidebar">
      <AoSidebarMenu />
    </aside>

    <main id="app-main">
      <div id="app-header">
        <AoHeaderBar />
      </div>
      <div id="app-content">
        <AoPageContent />
      </div>
    </main>

    <div id="app-global">
      <AoGlobalComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'AppLayout' })
</script>

<style lang="scss" scoped>
  .app-layout {
    display: flex;
    width: 100%;
    min-height: 100vh;
    background: var(--default-bg-color);
    #app-sidebar {
      flex-shrink: 0;
    }
    #app-main {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-width: 0;
      height: 100vh;
      overflow: auto;
      #app-header {
        position: sticky;
        top: 0;
        z-index: 50;
        flex-shrink: 0;
        width: 100%;
        // 与底部留白同源，统一由 --ao-page-gap 控制
        padding-bottom: var(--ao-page-gap);
      }
      #app-content {
        flex: 1;
        :deep(.layout-content) {
          box-sizing: border-box;
          width: calc(100% - 20px);
          margin: auto;
          // 子页面默认 style
          .page-content {
            position: relative;
            box-sizing: border-box;
            padding: 20px;
            overflow: hidden;
            background: var(--default-box-color);
            border-radius: calc(var(--custom-radius) / 2 + 2px) !important;
          }
        }
      }
    }
  }

  @media only screen and (width <= 1180px) {
    .app-layout {
      #app-main {
        height: 100dvh;
      }
    }
  }

  @media only screen and (width <= 800px) {
    .app-layout {
      position: relative;
      #app-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 300;
        height: 100vh;
      }
      #app-main {
        width: 100%;
        height: auto;
        overflow: visible;
        #app-content {
          :deep(.layout-content) {
            width: calc(100% - 20px);
          }
        }
      }
    }
  }

  @media only screen and (width <= 640px) {
    .app-layout {
      #app-main {
        #app-content {
          :deep(.layout-content) {
            width: calc(100% - 20px);
          }
        }
      }
    }
  }
</style>
