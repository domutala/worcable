<script setup lang="ts">
import type {
  Collections,
  ContentNavigationItem,
  DocsEnCollectionItem,
} from "@nuxt/content";
import { findPageHeadline } from "@nuxt/content/utils";
import { withLeadingSlash } from "ufo";

definePageMeta({ layout: "docs" });

const i18n = useI18n();
const route = useRoute();
const { toc } = useAppConfig();
const { $docs } = useNuxtApp();

const collection = computed(() => {
  return ("docs_" + i18n.locale.value) as keyof Collections;
});

const slug = computed(() => {
  const slug = route.params.slug ?? "";
  return Array.isArray(slug) ? slug : slug.split("/");
});

const path = computed(() => {
  return withLeadingSlash([i18n.locale.value, "docs", ...slug.value].join("/"));
});

const { data: page } = await useAsyncData(route.path, async () => {
  const result = (await queryCollection(collection.value)
    .path(path.value)
    .first()) as DocsEnCollectionItem;

  return result;
});

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings(collection.value, path.value, {
    fields: ["description"],
  });
});

const title = page.value.seo?.title || page.value.title;
const description = page.value.seo?.description || page.value.description;

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});

const headline = computed(() =>
  findPageHeadline($docs.navigation?.value, page.value?.path)
);

defineOgImageComponent("Docs", {
  headline: headline.value,
});

const links = computed(() => {
  const links = [];

  if (toc?.bottom?.edit) {
    links.push({
      icon: "i-lucide-external-link",
      label: "content.toc.bottom.edit_this_page",
      to: `${toc.bottom.edit}/${page?.value?.stem}.${page?.value?.extension}`,
      target: "_blank",
    });
  }

  links.push(...(toc?.bottom?.links || []));

  return links
    .map((link) => {
      link.label = i18n.t(link.label);
      return link;
    })
    .filter(Boolean);
});
</script>

<template>
  <template v-if="page">
    <Container
      class="sticky z-50 top-(--ui-header-height) hidden"
      :ui="{ content: 'h-(--ui-sub-header-height) bg-default' }"
    >
      <u-container class="h-full">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem maxime
      </u-container>
    </Container>

    <Container>
      <u-container>
        <UPageHeader
          class="py-5"
          :title="page.title"
          :ui="{ title: 'text-2xl sm:text-2xl' }"
        >
          <template #links>
            <UButton
              v-for="(link, index) in page.links"
              :key="index"
              v-bind="link"
            />

            <PageHeaderLinks />
          </template>
        </UPageHeader>
      </u-container>
    </Container>

    <Container>
      <UPage
        :ui="{ right: '-mx-0 sm:-mx-0 top-0 max-h-screen' }"
        class="ui-doc-body"
      >
        <u-container class="max-w-250 mx-auto py-5">
          <!-- <UPageHeader :title="page.title" :description="page.description">
            <template #links>
              <UButton
                v-for="(link, index) in page.links"
                :key="index"
                v-bind="link"
              />

              <PageHeaderLinks />
            </template>
          </UPageHeader> -->

          <UPageBody>
            <!-- <MDC v-if="page.description" :value="page.description" unwrap="p" /> -->
            <Soon v-if="!page.body.value.length" :page />
            <ContentRenderer v-else :value="page" />
          </UPageBody>
        </u-container>

        <template #right>
          <UContentToc
            :title="$t(toc?.title)"
            :links="page.body?.toc?.links"
            :ui="{
              indicator: 'ms-1 light:bg-primary-950',
              content: '[&>ul]:ms-1',
            }"
            class="top-(--ui-max-header-height)"
          >
            <!-- group relative text-sm flex items-center focus-visible:outline-primary py-1 text-muted hover:text-default transition-colors -->
            <template #leading>
              <u-icon name="i-lucide-text" class="size-5.5" />
            </template>

            <template v-if="toc?.bottom" #bottom>
              <div
                class="hidden lg:block space-y-6"
                :class="{ 'mt-6!': page.body?.toc?.links?.length }"
              >
                <USeparator
                  v-if="page.body?.toc?.links?.length"
                  type="dashed"
                />

                <UPageLinks :title="$t(toc.bottom.title)" :links="links" />
              </div>
            </template>
          </UContentToc>
        </template>
      </UPage>
    </Container>

    <Container v-if="surround?.length">
      <UContentSurround
        :surround="surround"
        :ui="{
          link: 'py-5 rounded-none border-0 last:sm:border-l last:not-sm:border-t',
        }"
        class="gap-0"
      />
    </Container>
  </template>
</template>
