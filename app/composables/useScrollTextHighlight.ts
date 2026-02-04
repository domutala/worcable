// composables/useScrollTextHighlight.ts
import { computed, type ShallowRef } from "vue";

export function useScrollTextHighlight(
  target: ShallowRef<HTMLDivElement | null>,
  {
    onBeforeBuild,
  }: {
    onBeforeBuild?: (target: ShallowRef<HTMLDivElement | null>) => void;
  } = {},
) {
  const cloneTarget = ref<HTMLElement>();
  const percent = shallowRef(0);

  function rebuild(node: ChildNode) {
    // Texte
    if (node.nodeType === Node.TEXT_NODE) {
      const content = document.createElement("span");
      const words = (node.textContent?.trim() || "").split(" ");

      words.forEach((word) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.style.opacity = "0.3";
        span.style.filter = "grayscale(100%)";
        span.setAttribute("data-text-highlight", "");

        content.appendChild(span);
      });

      node.replaceWith(content);

      return;
    }

    // Élément HTML
    const element = node as HTMLElement;

    // Enfants
    Array.from(element.childNodes).map(rebuild).filter(Boolean);
  }

  onMounted(() => {
    if (target.value) {
      const bounding = target.value.getBoundingClientRect();

      onBeforeBuild?.(target);

      cloneTarget.value = target.value.cloneNode(true) as HTMLElement;

      const content = cloneTarget.value.querySelector("[data-text-highlight]");
      rebuild(content || cloneTarget.value);

      cloneTarget.value.style.position = "sticky";
      cloneTarget.value.style.top = "0";

      target.value.before(cloneTarget.value);

      target.value.style.opacity = "0";
      target.value.style.pointerEvents = "none";
      target.value.style.position = "unset !important";

      window.addEventListener("scroll", onScroll);
      onScroll();
    }
  });

  function onScroll() {
    // if (!isVisible.value) return;
    if (!target.value) return;
    if (!cloneTarget.value) return;

    const bounding = target.value.getBoundingClientRect();
    let visibleHeight = bounding.height - bounding.top;

    visibleHeight = visibleHeight > 0 ? visibleHeight : 0;
    if (visibleHeight > bounding.height) visibleHeight = bounding.height;

    const spans = cloneTarget.value.querySelectorAll<HTMLElement>(
      "[data-text-highlight]",
    );
    const p = visibleHeight / bounding.height;
    const count = spans.length * p;

    percent.value = p * 100;

    spans.forEach((span, i) => {
      if (i <= count) {
        span.style.opacity = "1";
        span.style.filter = "unset";
      } else {
        span.style.filter = "grayscale(100%)";
        span.style.opacity = "0.3";
      }
    });
  }

  onDeactivated(destroy);
  onUnmounted(destroy);
  function destroy() {
    cloneTarget.value?.remove();

    window.removeEventListener("scroll", onScroll);
  }

  return { percent };
}
