<script setup lang="ts">
import type {} from "nuxt-swiper";
import { useClipboard } from "@vueuse/core";
import type { CarouselItem } from "@nuxt/ui";

const { header, repository, contribueUrl, docHomePage } = useAppConfig();
const copy = useClipboard({});

const advantages = {
  control: {
    icon: "i-lucide-shield-check",
    to: { name: "control-sovereignty" },
  },
  dx: { icon: "i-lucide-folder-code", to: { name: "dx" } },
  simplicity: { icon: "i-lucide-book-text", to: docHomePage },
};

const features = {
  pipeline: {},
  cvtheque: {},
  collaboration: {},
  career_site: {},
};

const allFeatures = {
  pipeline: { icon: "i-lucide-workflow" },
  cv_parser: { icon: "i-lucide-file-text" },
  candidate_management: { icon: "i-lucide-users-round" },
  collaboration: { icon: "i-lucide-shield-user" },
  communication: { icon: "i-lucide-messages-square" },
  job_distribution: { icon: "i-lucide-share-2" },
  security: { icon: "i-lucide-shield-check" },
  deployment: { icon: "i-lucide-server" },
  career_site: { icon: "i-lucide-globe" },
  ai_matching: { icon: "i-lucide-sparkles" },
};

const featureCarouseContainer = useTemplateRef("features-carousel");
const swiper = useSwiper(featureCarouseContainer, {
  effect: "slide",
  loop: true,
  spaceBetween: 20,
  slidesPerView: "auto",
  autoplay: { delay: 1500, pauseOnMouseEnter: true },
  slidesOffsetBefore: 20,
  slidesOffsetAfter: 20,
});
</script>

<template>
  <Container :ui="{ content: 'min-h-' }">
    <template #top> </template>

    <u-container class="py-36 text-center">
      <UBadge color="primary" size="lg" variant="soft" class="mb-3">
        <MDC :value="$t('pages.index.hero.badge')" unwrap="p" />
      </UBadge>

      <h1 class="text-4xl md:text-6xl font-bold max-w-200 mx-auto">
        <MDC :value="$t('pages.index.hero.title')" unwrap="p" />
      </h1>

      <p class="mt-5 text-2xl max-w-230 mx-auto">
        <MDC :value="$t('pages.index.hero.subtitle')" unwrap="p" />
      </p>

      <div
        class="flex items-center gap-2 sm:flex-row flex-col justify-center pt-10"
      >
        <u-button
          :to="
            $localePath({ name: 'docs-slug', params: { slug: 'deployment' } })
          "
          size="xl"
          color="primary"
          variant="solid"
          class="p-3 px-4 rounded-4xl"
          icon="i-lucide-rocket"
        >
          <!-- icon="i-lucide-newspaper" -->
          {{ $t("pages.index.hero.cta_primary") }}
        </u-button>
        <u-button
          :to="repository"
          target="_blank"
          size="xl"
          variant="solid"
          color="neutral"
          class="border-default p-3 px-4 rounded-4xl"
        >
          {{ $t("pages.index.hero.cta_secondary") }}
        </u-button>
      </div>

      <div class="hidden items-center justify-center px-5">
        <div
          class="bg-surface border border-default flex items-center justify-center gap-0 px-2 py-1 max-w-11/12 rounded-lg mt-5 cursor-copy"
          @click="
            copy.copy(
              '// curl -o- https://raw.githubusercontent.com/domutala/worcable/install.sh | bash'
            )
          "
        >
          <div class="shrink-0">curl -o-</div>
          <div class="truncate min-w-0 flex-1">
            https://raw.githubusercontent.com/domutala/worcable
          </div>
          <div class="shrink-">/install.sh | bash</div>

          <u-icon v-if="copy.copied.value" name="i-lucide-check" class="ml-3" />
          <u-icon v-else name="i-lucide-copy" class="ml-3" />
        </div>
      </div>
    </u-container>

    <div
      class="flex not-lg:flex-col lg:divide-x not-lg:divide-y divide-default border-t border-default"
    >
      <AppLinkAnime
        v-for="(advantage, code) in advantages"
        :label="$t('words.know_more')"
        :key="code"
        :to="$localePath(advantage.to)"
        class="border-default w-full group/link-anime px-10 py-5 flex flex-col gap-2 hover:highlighted"
      >
        <div>
          <u-icon :name="advantage.icon" class="size-8 opacity-50" />
        </div>

        <div>
          <h3 class="text-xl font-bold">
            <MDC
              unwrap="p"
              :value="$t(`pages.index.advantages.items.${code}.title`)"
            />
          </h3>

          <p class="opacity-80 max-w-180">
            <MDC
              unwrap="p"
              :value="$t(`pages.index.advantages.items.${code}.description`)"
            />
          </p>
        </div>
      </AppLinkAnime>
    </div>
  </Container>

  <Container
    class="hidden"
    :ui="{
      content: 'bg-surface relative overflow-hidden',
    }"
  >
    <div class="absolute inset-0 object-cover object-center">
      <img
        src="/images/bloom.png"
        class="size-full object-cover object-center"
      />
    </div>

    <div
      class="mt-35 mx-auto max-w-220 w-11/12 ring- ring-primary-200 rounded-t-2xl overflow-auto bg-default relative"
    >
      <img
        src="/images/screenshot_desktop_light.jpeg"
        class="mt-auto object-cover object-top border-default block"
      />
    </div>
  </Container>

  <Container :ui="{ content: 'bg-' }">
    <u-container class="py-20 text-center max-w-4xl">
      <div
        class="flex items-center mb-4 w-max gap-1 bg-primary px-1 text-white mx-auto"
      >
        {{ $t("pages.index.features.badge") }}
      </div>

      <h2 class="font-bold text-6xl">
        <MDC :value="$t('pages.index.features.title')" unwrap="p" />
      </h2>

      <p class="mt-5 text-xl">
        <MDC :value="$t('pages.index.features.description')" />
      </p>
    </u-container>
  </Container>
  <Container :ui="{ content: 'bg-' }">
    <div class="flex flex-wrap divide-x divide-y divide-default">
      <div
        v-for="(feature, code) in features"
        :key="code"
        class="w-full md:w-1/2 block text-left lg:nth-[3]:border-b-0 lg:nth-[2]:border-r-0"
      >
        <div class="p-10 max-w-150">
          <h3 class="text-xl font-blac text-primary">
            <MDC
              unwrap="p"
              :value="$t(`pages.index.features.items.${code}.title`)"
            />
          </h3>

          <p class="mt-3 max-w-180">
            <MDC
              unwrap="p"
              :value="$t(`pages.index.features.items.${code}.description`)"
            />
          </p>
        </div>

        <!-- <img :src="feature.img" class="max-w-full h-auto mx-auto" /> -->
      </div>
    </div>
  </Container>

  <Container :ui="{ content: 'group/opensource' }">
    <AppLinkAnime
      :label="$t('pages.index.open_source.cta_secondary')"
      :to="$localePath({ name: 'why-open-source' })"
      class="relative block px-10 py-10"
      link-to-label
    >
      <u-page-grid>
        <div class="lg:col-span-2 col-span-3">
          <div class="flex items-center gap-2 mb-4 pl-2">
            <u-icon name="i-lucide-book-open-check" class="size-7" />
            <u-link
              :to="repository"
              target="_blank"
              class="group/dqdqsqdsqd flex items-center w-max gap-1 bg-black px-2 py-1 rounded- text-white hover:text-white"
            >
              {{ $t("pages.index.open_source.badge") }}

              <u-icon
                name="i-simple-icons-github"
                class="size-4 hidden group-hover/dqdqsqdsqd:inline-block align-top ml-1.5"
              />
            </u-link>
          </div>
          <h2 class="font-bold text-6xl light:text-primary max-w-160">
            <MDC :value="$t('pages.index.open_source.title')" unwrap="p" />
          </h2>

          <p class="mt-5 text-xl">
            <MDC :value="$t('pages.index.open_source.content')" />
          </p>
        </div>

        <div class="flex justify-end not-lg:col-span-3">
          <nuxt-link
            :href="contribueUrl"
            target="_blank"
            class="w-max relative"
          >
            <div
              class="transition-all rounded-4xl ml-auto content-['•'] absolute inset-0 bg-balck w-16 h-16 group-hover/opensource:w-full group-hover/opensource:bg-black"
            >
              <div
                class="size-full flex items-center justify-center absolute top-0 right-0 rounded-full group-hover/opensource:hidden"
              >
                <u-icon name="i-simple-icons-github" class="size-10" />
              </div>
            </div>

            <div
              class="whitespace-nowrap opacity-0 group-hover/opensource:opacity-100 text-white relative px-4 h-16 flex items-center gap-2 font-black text-xl"
            >
              {{ $t("pages.index.open_source.cta_primary") }}
              <u-icon name="i-lucide-arrow-up-right" class="size-7 ml-1.5" />
            </div>
          </nuxt-link>
        </div>
      </u-page-grid>
    </AppLinkAnime>
  </Container>

  <Container :ui="{ content: 'bg-' }">
    <ClientOnly>
      <div class="py-10">
        <swiper-container ref="features-carousel" :init="false">
          <swiper-slide
            v-for="(feature, idx) in allFeatures"
            :key="idx"
            class="w-100 h-auto"
          >
            <AppLinkAnime
              class="p-5 border border-default rounded-lg h-full flex flex-col"
            >
              <u-icon :name="feature.icon" class="size-7 mb-4 text-primary" />

              <h3 class="text-xl font-">
                <MDC unwrap="p" :value="$t(`features.${idx}.title`)" />
              </h3>
              <p class="py-3 mb-auto">
                <MDC unwrap="p" :value="$t(`features.${idx}.description`)" />
              </p>
            </AppLinkAnime>
          </swiper-slide>
        </swiper-container>
      </div>
    </ClientOnly>
  </Container>
</template>
