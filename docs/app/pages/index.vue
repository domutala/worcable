<script setup lang="ts">
import OgImageDocs from "~/components/OgImage/OgImageDocs.vue";
import { useClipboard } from "@vueuse/core";
import type { CarouselItem } from "@nuxt/ui";

const { header, repository, contribueUrl, docHomePage } = useAppConfig();

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
  pipeline: {
    title: "Pipeline Dynamique",
    description:
      "Un Kanban ultra-réactif conçu en Vue.js pour une gestion fluide des candidats. Personnalisez vos étapes de recrutement pour coller à la réalité de vos process métiers.",
  },
  cv_parser: {
    title: "CVthèque & IA",
    description:
      "Moteur d'extraction Python haute précision. Transformez vos PDF en données structurées exploitables instantanément grâce à notre technologie de parsing propriétaire.",
  },
  candidate_management: {
    title: "Gestion des Candidats",
    description:
      "Fiches profil enrichies avec historique complet des interactions. Une source de vérité unique pour centraliser chaque point de contact.",
  },
  collaboration: {
    title: "Collaboration & Permissions",
    description:
      "Système de rôles granulaire (Admin, Recruteur, Manager). Partagez vos feedbacks et évaluez vos talents en équipe sans friction.",
  },
  communication: {
    title: "Communication Centralisée",
    description:
      "Éliminez les silos. Gérez tous vos échanges mails et messages directement depuis l'interface pour une traçabilité totale.",
  },
  job_distribution: {
    title: "Diffusion des Offres",
    description:
      "Multidiffusion simplifiée sur vos canaux stratégiques. Maximisez votre visibilité tout en gardant une interface de gestion unifiée.",
  },
  security: {
    title: "Sécurité & Auditabilité",
    description:
      "Transparence totale du code source. Auditez, sécurisez et maîtrisez votre stack de recrutement conformément aux exigences RGPD les plus strictes.",
  },
  deployment: {
    title: "Déploiement Souverain",
    description:
      "Approche Docker-first et CLI interactif. Installez Worcable sur vos propres serveurs en quelques minutes pour une indépendance technique absolue.",
  },
  career_site: {
    title: "Site Carrière Haute Performance",
    description:
      "Propulsé par Nuxt 3. Profitez d'un SEO Google Jobs natif et de temps de chargement records pour convertir vos visiteurs en candidats.",
  },
  ai_matching: {
    title: "Matching Intelligent",
    description:
      "Algorithmes de scoring basés sur l'IA pour identifier les meilleurs profils. Gagnez un temps précieux en priorisant les candidatures les plus pertinentes.",
  },
};

const copy = useClipboard({});
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
      class="flex not-lg:flex-col lg:divide-x not-lg:divide-y divide-default bg-surface/70 border-t border-default"
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
    <UCarousel
      v-slot="{ item }"
      loop
      auto-scroll
      arrows
      :items="Object.keys(allFeatures)"
      :ui="{
        item: 'basis-1/3 border-r border-default h-full',
        controls: 'absolute top-1/2 -translate-y-1/2 inset-x-15',
      }"
    >
      <div class="p-5">
        <h3 class="text-xl font-bold">
          <MDC unwrap="p" :value="$t(`features.${item}.title`)" />
        </h3>
        <p class="mt-3">
          <MDC unwrap="p" :value="$t(`features.${item}.description`)" />
        </p>
      </div>
    </UCarousel>
  </Container>
</template>
