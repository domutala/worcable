// composables/useScrollTextHighlight.ts
import { computed, type ShallowRef } from "vue";

export function useScrollTextHighlight(
  target: ShallowRef<HTMLDivElement | null>,
) {
  const cloneTarget = ref<HTMLElement>();

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
      cloneTarget.value = target.value.cloneNode(true) as HTMLElement;
      rebuild(cloneTarget.value);

      target.value.style.opacity = "0";
      target.value.style.pointerEvents = "none";
      target.value.style.position = "unset !important";

      cloneTarget.value.style.position = "sticky";
      cloneTarget.value.style.top = "0";
      //   cloneTarget.value.style.inset = "0";
      //   target.value.parentElement?.append(cloneTarget.value);
      target.value.parentElement?.insertBefore(cloneTarget.value, target.value);

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
    const percent = visibleHeight / bounding.height;
    const count = spans.length * percent;

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
    window.removeEventListener("scroll", onScroll);
  }
}
