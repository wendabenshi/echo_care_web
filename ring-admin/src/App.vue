<script setup>
import { computed, ref, watch } from "vue";

const STORAGE_KEY = "ring-admin-records";
const ADMIN_KEY_STORAGE = "ring-admin-admin-key";
const defaultBaseUrl = "https://echo-care-web.vercel.app";
const defaultApiBaseUrl = "https://echo-care-web.vercel.app";
const statusOptions = ["active", "disabled", "lost"];
const statusLabels = {
  active: "启用",
  disabled: "停用",
  lost: "丢失",
  draft: "草稿",
};

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadAdminKey() {
  return localStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
}

function normalizeUuid(input) {
  return input.trim();
}

function escapeSql(value) {
  return value.replace(/'/g, "''");
}

function buildLegacyTokenUrl(baseUrl, uuid) {
  const normalizedBase = baseUrl.trim().replace(/\/+$/, "");
  return `${normalizedBase}?token=${encodeURIComponent(uuid)}`;
}

function buildSql(uuid) {
  const escapedUuid = escapeSql(uuid);
  return [
    "insert into page_tokens (token)",
    `values ('${escapedUuid}')`,
    "on conflict (token) do nothing;",
  ].join("\n");
}

function downloadFile(filename, text, mimeType) {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function createRecord({ uuid, note, signedUrl, sig, legacyUrl, sql, ringStatus = "draft" }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    uuid,
    note,
    url: signedUrl,
    sig,
    legacyUrl,
    sql,
    createdAt: new Date().toISOString(),
    signedAt: signedUrl ? new Date().toISOString() : null,
    signError: "",
    ringStatus,
    ringCreatedAt: "",
    ringUpdatedAt: "",
    ringLastSeenAt: "",
  };
}

function formatStatusLabel(status) {
  return statusLabels[status] ?? status ?? statusLabels.draft;
}

const baseUrl = ref(defaultBaseUrl);
const apiBaseUrl = ref(defaultApiBaseUrl);
const adminKey = ref(loadAdminKey());
const showAdminKey = ref(false);
const uuid = ref("");
const note = ref("");
const ringStatusInput = ref("active");
const batchInput = ref("");
const search = ref("");
const toast = ref("");
const records = ref(loadRecords());
const selectedId = ref(records.value[0]?.id ?? null);
const isSigning = ref(false);
const isCheckingRing = ref(false);
const isSavingRingStatus = ref(false);
const isBatchSigning = ref(false);
const isScanningNfc = ref(false);
const isWritingNfc = ref(false);
const highlightWriteButton = ref(false);
const signStatus = ref("");
const signedUrl = ref("");
const signedSig = ref("");
const batchOutput = ref("");

const isAndroid = /Android/i.test(globalThis.navigator?.userAgent ?? "");
const supportsWebNfc =
  isAndroid && globalThis.isSecureContext && typeof globalThis.NDEFReader !== "undefined";

watch(adminKey, (value) => {
  localStorage.setItem(ADMIN_KEY_STORAGE, value);
});

watch(
  records,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    if (!value.some((item) => item.id === selectedId.value)) {
      selectedId.value = value[0]?.id ?? null;
    }
  },
  { deep: true },
);

const normalizedUuid = computed(() => normalizeUuid(uuid.value));
const canGenerate = computed(() => normalizedUuid.value.length > 0);
const legacyUrl = computed(() =>
  canGenerate.value ? buildLegacyTokenUrl(baseUrl.value, normalizedUuid.value) : "",
);
const generatedSql = computed(() =>
  canGenerate.value ? buildSql(normalizedUuid.value) : "",
);

const filteredRecords = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return records.value;
  return records.value.filter((item) => {
    return (
      item.uuid.toLowerCase().includes(term) ||
      item.note.toLowerCase().includes(term) ||
      item.url.toLowerCase().includes(term) ||
      item.legacyUrl.toLowerCase().includes(term) ||
      String(item.ringStatus ?? "").toLowerCase().includes(term)
    );
  });
});

const selectedRecord = computed(() =>
  records.value.find((item) => item.id === selectedId.value) ?? null,
);

function showToast(message) {
  toast.value = message;
  window.clearTimeout(showToast.timerId);
  showToast.timerId = window.setTimeout(() => {
    toast.value = "";
  }, 2200);
}
showToast.timerId = 0;

async function copyText(text, successMessage) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
    return true;
  } catch {
    showToast("复制失败，请重试");
    return false;
  }
}

function normalizeScannedSerial(serialNumber) {
  return String(serialNumber ?? "").trim().toUpperCase();
}

function patchRecord(uuidValue, updates) {
  records.value = records.value.map((item) =>
    item.uuid === uuidValue ? { ...item, ...updates } : item,
  );
}

function applyRingData(uuidValue, ring) {
  if (!ring) return;
  patchRecord(uuidValue, {
    ringStatus: ring.status ?? "draft",
    note: ring.note ?? note.value.trim(),
    ringCreatedAt: ring.created_at ?? "",
    ringUpdatedAt: ring.updated_at ?? "",
    ringLastSeenAt: ring.last_seen_at ?? "",
  });
}

function upsertLocalRecord(payload) {
  const existing = records.value.find((item) => item.uuid === payload.uuid);
  const nextRecord = existing
    ? {
        ...existing,
        note: payload.note,
        url: payload.signedUrl,
        sig: payload.sig,
        legacyUrl: payload.legacyUrl,
        sql: payload.sql,
        signedAt: payload.signedUrl ? new Date().toISOString() : existing.signedAt,
        signError: "",
        ringStatus: payload.ringStatus ?? existing.ringStatus ?? "draft",
      }
    : createRecord(payload);

  records.value = [nextRecord, ...records.value.filter((item) => item.uuid !== nextRecord.uuid)];
  selectedId.value = nextRecord.id;
  return nextRecord;
}

function adminHeaders() {
  return {
    "Content-Type": "application/json",
    "x-ring-admin-key": adminKey.value.trim(),
  };
}

async function persistRingStatus(uid, status, noteValue) {
  const response = await fetch(`${apiBaseUrl.value.replace(/\/+$/, "")}/api/rings`, {
    method: "PATCH",
    headers: adminHeaders(),
    body: JSON.stringify({
      uid,
      status,
      note: noteValue,
      lifecycleStage: "packed",
    }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.ok) {
    throw new Error(result?.error ?? "预注册失败");
  }

  return result.ring ?? null;
}

async function requestSignedRing(uid) {
  const response = await fetch(`${apiBaseUrl.value.replace(/\/+$/, "")}/api/sign-ring`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify({
      uid,
      baseUrl: baseUrl.value.trim(),
    }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.ok) {
    throw new Error(result?.error ?? "生成失败");
  }

  return result;
}

async function generateSignedRing(uidValue, successMessage = "签名链接已生成") {
  if (!adminKey.value.trim()) {
    signStatus.value = "请先输入管理员密钥";
    showToast("需要先填写管理员密钥");
    return false;
  }

  isSigning.value = true;
  signStatus.value = "";

  try {
    const normalized = normalizeUuid(uidValue);
    if (!normalized) return false;

    const result = await requestSignedRing(normalized);

    signedUrl.value = result.url;
    signedSig.value = result.sig;
    const persistedRing = await persistRingStatus(
      normalized,
      ringStatusInput.value,
      note.value.trim(),
    );

    const nextRecord = upsertLocalRecord({
      uuid: normalized,
      note: note.value.trim(),
      signedUrl: result.url,
      sig: result.sig,
      legacyUrl: buildLegacyTokenUrl(baseUrl.value, normalized),
      sql: buildSql(normalized),
      ringStatus: ringStatusInput.value,
    });
    applyRingData(normalized, persistedRing);

    signStatus.value = "签名链接已生成，并已预注册到 Supabase";
    highlightWriteButton.value = supportsWebNfc;
    showToast(successMessage);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "生成失败";
    patchRecord(normalizeUuid(uidValue), { signError: message });
    signStatus.value = `生成失败：${message}`;
    showToast("生成失败");
    return false;
  } finally {
    isSigning.value = false;
  }
}

async function signRingUrl() {
  if (!canGenerate.value || isSigning.value) return;
  await generateSignedRing(normalizedUuid.value);
}

async function scanNfcUuid() {
  if (!supportsWebNfc || isScanningNfc.value) return;

  isScanningNfc.value = true;
  signStatus.value = "请将 NFC 芯片贴近手机背面";

  try {
    const ndef = new NDEFReader();
    await ndef.scan();

    await new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        reject(new Error("读取超时，请重试"));
      }, 15000);

      ndef.onreadingerror = () => {
        window.clearTimeout(timeoutId);
        reject(new Error("读取失败，请调整贴卡位置后重试"));
      };

      ndef.onreading = (event) => {
        window.clearTimeout(timeoutId);
        const serial = normalizeScannedSerial(event.serialNumber);

        if (!serial) {
          reject(new Error("当前标签未返回可用 UUID"));
          return;
        }

        uuid.value = serial;
        signStatus.value = `已读取 UUID：${serial}，正在生成链接`;
        showToast("芯片 UUID 已读取");
        resolve();
      };
    });

    await generateSignedRing(uuid.value, "已读取 UUID 并生成链接");
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取失败";
    signStatus.value = `读取芯片失败：${message}`;
    showToast("读取芯片失败");
  } finally {
    isScanningNfc.value = false;
  }
}

async function writeSignedUrlToNfc() {
  if (!supportsWebNfc || isWritingNfc.value || !signedUrl.value) return;

  isWritingNfc.value = true;
  signStatus.value = "请将 NFC 芯片贴近手机背面以写入链接";

  try {
    const ndef = new NDEFReader();
    await ndef.write({
      records: [{ recordType: "url", data: signedUrl.value }],
    });
    signStatus.value = "签名链接已写入 NFC";
    highlightWriteButton.value = false;
    showToast("写入成功");
  } catch (error) {
    const message = error instanceof Error ? error.message : "写入失败";
    signStatus.value = `写入芯片失败：${message}`;
    showToast("写入芯片失败");
  } finally {
    isWritingNfc.value = false;
  }
}

function parseBatchInput() {
  return [...new Set(
    batchInput.value
      .split(/\r?\n/)
      .map((line) => normalizeUuid(line))
      .filter(Boolean),
  )];
}

async function batchSignRings() {
  if (isBatchSigning.value) return;
  if (!adminKey.value.trim()) {
    signStatus.value = "请先输入管理员密钥";
    showToast("需要先填写管理员密钥");
    return;
  }

  const uuids = parseBatchInput();
  if (uuids.length === 0) {
    showToast("请至少粘贴一个 UUID");
    return;
  }

  isBatchSigning.value = true;
  signStatus.value = `正在批量生成，共 ${uuids.length} 个 UUID`;

  const lines = [];
  let successCount = 0;

  for (const currentUuid of uuids) {
    try {
      const result = await requestSignedRing(currentUuid);
      const persistedRing = await persistRingStatus(
        currentUuid,
        ringStatusInput.value,
        note.value.trim(),
      );
      upsertLocalRecord({
        uuid: currentUuid,
        note: note.value.trim(),
        signedUrl: result.url,
        sig: result.sig,
        legacyUrl: buildLegacyTokenUrl(baseUrl.value, currentUuid),
        sql: buildSql(currentUuid),
        ringStatus: ringStatusInput.value,
      });
      applyRingData(currentUuid, persistedRing);
      lines.push(`${currentUuid},${result.url}`);
      successCount += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : "生成失败";
      upsertLocalRecord({
        uuid: currentUuid,
        note: note.value.trim(),
        signedUrl: "",
        sig: "",
        legacyUrl: buildLegacyTokenUrl(baseUrl.value, currentUuid),
        sql: buildSql(currentUuid),
        ringStatus: ringStatusInput.value,
      });
      patchRecord(currentUuid, { signError: message });
      lines.push(`${currentUuid},ERROR: ${message}`);
    }
  }

  batchOutput.value = lines.join("\n");
  signStatus.value = `批量生成完成：${successCount}/${uuids.length} 成功`;
  showToast(`批量完成：${successCount}/${uuids.length}`);
  isBatchSigning.value = false;
}

function saveLocalOnly() {
  if (!canGenerate.value) return;

  upsertLocalRecord({
    uuid: normalizedUuid.value,
    note: note.value.trim(),
    signedUrl: signedUrl.value,
    sig: signedSig.value,
    legacyUrl: legacyUrl.value,
    sql: generatedSql.value,
    ringStatus: ringStatusInput.value,
  });
  showToast("已保存到本地历史");
}

async function fetchRingStatus() {
  if (!canGenerate.value || isCheckingRing.value) return;
  if (!adminKey.value.trim()) {
    signStatus.value = "请先输入管理员密钥";
    showToast("需要先填写管理员密钥");
    return;
  }

  isCheckingRing.value = true;

  try {
    const response = await fetch(
      `${apiBaseUrl.value.replace(/\/+$/, "")}/api/rings?uid=${encodeURIComponent(normalizedUuid.value)}`,
      {
        method: "GET",
        headers: {
          "x-ring-admin-key": adminKey.value.trim(),
        },
      },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      throw new Error(result?.error ?? "读取失败");
    }

    if (result.found && result.ring) {
      ringStatusInput.value = result.ring.status ?? "active";
      note.value = result.ring.note ?? note.value;
      applyRingData(normalizedUuid.value, result.ring);
      signStatus.value = `已读取戒指：${formatStatusLabel(result.ring.status)}`;
      showToast("已从 Supabase 读取戒指");
    } else {
      signStatus.value = "Supabase 中还没有这枚戒指";
      showToast("未找到戒指");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取失败";
    signStatus.value = `读取失败：${message}`;
    showToast("读取失败");
  } finally {
    isCheckingRing.value = false;
  }
}

async function saveRingStatus() {
  if (!canGenerate.value || isSavingRingStatus.value) return;
  if (!adminKey.value.trim()) {
    signStatus.value = "请先输入管理员密钥";
    showToast("需要先填写管理员密钥");
    return;
  }

  isSavingRingStatus.value = true;

  try {
    const response = await fetch(`${apiBaseUrl.value.replace(/\/+$/, "")}/api/rings`, {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({
        uid: normalizedUuid.value,
        status: ringStatusInput.value,
        note: note.value.trim(),
      }),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      throw new Error(result?.error ?? "保存失败");
    }

    applyRingData(normalizedUuid.value, result.ring);
    upsertLocalRecord({
      uuid: normalizedUuid.value,
      note: result.ring?.note ?? note.value.trim(),
      signedUrl: signedUrl.value,
      sig: signedSig.value,
      legacyUrl: legacyUrl.value,
      sql: generatedSql.value,
      ringStatus: result.ring?.status ?? ringStatusInput.value,
    });
    signStatus.value = `戒指状态已保存：${formatStatusLabel(result.ring?.status ?? ringStatusInput.value)}`;
    showToast("戒指状态已保存");
  } catch (error) {
    const message = error instanceof Error ? error.message : "保存失败";
    signStatus.value = `保存失败：${message}`;
    showToast("保存失败");
  } finally {
    isSavingRingStatus.value = false;
  }
}

function useRecord(record) {
  uuid.value = record.uuid;
  note.value = record.note;
  signedUrl.value = record.url;
  signedSig.value = record.sig ?? "";
  ringStatusInput.value = record.ringStatus && record.ringStatus !== "draft" ? record.ringStatus : "active";
  selectedId.value = record.id;
  signStatus.value = record.signedAt
    ? `最近生成时间：${new Date(record.signedAt).toLocaleString()}`
    : "";
  showToast("已载入左侧表单");
}

function deleteRecord(id) {
  records.value = records.value.filter((item) => item.id !== id);
  showToast("已从本地历史删除");
}

function exportCsv() {
  const header = [
    "uuid",
    "note",
    "ring_status",
    "signed_url",
    "signature",
    "legacy_url",
    "created_at",
    "signed_at",
    "ring_created_at",
    "ring_updated_at",
    "ring_last_seen_at",
    "sign_error",
  ];
  const rows = records.value.map((item) => [
    item.uuid,
    item.note,
    item.ringStatus ?? "",
    item.url,
    item.sig ?? "",
    item.legacyUrl ?? "",
    item.createdAt,
    item.signedAt ?? "",
    item.ringCreatedAt ?? "",
    item.ringUpdatedAt ?? "",
    item.ringLastSeenAt ?? "",
    item.signError ?? "",
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  downloadFile("ring-admin-records.csv", csv, "text/csv;charset=utf-8");
  showToast("CSV 已导出");
}

function exportJson() {
  downloadFile(
    "ring-admin-records.json",
    JSON.stringify(records.value, null, 2),
    "application/json;charset=utf-8",
  );
  showToast("JSON 已导出");
}

function resetForm() {
  uuid.value = "";
  note.value = "";
  signedUrl.value = "";
  signedSig.value = "";
  ringStatusInput.value = "active";
  batchInput.value = "";
  batchOutput.value = "";
  signStatus.value = "";
  highlightWriteButton.value = false;
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar card">
      <div class="sidebar__header">
        <p class="eyebrow">内部工具</p>
        <h1>戒指管理</h1>
      </div>

      <div class="field-group">
        <label class="label" for="admin-key">管理员密钥</label>
        <div style="display: flex; gap: 10px; align-items: center;">
          <input
            id="admin-key"
            v-model="adminKey"
            class="input"
            :type="showAdminKey ? 'text' : 'password'"
            placeholder="请输入管理员密钥"
          />
          <button class="button button--ghost" type="button" @click="showAdminKey = !showAdminKey">
            {{ showAdminKey ? "隐藏" : "显示" }}
          </button>
        </div>
      </div>

      <div class="field-group">
        <label class="label" for="uuid">NFC UUID</label>
        <input
          id="uuid"
          v-model="uuid"
          class="input"
          type="text"
          placeholder="请输入戒指芯片的 UUID"
        />
      </div>

      <div v-if="supportsWebNfc" class="button-row">
        <button class="button button--ghost" :disabled="isScanningNfc" @click="scanNfcUuid">
          {{ isScanningNfc ? "读取中..." : "读取芯片 UUID" }}
        </button>
        <button
          class="button"
          :class="highlightWriteButton ? 'button--primary' : 'button--ghost'"
          :disabled="!signedUrl || isWritingNfc"
          @click="writeSignedUrlToNfc"
        >
          {{ isWritingNfc ? "写入中..." : "写入生成链接" }}
        </button>
      </div>

      <div class="button-row">
        <button class="button button--primary" :disabled="!canGenerate || isSigning" @click="signRingUrl">
          {{ isSigning ? "生成中..." : "生成链接" }}
        </button>
        <button class="button button--accent" :disabled="!canGenerate || isCheckingRing" @click="fetchRingStatus">
          {{ isCheckingRing ? "读取中..." : "读取戒指" }}
        </button>
        <button class="button button--accent" :disabled="!canGenerate || isSavingRingStatus" @click="saveRingStatus">
          {{ isSavingRingStatus ? "保存中..." : "保存状态" }}
        </button>
        <button class="button button--ghost" @click="resetForm">
          重置
        </button>
      </div>

      <p v-if="signStatus" class="status-line">{{ signStatus }}</p>

      <div class="result-block">
        <div class="result-block__head">
          <h2>NFC 签名链接</h2>
          <button class="link-button" :disabled="!signedUrl" @click="copyText(signedUrl, '签名链接已复制')">
            复制
          </button>
        </div>
        <textarea class="textarea textarea--result" readonly :value="signedUrl" />
      </div>

      <details class="card" style="margin-top: 18px;">
        <summary class="label" style="cursor: pointer;">高级功能</summary>

        <div class="field-group" style="margin-top: 16px;">
          <label class="label" for="ring-status">戒指状态</label>
          <select id="ring-status" v-model="ringStatusInput" class="input input--select">
            <option v-for="status in statusOptions" :key="status" :value="status">
              {{ formatStatusLabel(status) }}
            </option>
          </select>
        </div>

        <div class="field-group">
          <label class="label" for="note">备注</label>
          <textarea
            id="note"
            v-model="note"
            class="textarea"
            rows="4"
            placeholder="可选备注，例如批次信息、客户名称、用途说明"
          />
        </div>

        <div class="button-row">
          <button class="button button--primary" :disabled="isBatchSigning" @click="batchSignRings">
            {{ isBatchSigning ? "批量生成中..." : "批量生成" }}
          </button>
          <button class="button button--ghost" :disabled="!canGenerate" @click="saveLocalOnly">
            仅保存本地
          </button>
        </div>

        <div class="field-group">
          <label class="label" for="batch-input">批量 UUID</label>
          <textarea
            id="batch-input"
            v-model="batchInput"
            class="textarea"
            rows="5"
            placeholder="每行填一个 UUID"
          />
        </div>

        <div class="field-group">
          <label class="label" for="base-url">正式网页地址</label>
          <input id="base-url" v-model="baseUrl" class="input" type="text" />
        </div>

        <div class="field-group">
          <label class="label" for="api-base-url">API 地址</label>
          <input id="api-base-url" v-model="apiBaseUrl" class="input" type="text" />
        </div>

        <div class="result-block">
          <div class="result-block__head">
            <h2>签名值</h2>
            <button class="link-button" :disabled="!signedSig" @click="copyText(signedSig, '签名值已复制')">
              复制
            </button>
          </div>
          <textarea class="textarea textarea--result" readonly :value="signedSig" />
        </div>

        <div class="result-block">
          <div class="result-block__head">
            <h2>旧版备用链接</h2>
            <button class="link-button" :disabled="!legacyUrl" @click="copyText(legacyUrl, '备用链接已复制')">
              复制
            </button>
          </div>
          <textarea class="textarea textarea--result" readonly :value="legacyUrl" />
        </div>

        <div class="result-block">
          <div class="result-block__head">
            <h2>批量结果</h2>
            <button class="link-button" :disabled="!batchOutput" @click="copyText(batchOutput, '批量结果已复制')">
              复制
            </button>
          </div>
          <textarea
            class="textarea textarea--result textarea--code"
            readonly
            :value="batchOutput"
            placeholder="格式：uuid,签名链接"
          />
        </div>
      </details>
    </aside>

    <main class="content">
      <details class="card" style="margin-top: 0;">
        <summary class="label" style="cursor: pointer;">历史记录与导出</summary>

        <section class="toolbar" style="margin-top: 16px;">
          <div class="toolbar__left">
            <p class="eyebrow">历史记录</p>
            <h2>已保存戒指</h2>
          </div>

          <div class="toolbar__right">
            <input v-model="search" class="input input--search" type="text" placeholder="搜索 uuid、备注、链接" />
            <button class="button button--ghost" :disabled="records.length === 0" @click="exportCsv">
              导出 CSV
            </button>
            <button class="button button--ghost" :disabled="records.length === 0" @click="exportJson">
              导出 JSON
            </button>
          </div>
        </section>

        <section class="grid" style="margin-top: 16px;">
          <div class="card list-card">
            <div v-if="filteredRecords.length === 0" class="empty-state">
              <p>还没有记录。</p>
              <span>先在左侧生成一条链接，记录就会出现在这里。</span>
            </div>

            <button
              v-for="record in filteredRecords"
              :key="record.id"
              class="record-item"
              :class="{ 'record-item--active': record.id === selectedId }"
              @click="selectedId = record.id"
            >
              <div class="record-item__main">
                <strong>{{ record.uuid }}</strong>
                <span>{{ record.note || "无备注" }}</span>
              </div>
              <div class="record-item__meta">
                <span class="pill" :class="record.ringStatus === 'active' ? 'pill--ok' : record.ringStatus ? 'pill--warn' : 'pill--muted'">
                  {{ formatStatusLabel(record.ringStatus) }}
                </span>
                <time>{{ new Date(record.createdAt).toLocaleString() }}</time>
              </div>
            </button>
          </div>

          <div class="card detail-card">
            <template v-if="selectedRecord">
              <div class="detail-card__header">
                <div>
                  <p class="eyebrow">详情</p>
                  <h2>{{ selectedRecord.uuid }}</h2>
                </div>

                <div class="button-row">
                  <button class="button button--ghost" @click="useRecord(selectedRecord)">
                    载入左侧表单
                  </button>
                  <button class="button button--danger" @click="deleteRecord(selectedRecord.id)">
                    删除
                  </button>
                </div>
              </div>

              <div class="detail-row">
                <label class="label">创建时间</label>
                <div class="detail-value">{{ new Date(selectedRecord.createdAt).toLocaleString() }}</div>
              </div>

              <div class="detail-row">
                <label class="label">戒指状态</label>
                <div class="detail-value">{{ formatStatusLabel(selectedRecord.ringStatus) }}</div>
              </div>

              <div class="detail-row">
                <label class="label">最近访问时间</label>
                <div class="detail-value">
                  {{ selectedRecord.ringLastSeenAt ? new Date(selectedRecord.ringLastSeenAt).toLocaleString() : "还没有访问记录" }}
                </div>
              </div>

              <div class="detail-row">
                <label class="label">备注</label>
                <div class="detail-value">{{ selectedRecord.note || "无备注" }}</div>
              </div>

              <div class="detail-row">
                <label class="label">签名链接</label>
                <textarea class="textarea textarea--result" readonly :value="selectedRecord.url" />
                <button class="link-button link-button--inline" @click="copyText(selectedRecord.url, '签名链接已复制')">
                  复制签名链接
                </button>
              </div>

              <div class="detail-row">
                <label class="label">签名值</label>
                <textarea class="textarea textarea--result" readonly :value="selectedRecord.sig ?? ''" />
                <button class="link-button link-button--inline" @click="copyText(selectedRecord.sig ?? '', '签名值已复制')">
                  复制签名值
                </button>
              </div>

              <div class="detail-row">
                <label class="label">旧版备用链接</label>
                <textarea class="textarea textarea--result" readonly :value="selectedRecord.legacyUrl ?? ''" />
                <button class="link-button link-button--inline" @click="copyText(selectedRecord.legacyUrl ?? '', '备用链接已复制')">
                  复制备用链接
                </button>
              </div>

              <div class="detail-row">
                <label class="label">旧版备用 SQL</label>
                <textarea class="textarea textarea--result textarea--code" readonly :value="selectedRecord.sql" />
                <button class="link-button link-button--inline" @click="copyText(selectedRecord.sql, 'SQL 已复制')">
                  复制 SQL
                </button>
              </div>
            </template>

            <div v-else class="empty-state">
              <p>还没有选中记录。</p>
              <span>点击左边历史列表中的一项，就能在这里看到详情。</span>
            </div>
          </div>
        </section>
      </details>
    </main>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>
