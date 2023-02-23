<template>
  <NaiveConfig :theme-config="themeConfig">
    <n-message-provider>
      <NaiveColorModeSwitch />
      <NuxtPage />
    </n-message-provider>
  </NaiveConfig>
</template>

<script setup lang="ts">
import { ThemeConfig } from "@bg-dev/nuxt-naiveui"

const themeConfig: ThemeConfig = {
  shared: {
    common: {
      fontFamily: "Gellix",
    },
    Form: {
      feedbackTextColorError: "#b91c1c",
      feedbackFontSizeMedium: "13px",
      blankHeightMedium: "40px",
      asteriskColor: "#b91c1c",
    }
  },

  light: {
    common: {
      bodyColor: "#fafafa",
    },
    Card: {
      color: "transparent"
    },
    Input: {
      color: "#fafafa",
    }

  },

  dark: {
    common: {
      bodyColor: "#171717"
    },
    Card: {
      color: "transparent"
    }
  },

  mobileOrTablet: {
    common: {
      fontSize: "15px"
    },
    Form: {
      labelFontSizeTopMedium: "15px"
    },
    Input: {
      heightMedium: "40px",
      fontSizeMedium: "15px",
    },
    Button: {
      heightMedium: "40px",
      fontSizeMedium: "15px"
    },
    Card: {
      fontSizeMedium: "15px"
    },
  }

}
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: none;
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.2s;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: none;
}
</style>