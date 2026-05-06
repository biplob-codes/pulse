"use client";

import { useState } from "react";
import {
  ChevronDown,
  Plus,
  Copy,
  Settings,
  Sun,
  Moon,
  LayoutGrid,
  Bug,
  Lightbulb,
  ChevronRight,
  ArrowUp,
  ExternalLink,
  Check,
  LogOut,
  MoreHorizontal,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "open" | "under_review" | "planned" | "in_progress" | "done";

interface Post {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: Status;
  submittedAt: string;
  author: string;
}

interface Board {
  id: string;
  name: string;
  icon: "feature" | "bug";
  posts: Post[];
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
  boards: Board[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const WORKSPACES: Workspace[] = [
  {
    id: "ws1",
    name: "My SaaS App",
    slug: "my-saas-app",
    boards: [
      {
        id: "b1",
        name: "Feature Requests",
        icon: "feature",
        posts: [
          {
            id: "p1",
            title: "Dark mode support",
            description: "Would love a dark theme for late night use.",
            votes: 24,
            status: "under_review",
            submittedAt: "2 days ago",
            author: "anonymous",
          },
          {
            id: "p2",
            title: "Export data to CSV",
            description: "Need to pull data into spreadsheets for reporting.",
            votes: 11,
            status: "planned",
            submittedAt: "5 days ago",
            author: "anonymous",
          },
          {
            id: "p3",
            title: "Better search and filters",
            description: "Search is too basic, need advanced filters.",
            votes: 6,
            status: "open",
            submittedAt: "1 week ago",
            author: "anonymous",
          },
          {
            id: "p4",
            title: "Mobile app",
            description: "Native iOS and Android apps please.",
            votes: 19,
            status: "done",
            submittedAt: "3 weeks ago",
            author: "anonymous",
          },
          {
            id: "p5",
            title: "Slack integration",
            description: "Get notified in Slack when status changes.",
            votes: 14,
            status: "in_progress",
            submittedAt: "4 days ago",
            author: "anonymous",
          },
        ],
      },
      {
        id: "b2",
        name: "Bug Reports",
        icon: "bug",
        posts: [
          {
            id: "p6",
            title: "Login fails on Safari",
            description: "Can't sign in on Safari 17.",
            votes: 8,
            status: "in_progress",
            submittedAt: "1 day ago",
            author: "anonymous",
          },
          {
            id: "p7",
            title: "Email notifications not sending",
            description: "Haven't received any emails in 3 days.",
            votes: 5,
            status: "under_review",
            submittedAt: "3 days ago",
            author: "anonymous",
          },
        ],
      },
    ],
  },
  {
    id: "ws2",
    name: "Side Project",
    slug: "side-project",
    boards: [
      {
        id: "b3",
        name: "Feature Requests",
        icon: "feature",
        posts: [
          {
            id: "p8",
            title: "API access",
            description: "Need programmatic access to the data.",
            votes: 3,
            status: "open",
            submittedAt: "2 weeks ago",
            author: "anonymous",
          },
        ],
      },
    ],
  },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bg: string; bar: string }
> = {
  open: {
    label: "Open",
    color: "text-zinc-600",
    bg: "bg-zinc-100",
    bar: "bg-zinc-400",
  },
  under_review: {
    label: "Under Review",
    color: "text-amber-700",
    bg: "bg-amber-50",
    bar: "bg-amber-400",
  },
  planned: {
    label: "Planned",
    color: "text-blue-700",
    bg: "bg-blue-50",
    bar: "bg-blue-400",
  },
  in_progress: {
    label: "In Progress",
    color: "text-violet-700",
    bg: "bg-violet-50",
    bar: "bg-violet-400",
  },
  done: {
    label: "Done",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    bar: "bg-emerald-500",
  },
};

const ALL_STATUSES: Status[] = [
  "open",
  "under_review",
  "planned",
  "in_progress",
  "done",
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${cfg.color} ${cfg.bg}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Status Dropdown ──────────────────────────────────────────────────────────

function StatusDropdown({
  current,
  onChange,
}: {
  current: Status;
  onChange: (s: Status) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-600 border border-zinc-200 rounded px-2 py-1 hover:bg-zinc-50 transition-colors"
      >
        Change status <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-50 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 w-40">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={(e) => {
                e.stopPropagation();
                onChange(s);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-50 text-left"
            >
              <StatusBadge status={s} />
              {s === current && (
                <Check size={12} className="text-emerald-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Post Detail Drawer ───────────────────────────────────────────────────────

function PostDrawer({
  post,
  onClose,
  onStatusChange,
}: {
  post: Post;
  onClose: () => void;
  onStatusChange: (id: string, s: Status) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* backdrop */}
      <div className="flex-1 bg-black/20" onClick={onClose} />
      {/* panel */}
      <div className="w-[420px] bg-white border-l border-zinc-200 flex flex-col h-full shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <span className="text-sm font-semibold text-zinc-800">
            Post detail
          </span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-zinc-900 leading-snug">
                {post.title}
              </h2>
              <span className="flex items-center gap-1 text-xs font-medium text-zinc-500 bg-zinc-100 rounded-full px-2 py-0.5 shrink-0">
                <ArrowUp size={11} /> {post.votes}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
              {post.description}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
              Status
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {ALL_STATUSES.map((s) => {
                const cfg = STATUS_CONFIG[s];
                const active = s === post.status;
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(post.id, s)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all ${
                      active
                        ? `${cfg.bg} ${cfg.color} border-transparent ring-2 ring-offset-1 ring-current`
                        : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300 hover:text-zinc-600"
                    }`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
              Meta
            </div>
            <div className="text-sm text-zinc-500">
              Submitted {post.submittedAt} · {post.author}
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100">
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-2">
              Admin note
            </div>
            <textarea
              rows={4}
              placeholder="Add an internal note (only visible to you)…"
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 text-zinc-700 placeholder:text-zinc-300 resize-none focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
            />
            <button className="mt-2 text-xs bg-zinc-800 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors">
              Save note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function WorkspaceDashboard() {
  const [workspaces, setWorkspaces] = useState(WORKSPACES);
  const [activeWsId, setActiveWsId] = useState("ws1");
  const [activeBoardId, setActiveBoardId] = useState("b1");
  const [activeTab, setActiveTab] = useState<"posts" | "roadmap">("posts");
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [dark, setDark] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeWs = workspaces.find((w) => w.id === activeWsId)!;
  const activeBoard =
    activeWs.boards.find((b) => b.id === activeBoardId) ?? activeWs.boards[0];

  const filteredPosts =
    filterStatus === "all"
      ? activeBoard.posts
      : activeBoard.posts.filter((p) => p.status === filterStatus);

  const statusCounts = ALL_STATUSES.map((s) => ({
    status: s,
    count: activeBoard.posts.filter((p) => p.status === s).length,
  }));

  function handleStatusChange(postId: string, newStatus: Status) {
    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        boards: ws.boards.map((b) => ({
          ...b,
          posts: b.posts.map((p) =>
            p.id === postId ? { ...p, status: newStatus } : p,
          ),
        })),
      })),
    );
    if (selectedPost?.id === postId) {
      setSelectedPost((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  }

  function handleCopyLink() {
    navigator.clipboard
      .writeText(`https://yourapp.com/feedback/${activeWs.slug}`)
      .catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div
        className={`flex h-screen w-full font-sans antialiased ${dark ? "bg-zinc-950 text-zinc-100" : "bg-white text-zinc-900"}`}
      >
        {/* ── SIDEBAR ── */}
        <aside
          className={`w-52 shrink-0 flex flex-col border-r ${dark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}
        >
          {/* Workspace dropdown */}
          <div className="relative">
            <button
              onClick={() => setWsDropdownOpen(!wsDropdownOpen)}
              className={`w-full flex items-center justify-between px-3 py-3 border-b text-left ${dark ? "border-zinc-800 hover:bg-zinc-800" : "border-zinc-200 hover:bg-zinc-100"} transition-colors`}
            >
              <div>
                <div className="text-[13px] font-semibold truncate max-w-[130px]">
                  {activeWs.name}
                </div>
                <div
                  className={`text-[11px] ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  {activeWs.boards.length} boards
                </div>
              </div>
              <ChevronDown
                size={13}
                className={dark ? "text-zinc-500" : "text-zinc-400"}
              />
            </button>

            {wsDropdownOpen && (
              <div
                className={`absolute left-0 right-0 top-full z-50 border shadow-lg rounded-b-lg overflow-hidden ${dark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-200"}`}
              >
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setActiveWsId(ws.id);
                      setActiveBoardId(ws.boards[0].id);
                      setWsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-[12px] ${dark ? "hover:bg-zinc-800" : "hover:bg-zinc-50"} transition-colors`}
                  >
                    <span className="font-medium truncate">{ws.name}</span>
                    {ws.id === activeWsId && (
                      <Check size={12} className="text-emerald-500 shrink-0" />
                    )}
                  </button>
                ))}
                <div
                  className={`border-t ${dark ? "border-zinc-800" : "border-zinc-100"}`}
                >
                  <button
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-[12px] ${dark ? "text-zinc-400 hover:bg-zinc-800" : "text-zinc-500 hover:bg-zinc-50"} transition-colors`}
                  >
                    <Plus size={12} /> New workspace
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* New workspace btn */}
          <button
            className={`mx-2 mt-2 flex items-center gap-2 px-3 py-2 text-[11px] rounded-md border border-dashed transition-colors ${dark ? "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300" : "border-zinc-300 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600"}`}
          >
            <Plus size={11} /> New workspace
          </button>

          {/* Boards */}
          <div
            className={`mt-3 px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest ${dark ? "text-zinc-600" : "text-zinc-400"}`}
          >
            Boards
          </div>
          <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
            {activeWs.boards.map((board) => {
              const active = board.id === activeBoardId;
              return (
                <button
                  key={board.id}
                  onClick={() => setActiveBoardId(board.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] text-left transition-colors ${
                    active
                      ? dark
                        ? "bg-zinc-800 text-white font-medium"
                        : "bg-white text-zinc-900 font-medium shadow-sm border border-zinc-200"
                      : dark
                        ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                  }`}
                >
                  {board.icon === "feature" ? (
                    <Lightbulb
                      size={13}
                      className={active ? "text-violet-500" : ""}
                    />
                  ) : (
                    <Bug size={13} className={active ? "text-red-400" : ""} />
                  )}
                  <span className="truncate">{board.name}</span>
                  <span
                    className={`ml-auto text-[10px] ${dark ? "text-zinc-600" : "text-zinc-400"}`}
                  >
                    {board.posts.length}
                  </span>
                </button>
              );
            })}
            <button
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] text-left transition-colors ${dark ? "text-zinc-600 hover:text-zinc-400" : "text-zinc-300 hover:text-zinc-500"}`}
            >
              <Plus size={12} /> New board
            </button>
          </nav>

          {/* Bottom */}
          <div
            className={`border-t ${dark ? "border-zinc-800" : "border-zinc-200"}`}
          >
            <button
              onClick={() => setDark(!dark)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-[12px] transition-colors ${dark ? "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"}`}
            >
              {dark ? <Sun size={13} /> : <Moon size={13} />}
              {dark ? "Light mode" : "Dark mode"}
            </button>
            <div
              className={`flex items-center gap-2.5 px-3 py-3 border-t ${dark ? "border-zinc-800" : "border-zinc-100"}`}
            >
              <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-[11px] font-semibold text-violet-700 shrink-0">
                BI
              </div>
              <div className="overflow-hidden">
                <div className="text-[12px] font-medium truncate">Biplob</div>
                <div
                  className={`text-[10px] truncate ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  biplob@email.com
                </div>
              </div>
              <LogOut
                size={12}
                className={`ml-auto shrink-0 ${dark ? "text-zinc-600" : "text-zinc-300"}`}
              />
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${dark ? "border-zinc-800" : "border-zinc-200"}`}
          >
            <div>
              <h1 className="text-[15px] font-semibold">{activeBoard.name}</h1>
              <p
                className={`text-[11px] mt-0.5 ${dark ? "text-zinc-500" : "text-zinc-400"}`}
              >
                {activeBoard.posts.length} posts · last updated 2h ago
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-lg border transition-colors ${
                  copied
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : dark
                      ? "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                }`}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy public link"}
              </button>
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-lg border transition-colors ${dark ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700" : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 shadow-sm"}`}
              >
                <Settings size={12} /> Settings
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div
            className={`flex gap-0 px-6 border-b ${dark ? "border-zinc-800" : "border-zinc-200"}`}
          >
            {(["posts", "roadmap"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-[12px] font-medium border-b-2 capitalize transition-colors ${
                  activeTab === tab
                    ? dark
                      ? "border-white text-white"
                      : "border-zinc-800 text-zinc-900"
                    : dark
                      ? "border-transparent text-zinc-500 hover:text-zinc-300"
                      : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {activeTab === "posts" && (
              <>
                {/* Status summary cards */}
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {statusCounts.map(({ status, count }) => {
                    const cfg = STATUS_CONFIG[status];
                    const maxCount = Math.max(
                      ...statusCounts.map((s) => s.count),
                      1,
                    );
                    return (
                      <button
                        key={status}
                        onClick={() =>
                          setFilterStatus(
                            filterStatus === status ? "all" : status,
                          )
                        }
                        className={`p-3 rounded-xl border text-left transition-all ${
                          filterStatus === status
                            ? dark
                              ? `${cfg.bg} border-transparent`
                              : `${cfg.bg} border-transparent ring-2 ring-offset-1`
                            : dark
                              ? "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
                              : "border-zinc-100 bg-white hover:border-zinc-200 shadow-sm"
                        }`}
                      >
                        <div
                          className={`text-xl font-semibold ${filterStatus === status ? cfg.color : ""}`}
                        >
                          {count}
                        </div>
                        <div
                          className={`text-[10px] mt-0.5 ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                        >
                          {cfg.label}
                        </div>
                        <div
                          className={`h-1 rounded-full mt-2 ${dark ? "bg-zinc-800" : "bg-zinc-100"}`}
                        >
                          <div
                            className={`h-full rounded-full ${cfg.bar} transition-all`}
                            style={{ width: `${(count / maxCount) * 100}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Filter label */}
                {filterStatus !== "all" && (
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-[11px] ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                    >
                      Filtered by:
                    </span>
                    <StatusBadge status={filterStatus} />
                    <button
                      onClick={() => setFilterStatus("all")}
                      className={`text-[11px] underline ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Table */}
                <div
                  className={`rounded-xl border overflow-hidden ${dark ? "border-zinc-800" : "border-zinc-200"}`}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={dark ? "bg-zinc-900" : "bg-zinc-50"}>
                        <th
                          className={`text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                        >
                          Title
                        </th>
                        <th
                          className={`text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                        >
                          Votes
                        </th>
                        <th
                          className={`text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                        >
                          Status
                        </th>
                        <th
                          className={`text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                        >
                          Submitted
                        </th>
                        <th className="px-4 py-2.5"></th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${dark ? "divide-zinc-800" : "divide-zinc-100"}`}
                    >
                      {filteredPosts.map((post) => (
                        <tr
                          key={post.id}
                          className={`transition-colors cursor-pointer ${dark ? "hover:bg-zinc-900" : "hover:bg-zinc-50"}`}
                          onClick={() => setSelectedPost(post)}
                        >
                          <td className="px-4 py-3">
                            <div
                              className={`text-[13px] font-medium ${dark ? "text-zinc-100" : "text-zinc-800"}`}
                            >
                              {post.title}
                            </div>
                            <div
                              className={`text-[11px] mt-0.5 flex items-center gap-1 ${dark ? "text-zinc-600" : "text-zinc-400"}`}
                            >
                              <ExternalLink size={9} /> view details
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${dark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600"}`}
                            >
                              <ArrowUp size={10} /> {post.votes}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={post.status} />
                          </td>
                          <td
                            className={`px-4 py-3 text-[12px] ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                          >
                            {post.submittedAt}
                          </td>
                          <td
                            className="px-4 py-3 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <StatusDropdown
                              current={post.status}
                              onChange={(s) => handleStatusChange(post.id, s)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredPosts.length === 0 && (
                    <div
                      className={`py-12 text-center text-[13px] ${dark ? "text-zinc-600" : "text-zinc-400"}`}
                    >
                      No posts with this status.
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "roadmap" && (
              <div className="grid grid-cols-5 gap-4">
                {ALL_STATUSES.map((status) => {
                  const cfg = STATUS_CONFIG[status];
                  const posts = activeBoard.posts.filter(
                    (p) => p.status === status,
                  );
                  return (
                    <div
                      key={status}
                      className={`rounded-xl border p-3 min-h-[300px] ${dark ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-zinc-50"}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wide ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                        <span
                          className={`text-[11px] px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color} font-medium`}
                        >
                          {posts.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {posts.map((post) => (
                          <div
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${dark ? "bg-zinc-800 border-zinc-700 hover:border-zinc-600" : "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm"}`}
                          >
                            <div
                              className={`text-[12px] font-medium leading-snug ${dark ? "text-zinc-200" : "text-zinc-800"}`}
                            >
                              {post.title}
                            </div>
                            <div
                              className={`mt-1.5 flex items-center gap-1 text-[10px] ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                            >
                              <ArrowUp size={9} /> {post.votes}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* ── POST DRAWER ── */}
        {selectedPost && (
          <PostDrawer
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}
