export const RELEASES = ["20.04", "22.04", "24.04"] as const;
export type Release = (typeof RELEASES)[number];

export const FLAVORS = ["generic", "hwe", "aws", "azure", "gcp", "nvidia", "lowlatency"] as const;
export type Flavor = (typeof FLAVORS)[number];

export const FLAVOR_LABELS: Record<Flavor, string> = {
  generic: "linux-generic",
  hwe: "linux-generic-hwe",
  aws: "linux-aws",
  azure: "linux-azure",
  gcp: "linux-gcp",
  nvidia: "linux-nvidia",
  lowlatency: "linux-lowlatency",
};

export const CVE_ID = "CVE-2026-98432";
export const ASK_HN_THREAD = "https://news.ycombinator.com/item?id=50393105";
export const EARLIER_HN_THREAD = "https://news.ycombinator.com/item?id=50337608";
export const MATTIAS_TABLE = "https://ma.ttias.be/linux-cve-2026-98432-vulnerable-kernels/";
