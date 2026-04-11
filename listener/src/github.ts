export type PushEvent = {
  ref: string;
  commits: Array<{
    id: string;
    message: string;
    author: { name: string };
    url: string;
  }>;
};

export function handleBranchChange(
  payload: PushEvent,
  targetBranch: string
): void {
  const branch = payload.ref.replace("refs/heads/", "");

  if (branch !== targetBranch) return;

  console.log(`🚀 Change detected on branch: ${targetBranch}`);

  for (const commit of payload.commits) {
    console.log({
      id: commit.id,
      message: commit.message,
      author: commit.author.name,
      url: commit.url,
    });
  }

  // 👉 ici tu peux déclencher:
  // - build
  // - sync DB
  // - webhook interne
}
