<script setup lang="ts">
const { header, repository } = useAppConfig();

const advantages = {
  control: { icon: "i-lucide-shield-check" },
  dx: { icon: "i-lucide-database-zap" },
  simplicity: { icon: "i-lucide-layout-dashboard" },
};
</script>

<template>
  <Container :ui="{ content: 'min-h-[75vh]' }">
    <template #top>
      <div class="absolute left-0 w-full top-0 bottom-0 bg-">
        <div class="absolute inset-0 object-cover object-center">
          <img
            src="/images/bloom.png"
            class="size-full object-cover object-center"
          />

          <div class="absolute backdrop-blur-2xl inset-0 bg-default/90"></div>
        </div>

        <div
          class="absolute bottom-0 h-100 w-full bg-linear-to-b from-transparent to-body"
        ></div>
      </div>
    </template>

    <u-container class="py-36 text-center">
      <h1 class="text-4xl md:text-6xl font-bold max-w-200 mx-auto">
        <MDC :value="$t('pages.index.hero.title')" unwrap="p" />
      </h1>

      <p class="mt-5 text-2xl max-w-230 mx-auto">
        <MDC :value="$t('pages.index.hero.subtitle')" unwrap="p" />
      </p>

      <div
        class="flex items-center gap-2 sm:flex-row flex-col justify-center mt-10"
      >
        <u-button
          :to="$localePath(header.to)"
          size="xl"
          color="primary"
          variant="solid"
          class="p-3 px-4"
          icon="i-lucide-newspaper"
        >
          {{ $t("pages.index.hero.cta_primary") }}
        </u-button>
        <u-button
          :href="repository"
          target="_blank"
          size="xl"
          variant="soft"
          color="neutral"
          icon="i-simple-icons-github"
          class="border-default p-3 px-4"
        >
          {{ $t("pages.index.hero.cta_secondary") }}
        </u-button>
      </div>
    </u-container>
  </Container>

  <Container
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

  <Container :ui="{ content: 'bg-surface' }">
    <u-container class="py-20 text-center max-w-4xl">
      <div
        class="flex items-center mx-auto mb-8 w-max gap-1 bg-primary text-black px-2 text-lg uppercase"
      >
        {{ $t("pages.index.features.badge") }}
      </div>

      <h2 class="font-bold text-6xl">
        <MDC :value="$t('pages.index.features.title')" unwrap="p" />
      </h2>

      <!-- <p class="mt-5 font-bold text-xl">
        <MDC :value="$t('pages.index.projects.description')" />
      </p> -->
    </u-container>
  </Container>
  <Container :ui="{ content: 'bg-surface' }">
    <div class="flex flex-wrap divide-x divide-y divide-default">
      <div
        v-for="code in ['management', 'pipeline', 'forms', 'performance']"
        :key="code"
        class="w-full md:w-1/2 lg:w-1/4 block text-left"
      >
        <div class="p-7">
          <h3 class="text-xl">
            <MDC
              unwrap="p"
              :value="$t(`pages.index.features.items.${code}.title`)"
            />
          </h3>

          <p class="opacity-50 mt-3 max-w-180">
            <MDC
              unwrap="p"
              :value="$t(`pages.index.features.items.${code}.description`)"
            />
          </p>
        </div>
      </div>
    </div>
  </Container>

  <Container :ui="{ content: 'group/opensource testimonial cursor-pointer' }">
    <u-link
      :to="repository"
      target="_blank"
      class="relative z-2 block text-highlighted!"
    >
      <u-container class="py-20">
        <u-page-grid class="">
          <div class="lg:col-span-2 col-span-3 lg:pl-10">
            <div
              class="flex items-center mb-4 w-max gap-1 bg-primary text-black px-2 text-lg uppercase"
            >
              {{ $t("pages.index.open_source.badge") }}
            </div>

            <h2 class="font-bold text-6xl dark:text-primary">
              <MDC :value="$t('pages.index.open_source.title')" unwrap="p" />
            </h2>

            <p class="mt-5 font-bold text-xl">
              <MDC :value="$t('pages.index.open_source.content')" />
            </p>
          </div>

          <div class="flex items-center justify-end lg:pr-10 not-lg:col-span-3">
            <div class="w-max relative">
              <div
                class="transition-all rounded-4xl ml-auto content-['•'] absolute inset-0 bg-primary w-16 h-16 group-hover/opensource:w-full group-hover/opensource:bg-inverted"
              >
                <div
                  class="size-full flex items-center justify-center bg-primary absolute top-0 right-0 rounded-full group-hover/opensource:hidden"
                >
                  <u-icon
                    name="i-lucide-arrow-up-right"
                    class="size-10 text-black"
                  />
                </div>
              </div>

              <div
                class="whitespace-nowrap opacity-0 group-hover/opensource:opacity-100 text-inverted relative px-7 h-16 flex items-center gap-2 font-black text-xl"
              >
                {{ $t("pages.index.open_source.contribute") }}
              </div>
            </div>
          </div>
        </u-page-grid>
      </u-container>
    </u-link>
  </Container>

  <Container :ui="{ content: 'bg-' }">
    <u-page-grid class="sm:grid-cols-3 gap-0">
      <div
        v-for="(advantage, code) in advantages"
        :key="code"
        class="col-span-1 sm:not-first:border-l not-sm:not-first:border-t border-default"
      >
        <div class="p-10">
          <u-icon :name="advantage.icon" class="size-12 mb-5 opacity-50" />

          <h3 class="text-xl">
            <MDC
              unwrap="p"
              :value="$t(`pages.index.advantages.items.${code}.title`)"
            />
          </h3>

          <p class="opacity-50 mt-3 max-w-180">
            <MDC
              unwrap="p"
              :value="$t(`pages.index.advantages.items.${code}.description`)"
            />
          </p>
        </div>
      </div>
    </u-page-grid>
  </Container>
</template>
