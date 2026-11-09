import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const DEMO_FPS = 30;
export const DEMO_DURATION = 210;
export const DEMO_WIDTH = 1280;
export const DEMO_HEIGHT = 720;

const ink = "#1e293b";
const muted = "#64748b";
const faint = "#94a3b8";
const green = "#15803d";
const accent = "#f97316";

const CLICK_RELEASE = 16;
const CLICK_FLAVOR = 32;
const FLIP_PROPOSED = 84;
const FLIP_UPDATES = 128;

const PAD = 36;
const RELEASE_CHIPS = ["20.04", "22.04", "24.04"] as const;
const FLAVOR_CHIPS = ["generic", "hwe", "aws", "azure", "gcp"] as const;
const RELEASE_W = 110;
const FLAVOR_W = 156;
const CHIP_GAP = 8;
const CHIP_Y = 96;
const CHIP_H = 40;
const FLAVOR_X0 = PAD + RELEASE_CHIPS.length * (RELEASE_W + CHIP_GAP) + 30;

const releaseChipX = (i: number) => PAD + i * (RELEASE_W + CHIP_GAP);
const flavorChipX = (i: number) => FLAVOR_X0 + i * (FLAVOR_W + CHIP_GAP);

type Cell = { version: string; pocket: string; at: string } | null;
type Row = { release: string; flavor: string; proposed: Cell; updates: Cell; selected?: boolean };

const ROWS: Row[] = [
  { release: "24.04", flavor: "linux-generic", proposed: { version: "6.8.0-52.53", pocket: "noble-proposed", at: "Nov 3 08:40" }, updates: { version: "6.8.0-52.53", pocket: "noble-updates", at: "Nov 4 19:12" } },
  { release: "22.04", flavor: "linux-generic", proposed: { version: "5.15.0-134.145", pocket: "jammy-proposed", at: "Nov 3 08:40" }, updates: { version: "5.15.0-134.145", pocket: "jammy-updates", at: "Nov 4 19:12" } },
  { release: "22.04", flavor: "linux-generic-hwe", proposed: { version: "6.8.0-52.53~22.04.1", pocket: "jammy-proposed", at: "Nov 4 21:05" }, updates: null },
  { release: "22.04", flavor: "linux-aws", proposed: null, updates: null, selected: true },
  { release: "20.04", flavor: "linux-aws", proposed: null, updates: null },
];

const AWS_PROPOSED: Cell = { version: "5.15.0-1081.88", pocket: "jammy-proposed", at: "Nov 5 09:15" };
const AWS_UPDATES: Cell = { version: "5.15.0-1081.88", pocket: "jammy-updates", at: "Nov 5 09:17" };

function clockAt(frame: number): string {
  const minute = 12 + Math.floor(frame / 20);
  return `09:${String(minute).padStart(2, "0")} UTC`;
}

const Chip: React.FC<{ x: number; w: number; label: string; active: boolean }> = ({ x, w, label, active }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: CHIP_Y,
      width: w,
      height: CHIP_H,
      borderRadius: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      fontWeight: 600,
      border: `1px solid ${active ? ink : "#cbd5e1"}`,
      background: active ? ink : "rgba(255,255,255,0.7)",
      color: active ? "#fff" : "#334155",
    }}
  >
    {label}
  </div>
);

const StatusCell: React.FC<{ cell: Cell; appear: number; dim: boolean }> = ({ cell, appear, dim }) => {
  if (!cell) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: dim ? "#cbd5e1" : faint, fontSize: 17 }}>
        <div style={{ width: 10, height: 10, borderRadius: 5, border: `2px solid ${dim ? "#e2e8f0" : "#cbd5e1"}` }} />
        not yet
      </div>
    );
  }
  return (
    <div style={{ opacity: appear, transform: `translateY(${(1 - appear) * 10}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 17, fontWeight: 600, color: dim ? faint : ink }}>
        <div style={{ width: 10, height: 10, borderRadius: 5, background: dim ? "#cbd5e1" : green }} />
        {cell.version}
      </div>
      <div style={{ fontSize: 13, color: dim ? "#cbd5e1" : muted, marginLeft: 18 }}>
        {cell.pocket}, {cell.at}
      </div>
    </div>
  );
};

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DEMO_DURATION - 12, DEMO_DURATION], [1, 0], { extrapolateLeft: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);

  const releaseChosen = frame >= CLICK_RELEASE;
  const flavorChosen = frame >= CLICK_FLAVOR;
  const rowClaimed = flavorChosen;

  const cursorX = interpolate(frame, [0, 14, 20, 30, 40, 52], [980, releaseChipX(1) + RELEASE_W / 2, releaseChipX(1) + RELEASE_W / 2, flavorChipX(2) + FLAVOR_W / 2, flavorChipX(2) + FLAVOR_W / 2, 1180], { extrapolateRight: "clamp" });
  const cursorY = interpolate(frame, [0, 14, 20, 30, 40, 52], [430, CHIP_Y + CHIP_H / 2, CHIP_Y + CHIP_H / 2, CHIP_Y + CHIP_H / 2, CHIP_Y + CHIP_H / 2, 330], { extrapolateRight: "clamp" });
  const clickPulse = (at: number) => interpolate(frame, [at - 2, at, at + 6], [1, 0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorScale = Math.min(clickPulse(CLICK_RELEASE), clickPulse(CLICK_FLAVOR));
  const cursorOpacity = interpolate(frame, [44, 54], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const proposedIn = spring({ frame: frame - FLIP_PROPOSED, fps, config: { damping: 200 } });
  const updatesIn = spring({ frame: frame - FLIP_UPDATES, fps, config: { damping: 200 } });
  const card1In = spring({ frame: frame - FLIP_PROPOSED - 6, fps, config: { damping: 18, stiffness: 140 } });
  const card2In = spring({ frame: frame - FLIP_UPDATES - 6, fps, config: { damping: 18, stiffness: 140 } });

  const pulse = 0.5 + 0.5 * Math.sin(frame / 4);

  const tableX = PAD;
  const tableY = 164;
  const colW = [90, 180, 270, 270];
  const tableW = colW.reduce((a, b) => a + b, 0);
  const rowH = 72;
  const panelX = tableX + tableW + 28;
  const panelW = DEMO_WIDTH - PAD - panelX;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #f1f5f9 0%, #f8fafc 55%, #e2e8f0 100%)",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        color: ink,
        opacity,
      }}
    >
      <div style={{ position: "absolute", left: PAD, top: PAD, right: PAD, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>kernel_fix_watch</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: muted }}>CVE-2026-98432</div>
        </div>
        <div style={{ fontSize: 15, color: muted }}>
          Day 9 since CVE published, 21 days left in a 30-day window. Last checked from the archive at {clockAt(frame)}
        </div>
      </div>

      {RELEASE_CHIPS.map((r, i) => (
        <Chip key={r} x={releaseChipX(i)} w={RELEASE_W} label={`${r} LTS`} active={releaseChosen && r === "22.04"} />
      ))}
      {FLAVOR_CHIPS.map((f, i) => (
        <Chip key={f} x={flavorChipX(i)} w={FLAVOR_W} label={f === "hwe" ? "linux-generic-hwe" : `linux-${f}`} active={flavorChosen && f === "aws"} />
      ))}

      <div
        style={{
          position: "absolute",
          left: tableX,
          top: tableY,
          width: tableW,
          borderRadius: 18,
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 8px 32px rgba(30,41,59,0.08)",
          backdropFilter: "blur(14px)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", height: 42, alignItems: "center", fontSize: 13, fontWeight: 600, color: muted, letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
          {["Release", "Flavor", "-proposed", "-updates"].map((h, i) => (
            <div key={h} style={{ width: colW[i], paddingLeft: 18 }}>
              {h}
            </div>
          ))}
        </div>
        {ROWS.map((row, idx) => {
          const dim = rowClaimed && !row.selected;
          const proposed = row.selected ? (frame >= FLIP_PROPOSED ? AWS_PROPOSED : null) : row.proposed;
          const updates = row.selected ? (frame >= FLIP_UPDATES ? AWS_UPDATES : null) : row.updates;
          const highlight = row.selected && rowClaimed ? interpolate(frame, [CLICK_FLAVOR, CLICK_FLAVOR + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
          return (
            <div
              key={`${row.release}-${row.flavor}`}
              style={{
                display: "flex",
                height: rowH,
                alignItems: "center",
                background: `rgba(30,41,59,${0.06 * highlight})`,
                boxShadow: highlight ? `inset 4px 0 0 ${ink}` : "none",
                borderBottom: idx < ROWS.length - 1 ? "1px solid #e2e8f0" : "none",
                opacity: dim ? 0.55 : 1,
              }}
            >
              <div style={{ width: colW[0], paddingLeft: 18, fontSize: 17, fontWeight: 600 }}>{row.release}</div>
              <div style={{ width: colW[1], paddingLeft: 18, fontSize: 17 }}>{row.flavor}</div>
              <div style={{ width: colW[2], paddingLeft: 18 }}>
                <StatusCell cell={proposed} appear={row.selected ? proposedIn : 1} dim={dim} />
              </div>
              <div style={{ width: colW[3], paddingLeft: 18 }}>
                <StatusCell cell={updates} appear={row.selected ? updatesIn : 1} dim={dim} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: panelX, top: tableY, width: panelW }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Your alerts</div>

        {rowClaimed && frame < FLIP_PROPOSED + 6 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, color: muted }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: ink, opacity: 0.35 + 0.65 * pulse }} />
            Watching 22.04 / linux-aws. Polling Launchpad and apt.
          </div>
        )}
        {!rowClaimed && <div style={{ fontSize: 16, color: faint }}>Pick a release and a flavor to claim your row.</div>}

        {frame >= FLIP_PROPOSED + 6 && (
          <div
            style={{
              transform: `translateX(${(1 - card1In) * 40}px)`,
              opacity: card1In,
              background: "rgba(255,255,255,0.78)",
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "0 8px 32px rgba(30,41,59,0.08)",
              borderRadius: 16,
              padding: 18,
              backdropFilter: "blur(14px)",
            }}
          >
            <div style={{ fontSize: 13, color: muted, marginBottom: 6 }}>Email, {AWS_PROPOSED.at} UTC</div>
            <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>22.04 / linux-aws: fixed kernel in -proposed</div>
            <div style={{ fontSize: 15, color: muted, marginTop: 6, lineHeight: 1.4 }}>
              linux-image-5.15.0-1081-aws {AWS_PROPOSED.version} published to jammy-proposed. Not in -updates yet. Keep the stopgap.
            </div>
          </div>
        )}

        {frame >= FLIP_UPDATES + 6 && (
          <div
            style={{
              marginTop: 14,
              transform: `translateX(${(1 - card2In) * 40}px)`,
              opacity: card2In,
              background: "rgba(255,255,255,0.9)",
              border: `1px solid ${accent}`,
              boxShadow: "0 8px 32px rgba(249,115,22,0.18)",
              borderRadius: 16,
              padding: 18,
              backdropFilter: "blur(14px)",
            }}
          >
            <div style={{ fontSize: 13, color: muted, marginBottom: 6 }}>Email and Slack, {AWS_UPDATES.at} UTC</div>
            <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>22.04 / linux-aws flipped to -updates. You can remove your stopgap.</div>
            <div style={{ fontSize: 15, color: muted, marginTop: 6, lineHeight: 1.4 }}>
              {AWS_UPDATES.version} is in jammy-updates. After reboot, uname -r should show 5.15.0-1081-aws. Then drop the nftables rule.
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: cursorX - 9,
          top: cursorY - 9,
          width: 18,
          height: 18,
          borderRadius: 9,
          background: ink,
          opacity: cursorOpacity * 0.85,
          transform: `scale(${cursorScale})`,
          boxShadow: "0 0 0 4px rgba(30,41,59,0.15)",
        }}
      />
    </AbsoluteFill>
  );
};
